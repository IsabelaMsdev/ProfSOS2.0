from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Task
from app.schemas import TaskCreate, TaskRead

router = APIRouter(prefix="/tasks", tags=["Tasks"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=TaskRead)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(title=task.title, description=task.description, is_done=task.is_done)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/", response_model=list[TaskRead])
def read_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()
