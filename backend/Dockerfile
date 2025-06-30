# Using an official Python runtime as a parent image
FROM python:3.9-slim

# Working directory inside the container
WORKDIR /usr/src/app

# System dependencies that might be needed by some Python packages
RUN apt-get update && apt-get install -y build-essential

# Copy the requirements file and install dependencies first to leverage caching
# Done first to leverage Docker's layer caching
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copying the rest of the project files into the container
COPY . .

# Making the startup script executable (double-check)
RUN chmod +x /usr/src/app/start.sh

# Tcommand to run when the container starts
CMD ["./start.sh"]