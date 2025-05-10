import rasterio
import numpy as np
import os
import matplotlib.pyplot as plt
from rasterio.windows import from_bounds
from rasterio.coords import BoundingBox

def compute_ndvi(red_path, nir_path, output_path, preview_path=None):
    print(f"📥 Abrindo RED: {red_path} e NIR: {nir_path}")

    with rasterio.open(red_path) as red, rasterio.open(nir_path) as nir:
        print("🔍 Verificando interseção espacial...")
        red_bounds = red.bounds
        nir_bounds = nir.bounds

        intersection = BoundingBox(
            left=max(red_bounds.left, nir_bounds.left),
            bottom=max(red_bounds.bottom, nir_bounds.bottom),
            right=min(red_bounds.right, nir_bounds.right),
            top=min(red_bounds.top, nir_bounds.top)
        )

        red_window = from_bounds(*intersection, transform=red.transform)
        nir_window = from_bounds(*intersection, transform=nir.transform)

        red_data = red.read(1, window=red_window).astype("float32")
        nir_data = nir.read(1, window=nir_window).astype("float32")

        if red_data.shape != nir_data.shape:
            raise ValueError("As janelas de RED e NIR ainda resultam em tamanhos diferentes.")

        print(f"📏 Shape comum: {red_data.shape}")

        # Calcular NDVI
        print("🧮 Calculando NDVI...")
        ndvi = (nir_data - red_data) / (nir_data + red_data + 1e-10)
        ndvi = np.clip(ndvi, -1, 1)

        # Atualizar perfil com novo shape e transform
        profile = red.profile
        profile.update(
            dtype="float32",
            count=1,
            height=red_data.shape[0],
            width=red_data.shape[1],
            transform=rasterio.windows.transform(red_window, red.transform)
        )

        print(f"💾 Salvando NDVI em: {output_path}")
        with rasterio.open(output_path, "w", **profile) as dst:
            dst.write(ndvi, 1)

    # Visualização (com mesma escala de cores da máscara)
    if preview_path:
        print(f"🖼️ Gerando visualização temática em: {preview_path}")
        save_ndvi_preview_colored(ndvi, preview_path)

    print("✅ NDVI processado e salvo com sucesso.")

def save_ndvi_preview_colored(ndvi_array, save_path):
    # Inicializar imagem RGB
    rgb_image = np.zeros((ndvi_array.shape[0], ndvi_array.shape[1], 3), dtype=np.uint8)

    # Aplicar cores por faixa
    rgb_image[ndvi_array < 0.1] = [0, 0, 128]  # Azul escuro (água)
    rgb_image[(ndvi_array >= 0.1) & (ndvi_array < 0.2)] = [255, 0, 0]  # Vermelho (queimada)
    rgb_image[(ndvi_array >= 0.2) & (ndvi_array < 0.3)] = [124, 94, 21]  # Marrom (solo em recuperação)
    rgb_image[ndvi_array >= 0.3] = [16, 149, 9]  # Verde escuro (vegetação saudável)

    plt.figure(figsize=(10, 10))
    plt.imshow(rgb_image)
    plt.title("NDVI com escala temática")
    plt.axis('off')
    plt.tight_layout()
    plt.savefig(save_path, dpi=150)
    plt.close()

if __name__ == "__main__":
    compute_ndvi(
        red_path="data/raw/scene_RED.tif",
        nir_path="data/raw/scene_NIR.tif",
        output_path="data/processed/ndvi2.tif",
        preview_path="data/processed/ndvi_preview2.png"
    )
