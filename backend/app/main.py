from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import logging

from app.core.database import engine, Base
from app.core.security import hash_password
from app.utils.cancel_instance import cancel_manager

from app.controllers.usuario_controller import UsuarioController
from app.schemas.tb_consulta import create_tables
from app.models.usuario_model import Usuario

# Importação das rotas
from app.routes.api import router as api_router
from app.routes.usuario_route import router as usuario_router
from app.routes.ml_routes import router as ml_router
from app.routes.output_routes import router as output_router
from app.routes.websocket_endpoint import router as websocket_router
from app.routes.auth_routes import router as auth_router
from app.routes import stac_routes

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("🚀 Iniciando aplicação...")

    # Cria as tabelas
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    await create_tables()
    logging.info("✅ Tabelas criadas com sucesso.")

    # Criação do admin
    try:
        usuario_controller = UsuarioController()
        usuarios = await usuario_controller.buscar_usuarios()

        if not any(u.email == "admin" for u in usuarios):
            await usuario_controller.criar_usuario(
                name="Administrador",
                email="admin",
                password=hash_password("admin"),
                admin=True,
                isLogged=False
            )
            logging.info("✅ Usuário admin criado com sucesso.")
        else:
            logging.info("ℹ️ Usuário admin já existe.")
    except Exception as e:
        logging.error(f"❌ Erro ao criar/verificar usuário admin: {e}")

    yield
    logging.info("🛑 Encerrando aplicação.")

# Inicializa FastAPI com o ciclo de vida
app = FastAPI(title="Monitoramento de Queimadas", lifespan=lifespan)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monta arquivos estáticos
app.mount("/output", StaticFiles(directory="output"), name="output")

# Registro de rotas (todas sob `/api/v1`)
app.include_router(auth_router, prefix="/api/v1")
app.include_router(usuario_router, prefix="/api/v1")
app.include_router(ml_router, prefix="/api/v1")
app.include_router(output_router, prefix="/api/v1")
app.include_router(api_router, prefix="/api/v1")
app.include_router(stac_routes.router, prefix="/api/v1/stac")  
app.include_router(websocket_router)

__all__ = ["cancel_manager"]
