# **Meme Stock Analyzer Platform**

An end-to-end, full-stack application for scraping, analyzing, and serving data on meme popularity trends. This project serves as a technical demonstration of a modern, decoupled, cloud-native architecture.  
The premise is a parody of financial analytics, applied to the ephemeral and chaotic market of internet memes.

### **Core Architecture**

![Screen Shot 2025-06-28 at 2 24 05 PM](https://github.com/user-attachments/assets/deac21cb-6c7f-47a6-ba9a-fd7c66ceed6c)

The system is composed of three distinct services operating asynchronously.

1. **Scraper (`/scraper`):** A Python service using **Scrapy**. Crawls specified subreddits, extracts raw post data, and pushes it into a message queue. It collects; it doesn't think.  
2. **Backend (`/backend`):** A Python **FastAPI** application. This is the system's core.  
   * An **SQS Worker** consumes messages from the queue, processes the data, generates vector embeddings for semantic analysis, and persists the results to the database.  
   * An **API Server** exposes RESTful endpoints for the frontend to consume, <ins>including a semantic search endpoint powered by vector similarity.</ins>  
3. **Frontend (`/frontend`):** A **React** single-page application built with **Vite**. Provides the user interface for data visualization and interaction.

<img width="1675" alt="Screenshot 2025-06-29 at 11 37 17 PM" src="https://github.com/user-attachments/assets/73322bff-2584-476a-a52e-8a28e02b622f" />

### **Tech Stack**

| Domain | Technology | Purpose |
| :---- | :---- | :---- |
| **Scraping** | Scrapy | Efficient, asynchronous web crawling. |
| **Backend** | FastAPI, SQLModel | High-performance API, data validation, ORM. |
| **Frontend** | React, Vite, Chakra UI | Modern UI development, fast tooling, component library. |
| **Database** | PostgreSQL \+ `pgvector` | Relational data storage and vector similarity search. |
| **Messaging** | AWS SQS | Decoupled, reliable message queueing. |
| **Hosting** | AWS ECR, AWS Fargate | Container registry and serverless container orchestration. |
| **Tooling** | Docker | Containerization for consistent environments. |

## **Getting Started**

Each service is self-contained and has its own setup instructions. Refer to the README.md within each respective directory (`/scraper`, `/backend`, `/frontend`) for detailed local setup and execution commands. 

To run the full stack locally, you will need `Docker`. A global `.env` file in the root is required for cloud service credentials. See `.env.example` for the required schema.


## **Future Improvements & Roadmap**

The following are key areas for future development.

### **New Features**
1. **Data Upsert Logic:** I observed that the database may contain multiple entries for memes with identical titles or images, differing only in scores and comment counts. This is not a bug, but rather a reflection of the data source (i.e. reposts) and an opportunity for further refinement.
2. **Cross-Platform Analysis:** Expand the scraper service into a multi-source ingestion engine, pulling data from other culturally relevant platforms like Twitter or other Subreddits to create a more holistic "Meme Index."
3. **Historical Performance & Charting:** Track the `hype_score` over time for each meme. This would enable a new API endpoint to serve time-series data, allowing the frontend to display charts of a meme's popularity trajectory, similar to a stock chart.
4. **Sentiment Analysis:** Enhance the worker pipeline to perform sentiment analysis on post comments using a library like `TextBlob` or a service like AWS Comprehend. This would add a new dimension to the analytics, showing not just the volume of discussion but also its nature (positive, negative, neutral).

### **Security Enhancements**
1. **Secrets Management** (production-ready approach), 2.**Private Networking** (VPC private subnet), 3. **API Rate Limit** (DoS & abuses)

### **Efficiency & Performance Optimizations**
1. **Batch Database Writes** (worker), 2.**Caching Layer** (in front of endpoints)

### **Testability Improvements**
1. **Unit & Integration Test Suite** (pytest, TestClient), 2. **Decoupling Worker Logic**
