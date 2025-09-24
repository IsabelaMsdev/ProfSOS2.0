from app.database import Base, engine
from app.models import User, Task

# Cria todas as tabelas definidas nos models
Base.metadata.create_all(bind=engine)

print("Banco 'prof_sos.db' criado com sucesso!")
