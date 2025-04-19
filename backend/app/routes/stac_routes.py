from fastapi import APIRouter
from app.utils.download_utils import baixar_e_salvar_bandas
from app.schemas.download_schema import DownloadRequest
from app.utils.processamento_ndvi import calcular_ndvi_e_vegetacao  # Importação correta
import os
from fastapi.responses import JSONResponse
from fastapi import HTTPException

router = APIRouter()

# 🔁 Endpoint original com POST
@router.post("/baixar")
def baixar_arquivo_stac(info: DownloadRequest):
    pasta = baixar_e_salvar_bandas(
        id=info.id,
        bandas=info.bandas,
        cmask=info.cmask,
        thumbnail=info.thumbnail
    )
    return {
        "mensagem": "Imagens baixadas com sucesso.",
        "pasta": pasta
    }

# ✅ Endpoint GET para teste
@router.get("/baixar-teste")
def baixar_teste():
    id = "CBERS_4A_WFI_20230801_219_124"
    bandas = {
        "BAND13": "https://data.inpe.br/bdc/data/cbers4a_wfi/2023_08/CBERS_4A_WFI_RAW_2023_08_01.14_19_30_ETC2/219_124_0/4_BC_UTM_WGS84/CBERS_4A_WFI_20230801_219_124_L4_BAND13_GRID_SURFACE.tif",
        "BAND14": "https://data.inpe.br/bdc/data/cbers4a_wfi/2023_08/CBERS_4A_WFI_RAW_2023_08_01.14_19_30_ETC2/219_124_0/4_BC_UTM_WGS84/CBERS_4A_WFI_20230801_219_124_L4_BAND14_GRID_SURFACE.tif",
        "BAND15": "https://data.inpe.br/bdc/data/cbers4a_wfi/2023_08/CBERS_4A_WFI_RAW_2023_08_01.14_19_30_ETC2/219_124_0/4_BC_UTM_WGS84/CBERS_4A_WFI_20230801_219_124_L4_BAND15_GRID_SURFACE.tif",
        "BAND16": "https://data.inpe.br/bdc/data/cbers4a_wfi/2023_08/CBERS_4A_WFI_RAW_2023_08_01.14_19_30_ETC2/219_124_0/4_BC_UTM_WGS84/CBERS_4A_WFI_20230801_219_124_L4_BAND16_GRID_SURFACE.tif"
    }
    cmask = "https://data.inpe.br/bdc/data/cbers4a_wfi/2023_08/CBERS_4A_WFI_RAW_2023_08_01.14_19_30_ETC2/219_124_0/4_BC_UTM_WGS84/CBERS_4A_WFI_20230801_219_124_L4_CMASK_GRID_SURFACE.tif"
    thumbnail = "https://data.inpe.br/bdc/data/cbers4a_wfi/2023_08/CBERS_4A_WFI_RAW_2023_08_01.14_19_30_ETC2/219_124_0/4_BC_UTM_WGS84/CBERS_4A_WFI_20230801_219_124.png"

    pasta = baixar_e_salvar_bandas(id=id, bandas=bandas, cmask=cmask, thumbnail=thumbnail)

    return {
        "mensagem": "Imagens de teste baixadas com sucesso.",
        "pasta": pasta
    }
    


@router.get("/processar-ndvi")
def processar_ndvi():
    """
    Endpoint para processar as imagens e calcular NDVI, vegetação e cicatrizes
    """
    pasta = os.path.join(os.getcwd(), "downloads", "CBERS_4A_WFI_20230801_219_124")
    
    # Verifica se a pasta existe
    if not os.path.exists(pasta):
        return JSONResponse(
            status_code=404,
            content={"erro": f"Pasta não encontrada: {pasta}"}
        )

    try:
        # Chama a função de processamento (agora com o nome correto)
        resultados = calcular_ndvi_e_vegetacao(pasta_imagens=pasta)
        
        return {
            "mensagem": "Processamento concluído com sucesso",
            "resultados": {
                "arquivos": {
                    "ndvi": resultados['outputs']['ndvi'],
                    "cicatriz_queimada": resultados['outputs']['cicatriz'],
                    "vegetacao_saudavel": resultados['outputs']['vegetacao'],
                    "rgb_vegetacao": resultados['outputs']['rgb_vegetacao']
                },
                "estatisticas": resultados['stats']
            }
        }
        
    except FileNotFoundError as e:
        return JSONResponse(
            status_code=404,
            content={"erro": f"Arquivo não encontrado: {str(e)}"}
        )
    except ValueError as e:
        return JSONResponse(
            status_code=400,
            content={"erro": f"Dados inválidos: {str(e)}"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"erro": f"Falha no processamento: {str(e)}"}
        )