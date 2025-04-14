from fastapi import APIRouter
from typing import List
from app.schemas.stac_api_schema import STACRequest, ColecaoSTAC, STACItem
from app.controllers.stac_api_controller import buscar_imagens, listar_colecoes

router = APIRouter()

@router.post("/buscar-imagens")
def buscar(params: STACRequest):
    return buscar_imagens(params)

@router.get("/colecoes-suportadas", response_model=List[ColecaoSTAC])
def colecoes():
    return listar_colecoes()