from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PinResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    image_url: str
    owner_id: int
    created_at: datetime
