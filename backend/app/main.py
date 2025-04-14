from fastapi import FastAPI
from app.routes.api import router as api_router

app = FastAPI(title="Monitoramento de Queimadas")

app.include_router(api_router)