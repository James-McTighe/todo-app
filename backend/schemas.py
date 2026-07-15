from pydantic import BaseModel
from typing import List, Optional

# Pydantic schemas for API validation
class TodoResponse(BaseModel):
    id: int
    title: str
    status: str
    blockers: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True  # Allows Pydantic to read SQLAlchemy models

class TodoCreate(BaseModel):
    title: str
    status: Optional[str] = "Not Started"
    blockers: Optional[str] = ""
    notes: Optional[str] = ""
    due_date: date = None

class TodoUpdate(BaseModel):
    title: str
    status: str
    blockers: Optional[str] = ""
    notes: Optional[str] = ""
