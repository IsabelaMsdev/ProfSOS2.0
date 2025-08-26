from pydantic import BaseModel
from datetime import datetime

class SOSBase(BaseModel):
    title: str
    description: str

class SOSCreate(SOSBase):
    pass

class SOS(SOSBase):
    id: int
    created_at: datetime
    user_id: int

    class Config:
        orm_mode = True
