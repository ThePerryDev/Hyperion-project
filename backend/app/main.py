from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from app.routes.api import router as api_router
from app.routes import stac_routes
from app.routes.usuario_route import router as usuario_router
from app.routes.ml_routes import router as ml_router
from app.routes.output_routes import router as output_router
from app.core.database import engine, Base
from app.controllers.usuario_controller import UsuarioController
from app.schemas.tb_consulta import create_tables
from app.models.usuario_model import Usuario  # 👈 garante que a tabela será criada
import logging

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("🚀 Iniciando aplicação...")

    # Etapa 1: Criar todas as tabelas
    logging.info("🛠️ Criando tabelas...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Etapa 2: Criar outras tabelas adicionais (como tb_consulta)
    await create_tables()
    logging.info("✅ Tabelas criadas com sucesso.")

    # Etapa 3: Verificar se o admin já existe
    try:
        usuario_controller = UsuarioController()
        usuarios = await usuario_controller.buscar_usuarios()

        admin_existe = any(u.email == "admin" for u in usuarios)

        if not admin_existe:
            await usuario_controller.criar_usuario(
                name="Administrador",
                email="admin",
                password="admin",  # ⚠️ usar apenas para ambiente de desenvolvimento
                admin=True,
                isLogged=False
            )
            logging.info("✅ Usuário admin criado com sucesso.")
        else:
            logging.info("ℹ️ Usuário admin já existe.")

    except Exception as e:
        logging.error(f"❌ Erro ao verificar/criar usuário admin: {e}")

    yield  # A aplicação inicia aqui

    logging.info("🛑 Encerrando aplicação.")

# FastAPI App
app = FastAPI(title="Monitoramento de Queimadas", lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo as rotas no aplicativo FastAPI
app.include_router(api_router)

# Rota STAC
app.include_router(stac_routes.router, prefix="/stac")

# Rota do usuário (API v1)
app.include_router(usuario_router, prefix="/api/v1")

#Rota para /processar-imagem
app.include_router(ml_router)

#Rota para /processed-list e /bbox-from-tif
app.include_router(output_router)

app.mount("/output", StaticFiles(directory="output"), name="output")
