from app.schemas.stac_api_schema import STACRequest
from app.services.stac_service import buscar_imagens_stac, listar_colecoes_suportadas

async def buscar_imagens(params: STACRequest):
    resultados = buscar_imagens_stac(params)

    for resultado in resultados:
        resultado["data"] = resultado["data"].isoformat() if resultado["data"] else None

    return {
        "message": "Busca concluída com sucesso",
        "total": len(resultados),
        "dados": resultados
    }

def listar_colecoes():
    return listar_colecoes_suportadas()