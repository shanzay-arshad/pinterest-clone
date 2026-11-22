
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.routes.users import router as users_router
from app.routes.pins import router as pins_router
from app.routes import saved_pins


app = FastAPI(
    title="Pinterest Clone API",
    description="Backend API for our Pinterest-inspired application",
    version="1.0.0"
)

# Allow our frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
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
app.include_router(saved_pins.router)