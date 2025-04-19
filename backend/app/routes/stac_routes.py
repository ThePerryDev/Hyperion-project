from fastapi import APIRouter
from fastapi.responses import FileResponse
from app.utils.download_utils import baixar_e_compactar_bandas
from app.schemas.download_schema import DownloadRequest

router = APIRouter()

@router.post("/baixar")
def baixar_arquivo_stac(info: DownloadRequest):
    # Chamando a função que faz o download e cria o arquivo zip
    zip_path = baixar_e_compactar_bandas(
        id=info.id,
        bandas=info.bandas,
        cmask=info.cmask,
        thumbnail=info.thumbnail
    )
    
    # Retornando o arquivo zip como resposta
    return FileResponse(zip_path, filename=f"{info.id}.zip", media_type="application/zip")
