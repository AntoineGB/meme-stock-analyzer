# **Service: Backend**

This service is the core application logic. It's a FastAPI project that processes data, serves an API, and handles semantic search.

### **Components**

This service runs two processes concurrently:

1. **API Server (`app/main.py`):**  
   * Exposes a REST API for the frontend.  
   * `GET /memes`: Retrieves a paginated list of memes, ordered by `hype_score`.  
   * `POST /search`: Performs a vector-based semantic search on meme titles. 
2. **SQS Worker (`app/worker.py`):**  
   * Polls an AWS SQS queue for incoming data from the scraper.  
   * Calculates a `hype_score` for each meme.  
   * Uses `sentence-transformers` to generate a vector embedding from the title.  
   * Persists the processed record to the PostgreSQL database.

### **Local Execution**

Prerequisites: Python 3.8+, `virtualenv`, Docker (optional).

1. **Setup Environment:**  
   ```
   # From within the /backend directory  
   python3 -m venv venv  
   source venv/bin/activate  
   pip install -r requirements.txt
   ```
   `source venv/bin/activate` is sourcing for **Unix | MacOs** only.
2. Configure Credentials:  
   Ensure the root `.env` file is populated with **YOUR** valid DB_ and AWS_ credentials.  
3. **Run the Application (Requires two terminals):**  
   ```
   # Terminal 1: Run the API Server  
   uvicorn app.main:app --reload
   ```

   ```
   # Terminal 2: Run the Worker  
   python -m app.worker
   ```

### **Docker Execution**

The `start.sh` script handles running both processes inside the container.

1. **Build the image:**  
   ```
   docker build -t meme-backend .
   ```

2. Run the container:  
   The container requires environment variables and port mapping.  
   ```
   # From the /backend directory  
   docker run --rm -p 8000:8000 --env-file ../.env meme-backend
   ```  
