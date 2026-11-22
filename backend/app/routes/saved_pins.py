
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.pin import Pin
from app.models.saved_pin import SavedPin
from app.schemas.pin import PinResponse


router = APIRouter(
    prefix="/saved-pins",
    tags=["Saved Pins"]
)


# Save a pin
@router.post("/{pin_id}")
def save_pin(
    pin_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pin = db.query(Pin).filter(Pin.id == pin_id).first()

    if not pin:
        raise HTTPException(
            status_code=404,
            detail="Pin not found"
        )

    existing_save = db.query(SavedPin).filter(
        SavedPin.user_id == current_user.id,
        SavedPin.pin_id == pin_id
    ).first()

    if existing_save:
        raise HTTPException(
            status_code=400,
            detail="You have already saved this pin"
        )

    new_save = SavedPin(
        user_id=current_user.id,
        pin_id=pin_id
    )

    db.add(new_save)
    db.commit()
    db.refresh(new_save)

    return {
        "message": "Pin saved successfully!"
    }


# Unsave a pin
@router.delete("/{pin_id}")
def unsave_pin(
    pin_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    saved_pin = db.query(SavedPin).filter(
        SavedPin.user_id == current_user.id,
        SavedPin.pin_id == pin_id
    ).first()

    if not saved_pin:
        raise HTTPException(
            status_code=404,
            detail="Saved pin not found"
        )

    db.delete(saved_pin)
    db.commit()

    return {
        "message": "Pin removed from saved pins"
    }


# Get current user's saved pins
@router.get("/me", response_model=list[PinResponse])
def get_saved_pins(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    saved_pins = (
        db.query(Pin)
        .join(SavedPin, Pin.id == SavedPin.pin_id)
        .filter(SavedPin.user_id == current_user.id)
        .order_by(SavedPin.saved_at.desc())
        .all()
    )

    return saved_pins
