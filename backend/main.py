from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy.orm import Session

import models
from database import engine, get_db
from schemas import TodoResponse, TodoCreate, TodoUpdate


# Create the database tables on startup if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- API ROUTES ---

@app.get("/todos", response_model=List[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    return db.query(models.DBTodo).all()

@app.post("/todos", response_model=TodoResponse)
def create_todo(todo_in: TodoCreate, db: Session = Depends(get_db)):
    new_todo = models.DBTodo(
        title=todo_in.title, 
        completed=False,
        status=todo_in.status,
        blockers=todo_in.blockers,
        notes=todo_in.notes
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo

# Full update endpoint supporting the modal modifications
@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo_in: TodoUpdate, db: Session = Depends(get_db)):
    todo = db.query(models.DBTodo).filter(models.DBTodo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    todo.title = todo_in.title
    todo.completed = todo_in.completed
    todo.status = todo_in.status
    todo.blockers = todo_in.blockers
    todo.notes = todo_in.notes
    
    db.commit()
    db.refresh(todo)
    return todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(models.DBTodo).filter(models.DBTodo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    db.delete(todo)
    db.commit()
    return {"message": "Todo deleted successfully"}
