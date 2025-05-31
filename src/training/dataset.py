import numpy as np
import os
from torch.utils.data import Dataset, DataLoader
import torch
import albumentations as A
from albumentations.pytorch import ToTensorV2

class NDVIDataset(Dataset):
    def __init__(self, ndvi_dir, mask_dir, transform=None):
        self.ndvi_paths = sorted([
            os.path.join(ndvi_dir, f) for f in os.listdir(ndvi_dir)
            if f.endswith(".npy") and "img" in f
        ])
        self.mask_paths = sorted([
            os.path.join(mask_dir, f) for f in os.listdir(mask_dir)
            if f.endswith(".npy") and "mask" in f
        ])

        assert len(self.ndvi_paths) == len(self.mask_paths), \
            f"Número de imagens ({len(self.ndvi_paths)}) e máscaras ({len(self.mask_paths)}) não coincide!"

        self.transform = transform
        print(f"✅ Dataset inicializado com {len(self.ndvi_paths)} pares de NDVI e máscara.")

        # Verificação de classes únicas
        all_classes = set()
        for mask_path in self.mask_paths:
            mask = np.load(mask_path).astype(np.uint8)
            all_classes.update(np.unique(mask).tolist())
        print(f"🎯 Classes únicas encontradas no dataset: {sorted(all_classes)}")

    def __len__(self):
        return len(self.ndvi_paths)

    def __getitem__(self, idx):
        ndvi = np.load(self.ndvi_paths[idx]).astype(np.float32)
        mask = np.load(self.mask_paths[idx]).astype(np.uint8)

        # Normalizar NDVI para [0, 1] se necessário
        if ndvi.min() < 0 or ndvi.max() > 1:
            ndvi = (ndvi + 1) / 2

        # Garantir que a máscara é 2D
        if mask.ndim == 3:
            mask = mask[:, :, 0]

        if self.transform:
            augmented = self.transform(image=ndvi, mask=mask)
            ndvi = augmented["image"]
            mask = augmented["mask"]
        else:
            ndvi = torch.from_numpy(ndvi).unsqueeze(0)  # [1, H, W]
            mask = torch.from_numpy(mask)

        return ndvi.float(), mask.long()

# Teste isolado
if __name__ == "__main__":
    ndvi_dir = "data/tiles/images"
    mask_dir = "data/tiles/masks"

    dataset = NDVIDataset(ndvi_dir, mask_dir)
    dataloader = DataLoader(dataset, batch_size=1, shuffle=True)

    all_classes = set()
    for _, mask in dataloader:
        all_classes.update(torch.unique(mask).tolist())

    print("📊 Classes encontradas durante iteração:", sorted(all_classes))
