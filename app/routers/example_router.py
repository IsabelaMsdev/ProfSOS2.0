from fastapi import APIRouter

router = APIRouter()

@router.get("/exemplo")
def exemplo():
    return {"message": "Rota de exemplo funcionando!"}
