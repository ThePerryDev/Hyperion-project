from app.schemas.stac_api_schema import STACRequest
from app.services.stac_service import buscar_imagens_stac, listar_colecoes_suportadas

def buscar_imagens(params: STACRequest):
    return buscar_imagens_stac(params)

def listar_colecoes():
    return listar_colecoes_suportadas()