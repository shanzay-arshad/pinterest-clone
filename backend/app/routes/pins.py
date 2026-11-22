
from pathlib import Path
from uuid import uuid4

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
from fastapi import APIRouter, Depends


router = APIRouter(
    prefix="/pins",
    tags=["Pins"]
)

# Location where uploaded images will be stored
UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


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
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp"
    }

    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG, and WEBP images are allowed"
        )

    # Generate a unique filename
    extension = allowed_types[image.content_type]
    filename = f"{uuid4().hex}{extension}"

    file_path = UPLOAD_DIR / filename

    # Read the image and limit its size to 5 MB
    image_data = image.file.read(5 * 1024 * 1024 + 1)

    if len(image_data) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image size must be 5 MB or less"
        )

    # Save image locally
    with open(file_path, "wb") as file:
        file.write(image_data)

    # Save image information in PostgreSQL
    new_pin = Pin(
        title=title,
        description=description or None,
        image_url=f"/uploads/{filename}",
        owner_id=current_user.id
    )

    try:
        db.add(new_pin)
        db.commit()
        db.refresh(new_pin)

    except Exception:
        db.rollback()
        file_path.unlink(missing_ok=True)
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
