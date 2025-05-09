from app.schemas.stac_api_schema import STACRequest
from app.services.stac_service import buscar_imagens_stac, listar_colecoes_suportadas
from app.controllers.consulta import persistir_consulta

async def buscar_imagens(params: STACRequest):
    resultados = buscar_imagens_stac(params)  # <-- sem await aqui!

    for resultado in resultados:
        await persistir_consulta(resultado)

    return {"message": "Consultas persistidas com sucesso", "total": len(resultados)}


def listar_colecoes():
    return listar_colecoes_suportadas()