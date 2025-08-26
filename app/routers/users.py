from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User
from app.schemas import UserCreate, UserRead

router = APIRouter(prefix="/users", tags=["Users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(name=user.name, email=user.email, is_active=user.is_active)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/", response_model=list[UserRead])
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()
