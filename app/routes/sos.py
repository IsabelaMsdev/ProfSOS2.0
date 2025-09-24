from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas import SOSRequest, SOSResponse
from app.database import get_db

sos_router = APIRouter(prefix="/sos", tags=["SOS"])

@sos_router.post("/", response_model=SOSResponse)
def create_sos(request: SOSRequest, db: Session = Depends(get_db)):
    # Aqui você pode adicionar a lógica de salvar no DB se quiser
    return SOSResponse(message=f"SOS recebido de {request.name} com prioridade {request.priority}")

@sos_router.get("/", response_model=list[SOSResponse])
def list_sos():
    # Retorno de exemplo
    return [SOSResponse(message="SOS 1"), SOSResponse(message="SOS 2")]
