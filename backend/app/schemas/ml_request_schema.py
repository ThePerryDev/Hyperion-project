from pydantic import BaseModel
from typing import Optional, List

class MLProcessRequest(BaseModel):
    id: str
    band13_url: str
    band14_url: str
    band15_url: str
    band16_url: str
    cmask: Optional[str] = None
    thumbnail: Optional[str] = None
    bbox: List[float]
    usuario_id: int