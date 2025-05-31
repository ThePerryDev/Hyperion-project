from pystac_client import Client
import requests
import os

STAC_BASE_URL = "https://data.inpe.br/bdc/stac/v1"
WFI_KEYWORDS = ["WFI", "wfi", "WFM", "wfm"]

def search_stac(keyword="WFI", bbox=None, date_range=None):
    catalog = Client.open(STAC_BASE_URL)
    search = catalog.search(
        collections=["CBERS4", "CBERS4A"],
        bbox=bbox,
        datetime=date_range,
        query={"eo:cloud_cover": {"lt": 20}},
        max_items=10
    )
    return list(search.get_items())

def download_assets(items, output_dir="data/raw"):
    os.makedirs(output_dir, exist_ok=True)
    for item in items:
        for asset_key, asset in item.assets.items():
            if any(k in asset_key for k in ["red", "nir", "RED", "NIR"]):
                url = asset.href
                fname = os.path.join(output_dir, f"{item.id}_{asset_key}.tif")
                with requests.get(url, stream=True) as r:
                    with open(fname, "wb") as f:
                        f.write(r.content)
                print(f"Baixado: {fname}")
