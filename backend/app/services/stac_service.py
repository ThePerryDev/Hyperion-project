import requests
from pystac_client import Client
from app.schemas.stac_api_schema import STACRequest

STAC_BASE_URL = "https://data.inpe.br/bdc/stac/v1"

# Palavras-chave que devem estar no ID da coleção para ser considerada válida
WFI_KEYWORDS = ["WFI", "wfi", "WFM", "wfm"]

def buscar_imagens_stac(params: STACRequest):
    bbox = list(map(float, params.bbox.split(",")))

    client = Client.open(STAC_BASE_URL)

    search = client.search(
        collections=[params.colecao],
        bbox=bbox,
        datetime=f"{params.data_inicio}/{params.data_fim}",
        limit=10
    )

    items = search.items()
    resultados = []

    for item in items:
        propriedades = item.properties
        cloud_cover = propriedades.get("eo:cloud_cover")

        # 🌥️ Aplica o filtro de nuvens se solicitado
        if params.filtrar_nuvens:
            if cloud_cover is None:
                cloud_cover = 100.0  # assume 100% de nuvem se metadado estiver ausente
            if cloud_cover > 10:
                continue

        asset = (
            item.assets.get("BAND15")
            or item.assets.get("BAND16")
            or item.assets.get("BAND14")
        )
        if not asset:
            continue

        resultados.append(item.to_dict())

    return resultados

_cached_colecoes = None

def listar_colecoes_suportadas():
    global _cached_colecoes

    if _cached_colecoes is not None:
        return _cached_colecoes

    try:
        res = requests.get(f"{STAC_BASE_URL}/collections", timeout=10)
        res.raise_for_status()
        todas = res.json().get("collections", [])

        filtradas = [
            {
                "id": c["id"],
                "descricao": c.get("description", "")
            }
            for c in todas
            if any(k.lower() in c["id"].replace("-", "_").lower() for k in WFI_KEYWORDS)
        ]

        _cached_colecoes = filtradas  # salva o cache
        return filtradas
    except Exception as e:
        return []