from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import users, sos
# Se você tiver um router de autenticação separado (ex.: app/auth.py com router),
# descomente a linha abaixo e inclua-o no final.
# from app import auth

# --- Metadados (aparecem em /docs) ---
app = FastAPI(
    title="ProfSOS API",
    description="API para cadastro de usuários, autenticação JWT e operações de SOS.",
    version="1.0.0",
    contact={"name": "ProfSOS", "url": "http://localhost:8000/docs"},
)

# --- CORS (liberar acesso durante o desenvolvimento) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # em produção, troque por a origem do seu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Eventos de inicialização/encerramento ---
@app.on_event("startup")
def on_startup():
    # Cria as tabelas no banco (se ainda não existirem)
    init_db()

# --- Rotas básicas ---
@app.get("/", tags=["Base"])
def read_root():
    return {"status": "ok", "message": "ProfSOS API ativa! Veja /docs para testar."}

@app.get("/health", tags=["Base"])
def health_check():
    return {"status": "healthy"}

# --- Registro dos routers ---
app.include_router(users.router)  # /users -> cadastro, login (se definido lá), etc.
app.include_router(sos.router)    # /sos   -> CRUD de pedidos de SOS

# Se possuir um router de autenticação separado com Token (ex.: /auth/token), inclua:
# app.include_router(auth.router)
