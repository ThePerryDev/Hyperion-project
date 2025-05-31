import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
import torch
from torch.utils.data import DataLoader, random_split
from dataset import NDVIDataset
from model import get_unet_model
from src.utils.early_stop import EarlyStopping
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import albumentations as A
from albumentations.pytorch import ToTensorV2

# Configurações
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
batch_size = 8
n_epochs = 50
learning_rate = 1e-3
patience = 5

print(f"Treinando no dispositivo: {device}")

# Caminhos
ndvi_dir = "data/tiles/images"
mask_dir = "data/tiles/masks"
output_dir = "output"
model_dir = "models"

os.makedirs(output_dir, exist_ok=True)
os.makedirs(model_dir, exist_ok=True)

# Transformações
transform = A.Compose([
    A.HorizontalFlip(p=0.5),
    A.RandomBrightnessContrast(p=0.2),
    ToTensorV2()
])

# Dataset
full_dataset = NDVIDataset(ndvi_dir=ndvi_dir, mask_dir=mask_dir, transform=transform)
train_size = int(0.8 * len(full_dataset))
val_size = len(full_dataset) - train_size
train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

print(f"Tamanho total: {len(full_dataset)}")
print(f"Treino: {len(train_dataset)} | Validação: {len(val_dataset)}")

# Dataloaders
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

# Modelo
model = get_unet_model(num_classes=4).to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)
loss_fn = torch.nn.CrossEntropyLoss()

# EarlyStopping
early_stopping = EarlyStopping(patience=patience, verbose=True)

# Visualização
def visualize_predictions(x_batch, y_batch, out, epoch, save_path):
    with torch.no_grad():
        pred = torch.argmax(out, dim=1).cpu().numpy()
        y_batch = y_batch.cpu().numpy()

        fig, axs = plt.subplots(x_batch.size(0), 3, figsize=(12, 4 * x_batch.size(0)))
        for idx in range(x_batch.size(0)):
            axs[idx, 0].imshow(x_batch[idx, 0].cpu(), cmap='gray')
            axs[idx, 0].set_title(f"Entrada {idx}")
            axs[idx, 0].axis('off')

            axs[idx, 1].imshow(y_batch[idx], cmap='tab20b')
            axs[idx, 1].set_title(f"Máscara Real {idx}")
            axs[idx, 1].axis('off')

            axs[idx, 2].imshow(pred[idx], cmap='tab20b')
            axs[idx, 2].set_title(f"Predição {idx}")
            axs[idx, 2].axis('off')

        plt.tight_layout()
        plt.savefig(save_path)
        plt.close()

# Treinamento
history = {"epoch": [], "train_loss": [], "val_loss": []}
best_val_loss = np.inf

for epoch in range(1, n_epochs + 1):
    model.train()
    train_loss = 0.0

    for batch_idx, (x_batch, y_batch) in enumerate(train_loader):
        x_batch, y_batch = x_batch.to(device), y_batch.to(device)

        optimizer.zero_grad()
        outputs = model(x_batch)
        loss = loss_fn(outputs, y_batch)
        loss.backward()
        optimizer.step()

        train_loss += loss.item()
        print(f"Epoch [{epoch}/{n_epochs}] - Batch [{batch_idx+1}/{len(train_loader)}] - Loss: {loss.item():.4f}")

    avg_train_loss = train_loss / len(train_loader)

    # Validação
    model.eval()
    val_loss = 0.0
    with torch.no_grad():
        for x_val, y_val in val_loader:
            x_val, y_val = x_val.to(device), y_val.to(device)
            outputs_val = model(x_val)
            loss = loss_fn(outputs_val, y_val)
            val_loss += loss.item()

    avg_val_loss = val_loss / len(val_loader)

    history["epoch"].append(epoch)
    history["train_loss"].append(avg_train_loss)
    history["val_loss"].append(avg_val_loss)

    print(f"==> Epoch [{epoch}/{n_epochs}] finalizado. Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f}")

    sample_batch = next(iter(val_loader))
    sample_x, sample_y = sample_batch[0].to(device), sample_batch[1].to(device)
    output_sample = model(sample_x)
    visualize_predictions(sample_x, sample_y, output_sample, epoch, f"{output_dir}/epoch_{epoch}.png")

    early_stopping(avg_val_loss, model)

    if avg_val_loss < best_val_loss:
        best_val_loss = avg_val_loss
        torch.save(model.state_dict(), f"{model_dir}/best_model.pth")
        print(f"✅ Melhor modelo salvo com Val Loss: {best_val_loss:.4f}")

    if early_stopping.early_stop:
        print("⏹️ Early stopping ativado.")
        break

# Salvar final
torch.save(model.state_dict(), f"{model_dir}/final_model.pth")
print("✅ Modelo final salvo.")

# Histórico CSV
df_history = pd.DataFrame(history)
df_history.to_csv(f"{output_dir}/training_history.csv", index=False)
print(f"📈 Histórico salvo em {output_dir}/training_history.csv")

# Curva de perda
plt.figure(figsize=(10, 5))
plt.plot(df_history["epoch"], df_history["train_loss"], label="Train Loss")
plt.plot(df_history["epoch"], df_history["val_loss"], label="Val Loss")
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.title('Loss de Treinamento e Validação')
plt.legend()
plt.grid(True)
plt.savefig(f"{output_dir}/loss_curve.png")
plt.show()
