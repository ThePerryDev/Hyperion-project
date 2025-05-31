import rasterio
import torch
import numpy as np
from PIL import Image
import os
import shutil
from concurrent.futures import ThreadPoolExecutor, as_completed  # Use ProcessPoolExecutor se não usar GPU
from app.model import get_unet_model  # ajuste conforme seu projeto
from datetime import datetime

# Configurações
tile_size = 512      # Tiles maiores aceleram o processamento
stride = 512         # Menos sobreposição = menos tiles
image_path = "data/processed/ndvi.tif"
model_path = "models/final_model_1.pth"
output_dir = "output"
os.makedirs(output_dir, exist_ok=True)

# Limpa a pasta de saída antes de gerar novos arquivos
for filename in os.listdir(output_dir):
    file_path = os.path.join(output_dir, filename)
    try:
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)
    except Exception as e:
        print(f"Erro ao deletar {file_path}: {e}")

output_png = os.path.join(output_dir, "prediction_rgb2.png")
output_tif = os.path.join(output_dir, "prediction_classes2.tif")

# Apenas cicatriz de queimada (classe 1) em vermelho, o resto transparente
def colorize(mask):
    h, w = mask.shape
    rgb = np.zeros((h, w, 4), dtype=np.uint8)  # RGBA
    rgb[mask == 1] = [255, 0, 0, 255]          # Vermelho opaco
    # O resto já fica transparente (alpha=0)
    return rgb

start = datetime.now()

print("📥 Carregando imagem NDVI...")
with rasterio.open(image_path) as src:
    ndvi_array = src.read(1)
    profile = src.profile.copy()
    ndvi_array = np.nan_to_num(ndvi_array)

if ndvi_array.min() < 0 or ndvi_array.max() > 1:
    ndvi_array = (ndvi_array + 1) / 2

h, w = ndvi_array.shape
print(f"📏 Dimensão da imagem: {h}x{w}")

output_sum = np.zeros((h, w, 4), dtype=np.float32)
count_map = np.zeros((h, w, 1), dtype=np.float32)

print("🔁 Carregando modelo...")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = get_unet_model(num_classes=4).to(device)
model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()

def predict_tile(i, j):
    i_end = min(i + tile_size, h)
    j_end = min(j + tile_size, w)
    tile = ndvi_array[i:i_end, j:j_end]
    pad_h = tile_size - tile.shape[0]
    pad_w = tile_size - tile.shape[1]
    tile_padded = np.pad(tile, ((0, pad_h), (0, pad_w)), mode='constant', constant_values=0)
    tile_tensor = torch.tensor(tile_padded, dtype=torch.float32).unsqueeze(0).unsqueeze(0).to(device)
    with torch.no_grad():
        output = model(tile_tensor).squeeze(0).cpu().numpy()
    output = output[:, :tile.shape[0], :tile.shape[1]]
    return (i, i_end, j, j_end, output)

print("🧩 Executando predição paralela com tiles...")
tile_coords = [(i, j) for i in range(0, h, stride) for j in range(0, w, stride)]

with ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as executor:
    futures = [executor.submit(predict_tile, i, j) for i, j in tile_coords]
    for future in as_completed(futures):
        i, i_end, j, j_end, output = future.result()
        output_sum[i:i_end, j:j_end, :] += np.transpose(output, (1, 2, 0))
        count_map[i:i_end, j:j_end, :] += 1

print("🎯 Predição concluída.")

avg_logits = output_sum / np.maximum(count_map, 1e-8)
predicted_mask = np.argmax(avg_logits, axis=-1).astype(np.uint8)

print(f"💾 Salvando arquivo de classes em {output_tif}...")
profile.pop("nodata", None)
profile.update(dtype=rasterio.uint8, count=1)
with rasterio.open(output_tif, "w", **profile) as dst:
    dst.write(predicted_mask, 1)

print(f"💾 Salvando imagem RGB colorida em {output_png}...")
rgb_image = colorize(predicted_mask)
Image.fromarray(rgb_image).save(output_png)

print(f"⏱️ Tempo total: {(datetime.now() - start).total_seconds():.2f} segundos")
print("✅ Tudo pronto.")
