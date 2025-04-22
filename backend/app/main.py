from fastapi import FastAPI
from app.routes.api import router as api_router
<<<<<<< HEAD
from app.routes import stac_routes 

from app.schemas.tb_consulta import create_tables

app = FastAPI(title="Monitoramento de Queimadas")

app.include_router(api_router)

app.include_router(stac_routes.router, prefix="/stac")


# Função que será chamada na inicialização do FastAPI
@app.on_event("startup")
async def startup():
    # Chama a função para criar as tabelas assim que o servidor iniciar
    await create_tables()
=======
from app.routes import stac_routes
from app.core.database import engine, Base
from app.routes.usuario_route import router as usuario_router
from app.schemas.tb_consulta import create_tables
import logging

app = FastAPI(title="Monitoramento de Queimadas")

# Criação das tabelas no banco de dados durante a inicialização
@app.on_event("startup")
async def startup_event():
    logging.info("Iniciando a criação das tabelas...")
    # Criando as tabelas do banco de dados
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logging.info("Tabelas criadas com sucesso!")

    # Também chama a função para criar as tabelas relacionadas a consultas
    await create_tables()

# Incluindo as rotas no aplicativo FastAPI
app.include_router(api_router)

# Rota STAC
app.include_router(stac_routes.router, prefix="/stac")

# Rota do usuário (API v1)
app.include_router(usuario_router, prefix="/api/v1")
>>>>>>> master
