# **Service: Scraper**

This service is responsible for data acquisition. It's a `Scrapy` project configured to crawl `Reddit` and extract data points for meme posts.

### **Function**

* Crawls specified subreddits (by default, `r/MemeEconomy`).  
* Extracts post title, image URL, score, and comment count.  
* Cleans the extracted data into a structured format.  
* Pushes a JSON message for each post into an AWS SQS queue for downstream processing.

### **Local Execution**

Prerequisites: Python 3.8+, virtualenv, Docker (optional).

1. **Setup Environment:**  
   ```
   # From within the /scraper directory  
   python3 -m venv venv  
   source venv/bin/activate  
   pip install -r requirements.txt
   ```

2. Configure Credentials:  
   Ensure the root `.env` file is populated with **YOUR** valid `AWS_` credentials and the `SQS_QUEUE_URL`.
3. **Run the Spider:**  
   ```
   scrapy crawl memespider
   ```

### **Docker Execution**

The project is containerized for portability.

1. **Build the image:**  
   ```
   docker build \-t meme-scraper .
   ```

2. Run the container:  
   The container requires the root `.env` file to be passed for AWS credentials.  
   ```
   # From the /scraper directory  
   docker run --rm --env-file ../.env meme-scraper
   ```
