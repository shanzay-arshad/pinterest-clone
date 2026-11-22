
import os

import cloudinary
import cloudinary.uploader

from dotenv import load_dotenv

from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.pin import Pin
from app.models.user import User
from app.schemas.pin import PinResponse


# Load environment variables from backend/.env
BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")


# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)


router = APIRouter(
    prefix="/pins",
    tags=["Pins"]
)


@router.post("/", response_model=PinResponse, status_code=status.HTTP_201_CREATED)
def create_pin(
    title: str = Form(...),
    description: str = Form(""),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Allow only common image formats
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp"
    }

    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG, and WEBP images are allowed"
        )

    # Read the image and limit its size to 5 MB
    image_data = image.file.read(5 * 1024 * 1024 + 1)

    if len(image_data) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image size must be 5 MB or less"
        )

    # Check that Cloudinary credentials are configured
    if not all([
        os.getenv("CLOUDINARY_CLOUD_NAME"),
        os.getenv("CLOUDINARY_API_KEY"),
        os.getenv("CLOUDINARY_API_SECRET")
    ]):
        raise HTTPException(
            status_code=500,
            detail="Cloudinary configuration is missing"
        )

    # Upload image to Cloudinary
    try:
        upload_result = cloudinary.uploader.upload(
            image_data,
            folder="pinterest-clone",
            resource_type="image"
        )

        image_url = upload_result["secure_url"]
        public_id = upload_result["public_id"]

    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Image upload to Cloudinary failed"
        )

    # Save image information in PostgreSQL
    new_pin = Pin(
        title=title,
        description=description or None,
        image_url=image_url,
        owner_id=current_user.id
    )

    try:
        db.add(new_pin)
        db.commit()
        db.refresh(new_pin)

    except Exception:
        db.rollback()

        # Remove uploaded image if database saving fails
        try:
            cloudinary.uploader.destroy(
                public_id,
                resource_type="image"
            )
        except Exception:
            pass

        raise HTTPException(
            status_code=500,
            detail="Could not create pin"
        )

    return new_pin


@router.get("/", response_model=list[PinResponse])
def get_all_pins(
    db: Session = Depends(get_db)
):
    pins = (
        db.query(Pin)
        .order_by(Pin.created_at.desc())
        .all()
    )

    return pins


@router.get("/me", response_model=list[PinResponse])
def get_my_pins(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    my_pins = (
        db.query(Pin)
        .filter(Pin.owner_id == current_user.id)
        .order_by(Pin.created_at.desc())
        .all()
    )

    return my_pins
