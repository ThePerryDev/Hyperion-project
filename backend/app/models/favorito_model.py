# app/models/favorito_model.py
from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class Favorito(Base):
    __tablename__ = "favoritos"
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    id_imagem = Column(String, nullable=False)
