from fastapi import FastAPI
from app.routes.api import router as api_router
from app.routes import stac_routes 

app = FastAPI(title="Monitoramento de Queimadas")

app.include_router(api_router)

app.include_router(stac_routes.router, prefix="/stac")