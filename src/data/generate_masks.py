import numpy as np
import rasterio
import os
import matplotlib.pyplot as plt
from matplotlib import use as mpl_use
mpl_use('Agg')  # prevenir erros de GUI

def generate_mask(ndvi_array):
    ndvi_array = np.clip(ndvi_array, -1, 1)
    ndvi_array = np.nan_to_num(ndvi_array, nan=0.0, posinf=1.0, neginf=-1.0)
    mask = np.zeros_like(ndvi_array, dtype="uint8")
    mask[(ndvi_array < 0.1)] = 0
    mask[(ndvi_array >= 0.1) & (ndvi_array < 0.2)] = 1
    mask[(ndvi_array >= 0.2) & (ndvi_array < 0.3)] = 2
    mask[ndvi_array >= 0.3] = 3
    print(f"🎯 Valores únicos na máscara: {np.unique(mask)}")
    return mask

def save_mask_as_npy(mask, output_path):
    np.save(output_path, mask)
    print(f"💾 Máscara salva em .npy: {output_path}")

def save_mask_as_tif(mask, ref_profile, output_tif_path):
    profile = ref_profile.copy()
    profile.pop("nodata", None)  # 🔥 Remove nodata incompatível
    profile.update(dtype="uint8", count=1)

    with rasterio.open(output_tif_path, "w", **profile) as dst:
        dst.write(mask.astype("uint8"), 1)
    print(f"🗺️ Máscara salva em GeoTIFF: {output_tif_path}")


def visualize_mask(mask, output_path):
    color_map = {
        0: [0, 0, 0],
        1: [255, 0, 0],
        2: [124, 94, 21],
        3: [16, 149, 9],
    }
    rgb_mask = np.zeros((*mask.shape, 3), dtype=np.uint8)
    for val, color in color_map.items():
        rgb_mask[mask == val] = color
    plt.figure(figsize=(8, 6))
    plt.imshow(rgb_mask)
    plt.title("Visualização da Máscara Gerada")
    plt.axis('off')
    plt.tight_layout()
    plt.savefig(output_path, dpi=150)
    plt.close()
    print(f"🖼️ Pré-visualização da máscara salva em: {output_path}")
    
def print_class_distribution(mask):
    unique, counts = np.unique(mask, return_counts=True)
    total = mask.size
    print("📊 Distribuição de classes:")
    for val, count in zip(unique, counts):
        pct = (count / total) * 100
        print(f"  - Classe {val}: {count} pixels ({pct:.2f}%)")
    print(f"Total de pixels: {total}")

def process_ndvi_batch(ndvi_paths, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    for ndvi_path in ndvi_paths:
        filename = os.path.splitext(os.path.basename(ndvi_path))[0]  # exemplo: ndvi_2024
        output_npy = os.path.join(output_dir, f"{filename}_mask.npy")
        output_tif = os.path.join(output_dir, f"{filename}_mask.tif")
        output_png = os.path.join(output_dir, f"{filename}_preview.png")

        print(f"\n📥 Processando: {ndvi_path}")
        with rasterio.open(ndvi_path) as src:
            ndvi_array = src.read(1)
            profile = src.profile
            print(f"📏 NDVI: min={np.min(ndvi_array):.4f}, max={np.max(ndvi_array):.4f}")

            mask = generate_mask(ndvi_array)
            print_class_distribution(mask)  # <-- AQUI
            save_mask_as_npy(mask, output_npy)
            save_mask_as_tif(mask, profile, output_tif)
            visualize_mask(mask, output_png)

# Execução principal
if __name__ == "__main__":
    # Adicione aqui os caminhos das imagens NDVI
    ndvi_paths = [
        "data/processed/ndvi_cicatriz_vegetacao.tif",
        "data/processed/ndvi_rio.tif",
        "data/processed/ndvi_vegetacao_saudavel.tif",
        "data/processed/half_full_img_2.tif",
        "data/processed/half_full_img.tif",
        "data/processed/CBERS_4_AWFI_20240930_159_123.tif",
    ]
    output_dir = "data/processed/masks"
    process_ndvi_batch(ndvi_paths, output_dir)
