from fastapi import FastAPI
from app.routes.api import router as api_router
from app.routes import stac_routes
from app.core.database import engine, Base 
from app.routes.usuario_route import router as usuario_router
import logging

app = FastAPI(title="Monitoramento de Queimadas")

# Cria as tabelas automaticamente no banco de dados
@app.on_event("startup")
async def startup_event():
    logging.info("Iniciando a criação das tabelas...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logging.info("Tabelas criadas com sucesso!")

app.include_router(api_router)

app.include_router(stac_routes.router, prefix="/stac")

app.include_router(usuario_router, prefix="/api/v1")