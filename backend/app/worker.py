# app/worker.py
import boto3
import json
import logging
import time
from sqlmodel import Session
from sentence_transformers import SentenceTransformer

from app.database import engine, SQS_QUEUE_URL, AWS_REGION
from app.models import Meme

# --- Setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the sentence-transformer model. Done once, when the worker starts.
logger.info("Loading sentence-transformer model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
logger.info("Model loaded successfully.")


sqs_client = boto3.client('sqs', region_name=AWS_REGION)

def calculate_hype_score(score: int, num_comments: int) -> float:
    """A simple algorithm to weigh upvotes and comments."""
    # SUBJECT TO CHANGE: For now, comments are 5 times more valuable than upvotes.
    return (score * 1.0) + (num_comments * 5.0)

def process_messages():
    logger.info("Worker started. Polling for messages...")

    while True:
        try:
            # Long Polling: Wait up to 20 seconds for a message to arrive.
            # More efficient than constantly hitting the API.
            response = sqs_client.receive_message(
                QueueUrl=SQS_QUEUE_URL,
                MaxNumberOfMessages=10, # Process up to 10 messages at a time
                WaitTimeSeconds=20
            )

            messages = response.get('Messages', [])
            if not messages:
                # No messages, loop will continue after a short sleep
                continue

            logger.info(f"Received {len(messages)} new messages.")

            with Session(engine) as session:
                for message in messages:
                    try:
                        data = json.loads(message['Body'])

                        # Generating the vector embedding for the title
                        title_vector = model.encode(data['title']).tolist()

                        # Calculating the hype score
                        hype_score = calculate_hype_score(data['score'], data['num_comments'])

                        # Creating a Meme object with the data and the new vector
                        meme_to_save = Meme(
                            title=data.get('title', 'No Title'),
                            image_url=data.get('image_url', ''),
                            post_url=data.get('post_url', ''),
                            score=data.get('score', 0),
                            num_comments=data.get('num_comments', 0),
                            title_vector=title_vector,
                            hype_score=hype_score
                        )

                        # Add to the database session then commit
                        session.add(meme_to_save)
                        session.commit()
                        session.refresh(meme_to_save)

                        logger.info(f"Saved meme ID {meme_to_save.id} - Hype: {hype_score:.2f}")

                        # CRITICAL: Delete the message from the queue afterward
                        sqs_client.delete_message(
                            QueueUrl=SQS_QUEUE_URL,
                            ReceiptHandle=message['ReceiptHandle']
                        )
                    except Exception as e:
                        logger.error(f"Error processing message: {message['MessageId']}. Error: {e}")
                        # In a real app, move this message to a Dead-Letter Queue (DLQ)

        except Exception as e:
            logger.error(f"An unexpected error occurred in the main loop: {e}")
            time.sleep(10) # Wait 10 before retrying

# make it runnable
if __name__ == "__main__":
    process_messages()