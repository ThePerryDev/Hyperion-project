from fastapi import FastAPI
from app.routes.api import router as api_router
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