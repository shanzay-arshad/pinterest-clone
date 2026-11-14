
from fastapi import FastAPI

# Create FastAPI application
app = FastAPI(
    title="Pinterest Clone API",
    description="Backend API for our Pinterest-inspired application",
    version="1.0.0"
)


# Root endpoint
@app.get("/")
def home():
    return {
        "message": "Pinterest Clone API is running!"
    }


# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
