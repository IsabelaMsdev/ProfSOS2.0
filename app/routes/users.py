from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, database

router = APIRouter(prefix="/users", tags=["users"])

# Criar usuário
@router.post("/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    new_user = models.User(
        username=user.username,
        email=user.email,
        password=user.password  # OBS: ideal usar hash
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Listar usuários
@router.get("/", response_model=list[schemas.UserResponse])
def list_users(db: Session = Depends(database.get_db)):
    return db.query(models.User).all()

# Atualizar usuário
@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_update.username:
        db_user.username = user_update.username
    if user_update.email:
        db_user.email = user_update.email
    if user_update.password:
        db_user.password = user_update.password

    db.commit()
    db.refresh(db_user)
    return db_user

# Deletar usuário
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()
    return {"detail": "User deleted"}
