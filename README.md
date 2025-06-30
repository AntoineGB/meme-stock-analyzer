# **Meme Stock Analyser Platform**

An end-to-end, full-stack application for scraping, analyzing, and serving data on meme popularity trends. This project serves as a technical demonstration of a modern, decoupled, cloud-native architecture.  
The premise is a parody of financial analytics, applied to the ephemeral and chaotic market of internet memes.

### **Core Architecture**

The system is composed of three distinct services operating asynchronously.

1. **Scraper (`/scraper`):** A Python service using **Scrapy**. Crawls specified subreddits, extracts raw post data, and pushes it into a message queue. It collects; it doesn't think.  
2. **Backend (`/backend`):** A Python **FastAPI** application. This is the system's core.  
   * An **SQS Worker** consumes messages from the queue, processes the data, generates vector embeddings for semantic analysis, and persists the results to the database.  
   * An **API Server** exposes RESTful endpoints for the frontend to consume, including a semantic search endpoint powered by vector similarity.  
3. **Frontend (`/frontend`):** A **React** single-page application built with **Vite**. Provides the user interface for data visualization and interaction.

(TODO: Screenshot)

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

### **Getting Started**

Each service is self-contained and has its own setup instructions. Refer to the README.md within each respective directory (`/scraper`, `/backend`, `/frontend`) for detailed local setup and execution commands. 

To run the full stack locally, you will need `Docker`. A global `.env` file in the root is required for cloud service credentials. See `.env.example` for the required schema.