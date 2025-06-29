# app/main.py
from fastapi import FastAPI
from typing import List
from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from sentence_transformers import SentenceTransformer

from .database import create_db_and_tables, get_session
from .models import Meme, MemeRead, SearchRequest

# Defining a global variable for the model
model = None

# Creating the main FastAPI appl instance
app = FastAPI(
    title="Meme Stock Analyzer API",
    description="API for scraping and analyzing meme popularity.",
    version="0.1.0"
)

# CORS middleware block
origins = [
    "http://localhost:5173", # Our React App
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods
    allow_headers=["*"], # Allow all headers
)
# --- End of middleware block ---

@app.on_event("startup")
def on_startup():
    # This function will be executed when the application starts
    create_db_and_tables()

    # Load the model during startup
    global model
    model = SentenceTransformer('all-MiniLM-L6-v2')

@app.get("/", tags=["Root"])
def read_root():
    """A simple root endpoint to confirm the API is running."""
    return {"message": "Welcome to the Meme Stock Analyzer API!"}


@app.get("/memes", response_model=List[MemeRead], tags=["Memes"])
def read_memes(
    *,
    session: Session = Depends(get_session),
    skip: int = 0,
    limit: int = Query(default=100, le=100) # 'le' = less than or equal to
    
):
    """
    Retrieve a list of memes from the database, ordered by hype score, with pagination.
    """
    # Gotta love the modern SQLModel <3
    statement = select(Meme).order_by(Meme.hype_score.desc()).offset(skip).limit(limit)
    memes = session.exec(statement).all()
    return memes


@app.post("/search", response_model=List[MemeRead], tags=["Memes"])
def search_memes(
    *,
    request: SearchRequest,
    session: Session = Depends(get_session)
):
    """
    Perform a semantic search for memes based on a query string.
    """
    # Getting the query text from the request body
    query_text = request.query

    # Converting the user's query into a vector embedding
    query_vector = model.encode(query_text).tolist()

    # Ordering by cosine distance (<=>) first, then by hype_score as a tie-breaker.
    statement = (
        select(Meme)
        .order_by(Meme.title_vector.cosine_distance(query_vector), Meme.hype_score.desc())
        .limit(20)
    )
    results = session.exec(statement).all()
    return results