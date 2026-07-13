from pydantic import BaseModel
from typing import List, Optional

# Pydantic schemas for API validation
class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
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

class TodoUpdate(BaseModel):
    title: str
    completed: bool
    status: str
    blockers: Optional[str] = ""
    notes: Optional[str] = ""
