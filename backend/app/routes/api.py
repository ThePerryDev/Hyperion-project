from fastapi import APIRouter, Body
from typing import List, Dict, Optional
import os
from app.schemas.stac_api_schema import STACRequest, ColecaoSTAC, STACImagemFiltrada
from app.controllers.stac_api_controller import buscar_imagens, listar_colecoes
from app.utils.download_utils import baixar_e_salvar_bandas  # função renomeada

router = APIRouter()

@router.post("/buscar-imagens")
def buscar(params: STACRequest):
    return buscar_imagens(params)

@router.get("/colecoes-suportadas", response_model=List[ColecaoSTAC])
def colecoes():
    return listar_colecoes()

@router.post("/baixar-imagens")
def baixar_imagens_endpoint(
    id: str = Body(...),
    bandas: Dict[str, str] = Body(...),
    cmask: Optional[str] = Body(None),
    thumbnail: Optional[str] = Body(None)
):
    pasta_destino = baixar_e_salvar_bandas(id, bandas, cmask, thumbnail)
    return {
        "mensagem": "Imagens baixadas com sucesso.",
        "pasta": pasta_destino
    }
