from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas, database, auth

router = APIRouter(
    prefix="/sos",
    tags=["SOS"]
)

# Criar um pedido de SOS
@router.post("/", response_model=schemas.SOS)
def create_sos(
    sos: schemas.SOSCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_sos = models.SOS(
        title=sos.title,
        description=sos.description,
        user_id=current_user.id
    )
    db.add(db_sos)
    db.commit()
    db.refresh(db_sos)
    return db_sos

# Listar todos os SOS
@router.get("/", response_model=List[schemas.SOS])
def get_all_sos(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return db.query(models.SOS).all()

# Buscar SOS específico
@router.get("/{sos_id}", response_model=schemas.SOS)
def get_sos(
    sos_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    sos = db.query(models.SOS).filter(models.SOS.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS não encontrado")
    return sos

# Deletar SOS (somente quem criou pode deletar)
@router.delete("/{sos_id}")
def delete_sos(
    sos_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    sos = db.query(models.SOS).filter(models.SOS.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS não encontrado")
    if sos.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sem permissão para deletar este SOS")
    db.delete(sos)
    db.commit()
    return {"msg": "SOS deletado com sucesso"}
