from pydantic import BaseModel

# Pydantic schemas for API validation
class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool

    class Config:
        from_attributes = True  # Allows Pydantic to read SQLAlchemy models

class TodoCreate(BaseModel):
    title: str
