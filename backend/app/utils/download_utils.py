
import os
import requests
import zipfile

def baixar_arquivo(url, caminho_destino):
    resposta = requests.get(url)
    resposta.raise_for_status()
    with open(caminho_destino, 'wb') as f:
        f.write(resposta.content)

def baixar_e_compactar_bandas(id: str, bandas: dict, cmask: str = None, thumbnail: str = None) -> str:
    pasta = f"downloads/{id}"
    os.makedirs(pasta, exist_ok=True)

    arquivos_baixados = []

    # Bandas espectrais
    for nome, url in bandas.items():
        if url:
            ext = ".tif" if nome != "thumbnail" else ".png"
            caminho = os.path.join(pasta, f"{id}_{nome}{ext}")
            baixar_arquivo(url, caminho)
            arquivos_baixados.append(caminho)

    # CMASK
    if cmask:
        caminho = os.path.join(pasta, f"{id}_CMASK.tif")
        baixar_arquivo(cmask, caminho)
        arquivos_baixados.append(caminho)

    # Thumbnail
    if thumbnail:
        caminho = os.path.join(pasta, f"{id}_thumbnail.png")
        baixar_arquivo(thumbnail, caminho)
        arquivos_baixados.append(caminho)

    # Compacta os arquivos em .zip
    zip_path = f"{pasta}.zip"
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for file in arquivos_baixados:
            zipf.write(file, arcname=os.path.basename(file))

    return zip_path

'''
import os
import requests
import zipfile

def baixar_arquivo(url, caminho_destino):
    resposta = requests.get(url)
    resposta.raise_for_status()
    with open(caminho_destino, 'wb') as f:
        f.write(resposta.content)

def baixar_e_compactar_bandas(id: str, bandas: dict, cmask: str = None, thumbnail: str = None) -> str:
    pasta = f"downloads/{id}"
    os.makedirs(pasta, exist_ok=True)

    arquivos_baixados = []

    # Bandas espectrais
    for nome, url in bandas.items():
        if url:
            ext = ".tif" if nome != "thumbnail" else ".png"
            caminho = os.path.join(pasta, f"{id}_{nome}{ext}")
            baixar_arquivo(url, caminho)
            arquivos_baixados.append(caminho)

    # CMASK
    if cmask:
        caminho = os.path.join(pasta, f"{id}_CMASK.tif")
        baixar_arquivo(cmask, caminho)
        arquivos_baixados.append(caminho)

    # Thumbnail
    if thumbnail:
        caminho = os.path.join(pasta, f"{id}_thumbnail.png")
        baixar_arquivo(thumbnail, caminho)
        arquivos_baixados.append(caminho)

    # Compacta os arquivos em .zip
    zip_path = f"{pasta}.zip"
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for file in arquivos_baixados:
            zipf.write(file, arcname=os.path.basename(file))

    return zip_path


'''