from sqlalchemy import Column, Integer, String, Boolean, Date
from database import Base

class DBTodo(Base):
    __tablename__ = "todo"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Not Started")
    blockers = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
