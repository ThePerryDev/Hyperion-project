import requests
import os

def baixar_arquivo(url, caminho_destino):
    # Verifica se o arquivo já existe
    if os.path.exists(caminho_destino):
        print(f"✅ Arquivo já existe: {caminho_destino} — pulando download.")
        return

    print(f"⬇️ Baixando {url} → {caminho_destino}")
    os.makedirs(os.path.dirname(caminho_destino), exist_ok=True)
    resposta = requests.get(url)
    resposta.raise_for_status()
    with open(caminho_destino, "wb") as f:
        f.write(resposta.content)
