# meme_scraper/spiders/memespider.py
import scrapy
import boto3
import json
import logging # Logging library

class MemespiderSpider(scrapy.Spider):
    name = "memespider"
    allowed_domains = ["old.reddit.com"]
    start_urls = ["https://old.reddit.com/r/MemeEconomy/"]

    # Our __init__ method: receives the objects it needs from
    # the from_crawler method.
    def __init__(self, sqs_client, sqs_queue_url, *args, **kwargs):
        super(MemespiderSpider, self).__init__(*args, **kwargs)
        self.sqs_client = sqs_client
        self.sqs_queue_url = sqs_queue_url

    @classmethod
    def from_crawler(cls, crawler):
        """
        This is the Scrapy-aware method for creating a spider instance.
        It's called by the Scrapy engine and is the perfect place to
        access settings and instantiate clients.
        """
        # Get settings from the crawler object
        settings = crawler.settings
        aws_region = settings.get('AWS_REGION')
        sqs_queue_url = settings.get('SQS_QUEUE_URL')

        # Create the SQS client here
        sqs_client = boto3.client(
            'sqs',
            region_name=aws_region
        )

        # Create an instance of the spider and pass the client and URL to its __init__ method
        return cls(
            sqs_client=sqs_client,
            sqs_queue_url=sqs_queue_url
        )

    def parse(self, response):
        # Looking for the main container for each post.
        # For old.reddit, this is a div with the class "thing"
        posts = response.css('div.thing')

        # Loop through each post found on the page
        for post in posts:
            # Cleaning up the number of comments
            num_comments_text = post.css('a.comments::text').get()
            num_comments = 0  # Default to 0 comments
            if num_comments_text:
                try:
                    # Common use cases i.e "12 comments"
                    num_comments = int(num_comments_text.split()[0])
                except ValueError:
                    # catching int() conversion fails.
                    # If 0 comment, num_comments_text.split()[0] is "comment"
                    if 'comment' in num_comments_text:
                        num_comments = 0

            # Dictionary with the scraped data
            # Using CSS selectors to extract the data we need.
            # The ::attr(attribute_name) syntax gets the value of an attribute.
            # The ::text syntax gets the text content of an element.
            data = {
                'title': post.css('p.title a.title::text').get(),
                'image_url': post.css('div.thing::attr(data-url)').get(),
                'score': int(post.css('div.score.unvoted::attr(title)').get() or 0),
                'num_comments': num_comments,
                'post_url': response.urljoin(post.css('a.comments::attr(href)').get())
            }

            # Send the data to SQS
            self.send_to_sqs(data)

        # Follow pagination
        next_page = response.css('span.next-button a::attr(href)').get()
        if next_page is not None:
            # If a next page exists, call this same parse method on that page
            yield response.follow(next_page, self.parse)


    def send_to_sqs(self, data):
        """Converts data to JSON and sends it as a message to the SQS queue."""
        try:
            # The message body must be a string
            message_body = json.dumps(data)
            self.sqs_client.send_message(
                QueueUrl=self.sqs_queue_url,
                MessageBody=message_body
            )
            # Use Scrapy's logger to confirm message was sent
            self.logger.info(f"Successfully sent message to SQS for post: {data.get('title')}")
        except Exception as e:
            self.logger.error(f"Error sending message to SQS: {e}")