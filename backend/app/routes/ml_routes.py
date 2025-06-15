from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.processamento_model import Processamento
from app.models.usuario_model import Usuario
from app.schemas.ml_request_schema import MLProcessRequest
from app.schemas.processamento_schema import ProcessamentoSchema
from app.services.ml_pipeline import processar_imagem_completa
from app.utils.cancel_instance import cancel_manager
from app.utils.progresso_manager import progresso_manager
from app.dependencies.auth_dependencies import get_current_user
import asyncio

router = APIRouter()

@router.post("/processar-imagem")
async def processar_imagem(
    data: MLProcessRequest,
    current_user: Usuario = Depends(get_current_user)  # ✅ Adicionado aqui
):
    print(f"🔍 Requisição de processamento recebida para: {data.id}")

    if cancel_manager.is_cancelado(data.id):
        print("⚠️ Já existe um processamento ativo ou cancelado para este ID.")
        raise HTTPException(status_code=400, detail="Processamento já em andamento ou cancelado.")

    cancel_manager.iniciar(data.id)
    cancel_event = cancel_manager.get_evento(data.id)

    # ✅ Garante que o ID do usuário vem da sessão autenticada
    data.usuario_id = current_user.id

    async def tarefa():
        try:
            print(f"🚀 Iniciando processamento assíncrono para: {data.id}")
            await processar_imagem_completa(data, cancel=cancel_event)
        except Exception as e:
            print(f"❌ Erro durante processamento de {data.id}: {e}")
        finally:
            cancel_manager.limpar(data.id)
            progresso_manager.limpar(data.id)
            print(f"🧹 Cancel manager e progresso limpos para: {data.id}")

    asyncio.create_task(tarefa())
    return {"status": "processamento iniciado"}

@router.get("/meus-processamentos", response_model=List[ProcessamentoSchema])
async def meus_processamentos(current_user: Usuario = Depends(get_current_user)):
    async with SessionLocal() as session:
        result = await session.execute(
            select(Processamento).where(Processamento.usuario_id == current_user.id)
        )
        return result.scalars().all()
    
@router.post("/cancelar-processamento")
async def cancelar_processamento(id: str = Query(...)):
    print(f"🚨 Pedido de cancelamento para: {id}")
    cancel_manager.cancelar(id)
    return {"status": "cancelado"}

@router.get("/status-processamento/{id}")
async def status_processamento(id: str):
    progresso = progresso_manager.get_progresso(id)
    return {"progresso": progresso}

@router.post("/cancelar-processamento-test")
def cancelar_fixo():
    print("🚨 Rota de teste de cancelamento acionada")
    return {"status": "ok"}

@router.get("/ping")
def ping():
    print("🔔 Ping recebido")
    return {"status": "ok"}


#Este novo arquivo substitui e funde os seguintes arquivos do primeiro repositório:

#Arquivo original 
# Parte de main.py (v1) → /processar-imagem/
#   Separado corretamente
#   Agora está modular em routes/ml_routes.py

#Arquivo original 
# MLProcessRequest de schemas/ml_request_schema.py
#   Reutilizado
#   Continua em uso sem alterações