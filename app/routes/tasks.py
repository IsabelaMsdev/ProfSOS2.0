from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Task, User
from app.schemas import TaskCreate, TaskRead
from app import oauth2

tasks_router = APIRouter(prefix="/tasks", tags=["Tasks"])

@tasks_router.post("/", response_model=TaskRead)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(oauth2.get_current_user)
):
    db_task = Task(title=task.title, description=task.description, user_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@tasks_router.get("/", response_model=list[TaskRead])
def list_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(oauth2.get_current_user)
):
    return db.query(Task).filter(Task.user_id == current_user.id).all()

@tasks_router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task: TaskCreate,
    task_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(oauth2.get_current_user)
):
    db_task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    db_task.title = task.title
    db_task.description = task.description
    db.commit()
    db.refresh(db_task)
    return db_task

@tasks_router.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int = Path(..., gt=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(oauth2.get_current_user)
):
    db_task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == current_user.id
    ).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    db.delete(db_task)
    db.commit()
    return