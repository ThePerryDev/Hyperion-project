from pydantic import BaseModel
from typing import List, Optional

class STACRequest(BaseModel):
    bbox: str
    data_inicio: str
    data_fim: str
    colecao: str
    filtrar_nuvens: Optional[bool] = False  # novo campo para ativar filtro opcional

class STACItem(BaseModel):
    id: str
    type: str
    geometry: dict
    properties: dict
    assets: dict
    links: list
    bbox: List[float]
    collection: str

class ColecaoSTAC(BaseModel):
    id: str
    descricao: str = ""