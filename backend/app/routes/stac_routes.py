from fastapi import APIRouter
from fastapi.responses import FileResponse
from app.utils.download_utils import baixar_e_compactar_bandas
from app.schemas.download_schema import DownloadRequest

router = APIRouter()

# 🔁 Endpoint original: uso com POST (via ThunderClient ou frontend)
@router.post("/baixar")
def baixar_arquivo_stac(info: DownloadRequest):
    zip_path = baixar_e_compactar_bandas(
        id=info.id,
        bandas=info.bandas,
        cmask=info.cmask,
        thumbnail=info.thumbnail
    )
    return FileResponse(zip_path, filename=f"{info.id}.zip", media_type="application/zip")


# ✅ Novo endpoint de teste: uso com GET no navegador
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

    zip_path = baixar_e_compactar_bandas(id=id, bandas=bandas, cmask=cmask, thumbnail=thumbnail)

    return FileResponse(zip_path, filename=f"{id}.zip", media_type="application/zip")


'''
from fastapi import APIRouter
from fastapi.responses import FileResponse
from app.utils.download_utils import baixar_e_compactar_bandas
from app.schemas.download_schema import DownloadRequest

router = APIRouter()

@router.post("/baixar")
def baixar_arquivo_stac(info: DownloadRequest):
    zip_path = baixar_e_compactar_bandas(
        id=info.id,
        bandas=info.bandas,
        cmask=info.cmask,
        thumbnail=info.thumbnail
    )
    return FileResponse(zip_path, filename=f"{info.id}.zip", media_type="application/zip")



'''