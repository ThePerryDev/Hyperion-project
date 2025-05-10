from pydantic import BaseModel
from datetime import date

class STACRequest(BaseModel):
    colecao: str
    data_inicio: date
    data_fim: date
    bbox: str  # Ex: "-49.2,-20.8,-49.1,-20.7"
    filtrar_nuvens: bool = False
