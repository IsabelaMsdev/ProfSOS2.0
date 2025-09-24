from fastapi import FastAPI
from app.database import engine, Base
from app.routes import users, auth, tasks  # Importa também o módulo de tarefas

# Criar tabelas no banco
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(tasks.tasks_router)  # Inclui o router de tarefas