from fastapi import FastAPI
import logging

from app.routes.api import router as api_router
from app.routes import stac_routes
from app.routes.usuario_route import router as usuario_router
from app.core.database import engine, Base
from app.schemas.tb_consulta import create_tables

app = FastAPI(title="Monitoramento de Queimadas")

# Função que será chamada na inicialização do FastAPI
@app.on_event("startup")
async def startup():
    logging.info("Iniciando a criação das tabelas...")

    # Criação das tabelas do SQLAlchemy
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    logging.info("Tabelas criadas com sucesso!")

    # Criação de tabelas específicas via função personalizada
    await create_tables()

# Incluindo as rotas
app.include_router(api_router)
app.include_router(stac_routes.router, prefix="/stac")
app.include_router(usuario_router, prefix="/api/v1")
