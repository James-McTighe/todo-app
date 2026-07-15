from fastapi import APIRouter, HTTPException, Depends
from typing import List, Annotated
from sqlalchemy.orm import Session

import models
from schemas import TodoResponse, TodoCreate, TodoUpdate
from database import get_db

router = APIRouter()

DbSession = Annotated[Session, Depends(get_db)]

@router.get("/todos", response_model=List[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    return db.query(models.DBTodo).all()

@router.post("/todos", response_model=TodoResponse)
def create_todo(todo_in: TodoCreate, db: DbSession):
    new_todo = models.DBTodo(
        title=todo_in.title, 
        status=todo_in.status,
        blockers=todo_in.blockers,
        notes=todo_in.notes
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo

# Full update endpoint supporting the modal modifications
@router.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo_in: TodoUpdate, db: DbSession):
    todo = db.query(models.DBTodo).filter(models.DBTodo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo.title = todo_in.title
    todo.status = todo_in.status
    todo.blockers = todo_in.blockers
    todo.notes = todo_in.notes
    
    db.commit()
    db.refresh(todo)
    return todo

@router.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: DbSession):
    todo = db.query(models.DBTodo).filter(models.DBTodo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    db.delete(todo)
    db.commit()
    return {"message": "Todo deleted successfully"}
