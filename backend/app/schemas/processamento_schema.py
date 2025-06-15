from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProcessamentoSchema(BaseModel):
    id: int
    id_imagem: str
    banda13: str
    banda14: str
    banda15: str
    banda16: str
    cmask: Optional[str]
    thumbnail: Optional[str]
    ndvi_tif: str
    ndvi_png: str
    segmentado_tif: str
    segmentado_png: str
    bbox_real: List[float]
    data_processamento: datetime

    class Config:
        from_attributes = True
