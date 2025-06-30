# Using an official Python runtime as a parent image
FROM python:3.9-slim

# Working directory in the container
WORKDIR /usr/src/app

# System dependencies that might be needed by some Python packages
RUN apt-get update && apt-get install -y build-essential

# Copying the requirements file into the container and install dependencies
# Done first to leverage Docker's layer caching
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copying the rest of the project files into the container
COPY . .

# The command to run when the container starts
CMD ["scrapy", "crawl", "memespider"]