from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.routes.users import router as users_router
from app.routes.pins import router as pins_router


app = FastAPI(
    title="Pinterest Clone API",
    description="Backend API for our Pinterest-inspired application",
    version="1.0.0"
)

# Image storage directory
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Serve uploaded images
app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_DIR),
    name="uploads"
)


@app.get("/")
def home():
    return {"message": "Pinterest Clone API is running!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


app.include_router(users_router)
app.include_router(pins_router)