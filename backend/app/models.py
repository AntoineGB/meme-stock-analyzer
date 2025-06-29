# app/models.py
from typing import Optional
from sqlmodel import Field, SQLModel, Column
from pgvector.sqlalchemy import Vector
from typing import List

class Meme(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    image_url: str
    post_url: str
    score: int
    num_comments: int
    hype_score: float = Field(default=0, index=True) # Hype score with an index for fast sorting
    # Defining the vector column. We must specify the number of dimensions.
    # Common dimension for sentence-transformer models like 'all-MiniLM-L6-v2' is 384.
    title_vector: List[float] = Field(sa_column=Column(Vector(384)))


# model excluding title vector field.
class MemeRead(SQLModel):
    id: int
    title: str
    image_url: str
    post_url: str
    score: int
    num_comments: int
    hype_score: float

class SearchRequest(SQLModel):
    query: str