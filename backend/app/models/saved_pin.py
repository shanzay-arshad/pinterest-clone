
from datetime import datetime

from sqlalchemy import ForeignKey, DateTime, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class SavedPin(Base):
    __tablename__ = "saved_pins"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "pin_id",
            name="uq_saved_pin_user_pin"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    pin_id: Mapped[int] = mapped_column(
        ForeignKey("pins.id"),
        nullable=False,
        index=True
    )

    saved_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
