# app/database.py
import os
from sqlmodel import create_engine, SQLModel
from dotenv import load_dotenv
from sqlmodel import Session

# Loading environment variables from the root .env file
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# Constructing the database URL from environment variables
DB_USER = os.getenv("DB_USER")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# The engine is the main entry point to the database for SQLModel/SQLAlchemy
engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    # Creatin all tables defined by SQLModel models
    # Called on application startup
    SQLModel.metadata.create_all(engine)

# Will be imported by worker module
# Iffy config management here.
SQS_QUEUE_URL = os.getenv('SQS_QUEUE_URL')
AWS_REGION = os.getenv('AWS_REGION')


def get_session():
    # 'with' statement ensures the session is always closed, even if errors occur.
    with Session(engine) as session:
        yield session