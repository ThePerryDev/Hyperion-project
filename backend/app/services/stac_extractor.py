from pystac_client import Client
from datetime import datetime

STAC_BASE_URL = "https://data.inpe.br/bdc/stac/v1"

async def buscar_metadados_por_id(id_img: str) -> dict | None:
    try:
        colecao = "_".join(id_img.split("_")[:3])  # ex: CBERS_4A_WFI
        client = Client.open(STAC_BASE_URL)

        search = client.search(
            collections=[colecao],
            ids=[id_img],
            limit=1
        )

        items = list(search.items())
        if not items:
            return None

        item = items[0]
        props = item.properties
        assets = item.assets

        bandas = {
            "BAND13": assets.get("BAND13", {}).get("href"),
            "BAND14": assets.get("BAND14", {}).get("href"),
            "BAND15": assets.get("BAND15", {}).get("href"),
            "BAND16": assets.get("BAND16", {}).get("href")
        }

        return {
            "id": id_img,
            "bandas": bandas,
            "cmask": assets.get("CMASK", {}).get("href"),
            "thumbnail": assets.get("thumbnail", {}).get("href"),
            "data": datetime.strptime(props["datetime"], "%Y-%m-%dT%H:%M:%SZ"),
            "cobertura_nuvem": props.get("eo:cloud_cover"),
            "bbox": item.bbox
        }

    except Exception as e:
        print(f"Erro ao buscar metadados para {id_img}: {e}")
        return None