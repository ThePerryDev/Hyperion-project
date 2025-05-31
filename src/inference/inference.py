import torch
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import rasterio
import cv2
import os

from training import model

# ===== 1. Carregar modelo treinado =====
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = get_unet_model(num_classes=4).to(device)
model.load_state_dict(torch.load("model_final.pth"))  # ajuste o nome se necessário
model.eval()

# ===== 2. Carregar NDVI e fazer predição =====
with rasterio.open("data/processed/ndvi.tif") as src:
    ndvi = src.read(1)
    ndvi_rescaled = (ndvi - ndvi.min()) / (ndvi.max() - ndvi.min())  # Normalização
    ndvi_tensor = torch.tensor(ndvi_rescaled).unsqueeze(0).unsqueeze(0).float().to(device)

with torch.no_grad():
    output = model(ndvi_tensor)
    pred_class = output.argmax(dim=1).squeeze().cpu().numpy()  # [H, W]

# ===== 3. Converter para máscara RGB =====
class_to_color = {
    0: (0, 0, 0),
    1: (255, 0, 0),       # Queimada
    2: (255, 255, 255),
    3: (0, 128, 0)
}

mask_rgb = np.zeros((pred_class.shape[0], pred_class.shape[1], 3), dtype=np.uint8)
for cls, color in class_to_color.items():
    mask_rgb[pred_class == cls] = color

# ===== 4. Sobrepor máscara na NDVI original =====
ndvi_image = Image.open("data/processed/ndvi.tif").convert("RGB")
ndvi_image = ndvi_image.resize((pred_class.shape[1], pred_class.shape[0]))
ndvi_np = np.array(ndvi_image)

blended = (0.6 * ndvi_np + 0.4 * mask_rgb).astype(np.uint8)

# ===== 5. Salvar ou mostrar imagem =====
Image.fromarray(blended).save("output/ndvi_segmented_overlay.png")
plt.imshow(blended)
plt.title("NDVI + Segmentação de Queimada")
plt.axis("off")
plt.show()

# ===== 6. (Opcional) Gerar contornos das áreas queimadas =====
mask_burned = (pred_class == 1).astype(np.uint8)  # Somente classe de queimada
contours, _ = cv2.findContours(mask_burned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Criar imagem com contornos
contour_img = ndvi_np.copy()
cv2.drawContours(contour_img, contours, -1, (255, 0, 0), 2)
Image.fromarray(contour_img).save("output/contornos_queimada.png")
