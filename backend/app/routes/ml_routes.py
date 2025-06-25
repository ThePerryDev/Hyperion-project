import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from pyproj import Transformer
from pystac_client import Client
from sqlalchemy import select
from app.core.database import SessionLocal
from app.dependencies.db_session import get_db
from app.models.favorito_model import Favorito
from app.models.processamento_model import Processamento
from app.models.usuario_model import Usuario
from app.schemas.ml_request_schema import MLProcessRequest
from app.schemas.processamento_schema import ProcessamentoSchema
from app.services.ml_pipeline import processar_imagem_completa
from app.services.stac_extractor import STAC_BASE_URL
from app.utils.cancel_instance import cancel_manager
from app.utils.progresso_manager import progresso_manager
from app.dependencies.auth_dependencies import get_current_user
import asyncio
from rasterio import open as rio_open
from sqlalchemy.ext.asyncio import AsyncSession

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

@router.post("/validar-meus-processamentos")
async def validar_meus_processamentos(current_user: Usuario = Depends(get_current_user), db=Depends(get_db)):
    output_dir = "output"
    arquivos = [f for f in os.listdir(output_dir) if f.endswith("_classes.tif")]

    if not arquivos:
        raise HTTPException(status_code=404, detail="Nenhum arquivo _classes.tif encontrado.")

    client = Client.open(STAC_BASE_URL)
    novos = []

    for arq in arquivos:
        id_imagem = arq.replace("_classes.tif", "")
        print(f"🔍 Verificando {id_imagem}...")

        # 1. Verifica se já existe no banco
        result = await db.execute(
            select(Processamento).where(
                Processamento.id_imagem == id_imagem,
                Processamento.usuario_id == current_user.id
            )
        )
        if result.scalars().first():
            print(f"⚠️ Já existe no banco: {id_imagem}")
            continue

        # 2. Busca STAC com fallback para coleção dinâmica
        try:
            search = client.search(ids=[id_imagem])
            item = next(search.get_items(), None)
        except Exception as e:
            print(f"❌ Erro ao buscar item na STAC API para {id_imagem}: {e}")
            continue

        if not item:
            print(f"❌ Item não encontrado na STAC API: {id_imagem}")
            continue

        assets = item.assets
        props = item.properties

        # 3. Caminhos locais
        segmentado_tif = f"output/{id_imagem}_classes.tif"
        segmentado_png = f"output/{id_imagem}_rgb.png"
        ndvi_tif = f"data/processed/{id_imagem}_ndvi.tif"
        ndvi_png = f"data/processed/{id_imagem}_ndvi_preview.png"

        # 4. Verifica se todos os arquivos existem
        if not all(map(os.path.exists, [segmentado_tif, segmentado_png, ndvi_tif, ndvi_png])):
            print(f"🚫 Arquivo(s) faltando para {id_imagem}. Pulei.")
            continue

        # 5. Extrai bbox_real
        try:
            with rio_open(segmentado_tif) as src:
                transform = src.transform
                width, height = src.width, src.height
                lon_min, lat_max = transform * (0, 0)
                lon_max, lat_min = transform * (width, height)

                if src.crs and src.crs.to_string() != "EPSG:4326":
                    transformer = Transformer.from_crs(src.crs, "EPSG:4326", always_xy=True)
                    lon_min, lat_min = transformer.transform(lon_min, lat_min)
                    lon_max, lat_max = transformer.transform(lon_max, lat_max)

                bbox_real = [lon_min, lat_min, lon_max, lat_max]
        except Exception as e:
            print(f"❌ Erro ao extrair bbox_real: {e}")
            continue

        # 6. Cria o objeto Processamento
        try:
            p = Processamento(
                id_imagem=id_imagem,
                banda13=assets.get("BAND13").href if assets.get("BAND13") else None,
                banda14=assets.get("BAND14").href if assets.get("BAND14") else None,
                banda15=assets.get("BAND15").href if assets.get("BAND15") else None,
                banda16=assets.get("BAND16").href if assets.get("BAND16") else None,
                cmask=assets.get("CMASK").href if assets.get("CMASK") else None,
                thumbnail=assets.get("thumbnail").href if assets.get("thumbnail") else None,
                ndvi_tif=ndvi_tif,
                ndvi_png=ndvi_png,
                segmentado_tif=segmentado_tif,
                segmentado_png=segmentado_png,
                bbox_real=bbox_real,
                usuario_id=current_user.id
            )

            db.add(p)
            await db.commit()
            print(f"✅ Registrado no banco: {id_imagem}")
            novos.append(id_imagem)

        except Exception as e:
            await db.rollback()
            print(f"❌ Erro ao salvar {id_imagem} no banco: {e}")
            continue

    return {"status": "ok", "novos_processados": novos}

@router.post("/favoritos")
async def adicionar_favorito(
    id_imagem: str = Body(...),
    usuario: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Favorito).where(Favorito.usuario_id == usuario.id, Favorito.id_imagem == id_imagem)
    )
    if result.scalar():
        raise HTTPException(status_code=400, detail="Já favoritado")

    favorito = Favorito(usuario_id=usuario.id, id_imagem=id_imagem)
    db.add(favorito)
    await db.commit()
    return {"message": "Favoritado com sucesso"}

@router.get("/favoritos")
async def listar_favoritos(
    usuario: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Busca os IDs favoritos do usuário
    result = await db.execute(
        select(Favorito.id_imagem).where(Favorito.usuario_id == usuario.id)
    )
    ids = [row[0] for row in result.all()]

    if not ids:
        return {"favoritos": []}

    # Busca os dados das imagens processadas correspondentes
    result_proc = await db.execute(
        select(Processamento).where(Processamento.id_imagem.in_(ids))
    )
    processados = result_proc.scalars().all()

    favoritos = [
        {
            "id": p.id_imagem,
            "bbox": ",".join(map(str, p.bbox_real)) if p.bbox_real else "",
            "data": p.data_processamento.strftime("%d/%m/%Y") if p.data_processamento else "",
            "thumbnail": p.thumbnail or "",
        }
        for p in processados
    ]

    return {"favoritos": favoritos}

@router.delete("/favoritos/{id_imagem}")
async def remover_favorito(
    id_imagem: str,
    usuario: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Favorito).where(Favorito.usuario_id == usuario.id, Favorito.id_imagem == id_imagem)
    )
    favorito = result.scalar_one_or_none()
    if not favorito:
        raise HTTPException(status_code=404, detail="Favorito não encontrado")

    await db.delete(favorito)
    await db.commit()
    return {"message": "Desfavoritado com sucesso"}
