#!/bin/bash

# Start the Uvicorn server in the background
# We use 0.0.0.0 to bind to all network interfaces inside the container
echo "Starting Uvicorn server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# Start the SQS worker in the foreground
echo "Starting SQS worker..."
python -m app.worker