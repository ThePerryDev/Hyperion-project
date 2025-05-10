# app/models.py
from pydantic import BaseModel
from typing import List
from datetime import date

class BuscaParametros(BaseModel):
    satelites: List[str]
    data_inicio: date
    data_fim: date
    coordenadas: List[float]  # [lon_min, lat_min, lon_max, lat_max]
