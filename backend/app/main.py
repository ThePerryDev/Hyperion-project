import sys

from fastapi.responses import JSONResponse
python_exec = sys.executable  # garante o python do ambiente atual

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.stac_client import buscar_imagens_stac, listar_colecoes_suportadas
from app.schemas.stac_api_schema import STACRequest
from app.compute_ndvi import compute_ndvi
from app.schemas.ml_request_schema import MLProcessRequest
from app.utils.download_utils import baixar_arquivo

import logging
import subprocess
import os
import rasterio  # ✅ necessário para ler bounds reais
from fastapi import Query
from pyproj import Transformer

app = FastAPI()

# Permitir todas as origens (ajuste conforme necessário)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.1.2:8502"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔓 Expor o diretório "output/" como arquivos públicos
app.mount("/output", StaticFiles(directory="output"), name="output")

# Configuração do logging para exibir no console
logging.basicConfig(level=logging.DEBUG)

@app.post("/buscar-imagens/")
async def buscar_imagens(params: STACRequest):
    print("\n📥 Requisição recebida do frontend:")
    print(f"🗺️ BBOX: {params.bbox}")
    print(f"📅 Data Início: {params.data_inicio}")
    print(f"📅 Data Fim: {params.data_fim}")
    print(f"☁️ Filtrar por nuvens: {params.filtrar_nuvens}")
    print(f"📚 Coleção: {params.colecao}\n")

    resultados = await buscar_imagens_stac(params)
    logging.debug("Resultados encontrados: %s", resultados)
    return resultados

@app.get("/colecoes/")
async def listar_colecoes():
    return listar_colecoes_suportadas()

@app.post("/processar-imagem/")
async def processar_imagem_ml(data: MLProcessRequest):
    try:
        raw_dir = "data/raw"
        processed_dir = "data/processed"
        output_dir = "output"

        red_path = f"{raw_dir}/{data.id}_BAND15.tif"
        nir_path = f"{raw_dir}/{data.id}_BAND16.tif"
        ndvi_tif = f"{processed_dir}/{data.id}_ndvi.tif"
        ndvi_preview = f"{processed_dir}/{data.id}_ndvi_preview.png"

        baixar_arquivo(data.band15_url, red_path)
        baixar_arquivo(data.band16_url, nir_path)

        compute_ndvi(red_path, nir_path, ndvi_tif, ndvi_preview)

        subprocess.run([python_exec, "app/run_model.py", ndvi_tif, data.id], check=True)

        result_png = f"/output/{data.id}_rgb.png"
        result_tif = f"output/{data.id}_classes.tif"  # caminho local para rasterio

        # ✅ Extrai a bbox real do geotiff
        with rasterio.open(result_tif) as src:
            bounds = src.bounds
            real_bbox = [bounds.left, bounds.bottom, bounds.right, bounds.top]

        return {
            "preview_png": result_png,
            "preview_tif": f"/{result_tif}",
            "bbox": data.bbox,
            "bbox_real": real_bbox
        }


    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar imagem: {str(e)}")

# 👇 Novo endpoint para listar arquivos NDVI
@app.get("/processed-list/")
def listar_processados():
    pasta = "output/"
    try:
        arquivos = [f for f in os.listdir(pasta) if f.endswith("_classes.tif")]
        return JSONResponse(content={"arquivos": arquivos})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/bbox-from-tif/")
def bbox_from_tif(filename: str = Query(...)):
    try:
        caminho = os.path.join("output", filename)
        if not os.path.exists(caminho):
            raise HTTPException(status_code=404, detail="Arquivo não encontrado.")

        with rasterio.open(caminho) as src:
            bounds = src.bounds
            src_crs = src.crs

        # Reprojetar para WGS84 (lat/lon)
        transformer = Transformer.from_crs(src_crs, "EPSG:4326", always_xy=True)
        lon_min, lat_min = transformer.transform(bounds.left, bounds.bottom)
        lon_max, lat_max = transformer.transform(bounds.right, bounds.top)

        bbox_geo = [lon_min, lat_min, lon_max, lat_max]
        print(f"🛰️ BBOX reprojetada de {filename}: {bbox_geo}")
        return {"bbox": bbox_geo}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
