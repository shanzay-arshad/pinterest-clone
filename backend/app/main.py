
from fastapi import FastAPI

from app.routes.users import router as users_router


app = FastAPI(
    title="Pinterest Clone API",
    description="Backend API for our Pinterest-inspired application",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Pinterest Clone API is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# Register users router
app.include_router(users_router)

