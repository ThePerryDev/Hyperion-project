import sys
sys.path.append(".")

import os
import torch
import rasterio
import numpy as np
from PIL import Image, ImageDraw
from app.model import get_unet_model

# Cores RGBA (última é a transparência)
COLORS = {
    1: (255, 0, 0, 255),     # Queimada
    2: (124, 94, 21, 255),   # Solo
    3: (16, 149, 9, 255),    # Vegetação
}

def run_model(ndvi_path, output_prefix):
    tile_size = 256
    stride = 128

    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)

    output_tif = os.path.join(output_dir, f"{output_prefix}_classes.tif")
    output_png = os.path.join(output_dir, f"{output_prefix}_rgb.png")

    print("📅 Carregando NDVI...")
    with rasterio.open(ndvi_path) as src:
        ndvi_array = src.read(1)
        profile = src.profile.copy()
        ndvi_array = np.nan_to_num(ndvi_array)
        transform = src.transform
        crs = src.crs

    if ndvi_array.min() < 0 or ndvi_array.max() > 1:
        ndvi_array = (ndvi_array + 1) / 2

    h, w = ndvi_array.shape
    print(f"📏 Dimensão: {h}x{w}")

    predicted_mask = np.zeros((h, w), dtype=np.uint8)
    rgba_image = Image.new("RGBA", (w, h))
    draw = ImageDraw.Draw(rgba_image)

    print("🔄 Carregando modelo...")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = get_unet_model(num_classes=4).to(device)
    model.load_state_dict(torch.load("models/final_model_1.pth", map_location=device))
    model.eval()

    print("🧹 Rodando modelo tile por tile...")
    with torch.no_grad():
        for i in range(0, h, stride):
            for j in range(0, w, stride):
                i_end = min(i + tile_size, h)
                j_end = min(j + tile_size, w)
                tile = ndvi_array[i:i_end, j:j_end]

                pad_h = tile_size - tile.shape[0]
                pad_w = tile_size - tile.shape[1]
                tile_padded = np.pad(tile, ((0, pad_h), (0, pad_w)), mode='constant', constant_values=0)

                tile_tensor = torch.tensor(tile_padded, dtype=torch.float32).unsqueeze(0).unsqueeze(0).to(device)
                output = model(tile_tensor).squeeze(0).cpu().numpy()
                output = output[:, :tile.shape[0], :tile.shape[1]]

                predicted = np.argmax(output, axis=0).astype(np.uint8)
                predicted_mask[i:i_end, j:j_end] = predicted

                for label, color in COLORS.items():
                    ys, xs = np.where(predicted == label)
                    for y, x in zip(ys, xs):
                        draw.point((j + x, i + y), fill=color)

    print(f"📀 Salvando classes em {output_tif}")
    profile.pop("nodata", None)
    profile.update(dtype=rasterio.uint8, count=1)
    with rasterio.open(output_tif, "w", **profile) as dst:
        dst.write(predicted_mask, 1)

    print(f"📀 Salvando preview transparente em {output_png}")
    rgba_image.save(output_png)

    print("✅ Tudo pronto.")

if __name__ == "__main__":
    ndvi_path = sys.argv[1]
    output_prefix = sys.argv[2]
    run_model(ndvi_path, output_prefix)




'''
import sys
import sys
sys.path.append(".")  # garante que o diretório raiz está no PYTHONPATH
from app.model import get_unet_model
import rasterio
import torch
import numpy as np
from PIL import Image
import os

def colorize(mask):
    COLORS = {
        0: [0, 0, 139],
        1: [255, 0, 0],
        2: [124, 94, 21],
        3: [16, 149, 9]
    }
    h, w = mask.shape
    rgb = np.zeros((h, w, 3), dtype=np.uint8)
    for label, color in COLORS.items():
        rgb[mask == label] = color
    return rgb

def run_model(ndvi_path, output_prefix):
    tile_size = 256
    stride = 128

    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)

    output_tif = os.path.join(output_dir, f"{output_prefix}_classes.tif")
    output_png = os.path.join(output_dir, f"{output_prefix}_rgb.png")

    print("📥 Carregando NDVI...")
    with rasterio.open(ndvi_path) as src:
        ndvi_array = src.read(1)
        profile = src.profile.copy()
        ndvi_array = np.nan_to_num(ndvi_array)

    if ndvi_array.min() < 0 or ndvi_array.max() > 1:
        ndvi_array = (ndvi_array + 1) / 2

    h, w = ndvi_array.shape
    print(f"📏 Dimensão: {h}x{w}")

    output_sum = np.zeros((h, w, 4), dtype=np.float32)
    count_map = np.zeros((h, w, 1), dtype=np.float32)

    print("🔁 Carregando modelo...")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = get_unet_model(num_classes=4).to(device)
    model.load_state_dict(torch.load("models/final_model_1.pth", map_location=device))
    model.eval()

    print("🧩 Rodando modelo...")
    with torch.no_grad():
        for i in range(0, h, stride):
            for j in range(0, w, stride):
                i_end = min(i + tile_size, h)
                j_end = min(j + tile_size, w)
                tile = ndvi_array[i:i_end, j:j_end]
                pad_h = tile_size - tile.shape[0]
                pad_w = tile_size - tile.shape[1]
                tile_padded = np.pad(tile, ((0, pad_h), (0, pad_w)), mode='constant', constant_values=0)

                tile_tensor = torch.tensor(tile_padded, dtype=torch.float32).unsqueeze(0).unsqueeze(0).to(device)
                output = model(tile_tensor).squeeze(0).cpu().numpy()
                output = output[:, :tile.shape[0], :tile.shape[1]]
                output_sum[i:i_end, j:j_end, :] += np.transpose(output, (1, 2, 0))
                count_map[i:i_end, j:j_end, :] += 1

    print("🎯 Concluído.")

    avg_logits = output_sum / np.maximum(count_map, 1e-8)
    predicted_mask = np.argmax(avg_logits, axis=-1).astype(np.uint8)

    print(f"💾 Salvando classes em {output_tif}")
    profile.pop("nodata", None)
    profile.update(dtype=rasterio.uint8, count=1)
    with rasterio.open(output_tif, "w", **profile) as dst:
        dst.write(predicted_mask, 1)

    print(f"💾 Salvando preview em {output_png}")
    rgb_image = colorize(predicted_mask)
    Image.fromarray(rgb_image).save(output_png)

    print("✅ Tudo pronto.")

if __name__ == "__main__":
    ndvi_path = sys.argv[1]
    output_prefix = sys.argv[2]
    run_model(ndvi_path, output_prefix)

'''