
import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL, make_url
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Locate the backend folder
BASE_DIR = Path(__file__).resolve().parents[1]

# Load the backend/.env file explicitly
load_dotenv(BASE_DIR / ".env")

# Read the Neon connection string
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

if DATABASE_URL:
    database_url = make_url(DATABASE_URL)

    if database_url.drivername in ("postgres", "postgresql"):
        database_url = database_url.set(
            drivername="postgresql+psycopg"
        )

    engine = create_engine(
        database_url,
        echo=False,
        pool_pre_ping=True
    )

else:
    # Use local PostgreSQL when DATABASE_URL is not configured
    local_database_url = URL.create(
        drivername="postgresql+psycopg",
        username=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", "5432")),
        database=os.getenv("DB_NAME")
    )

    engine = create_engine(
        local_database_url,
        echo=False,
        pool_pre_ping=True
    )


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
