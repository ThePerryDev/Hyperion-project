from sqlalchemy import Column, Float, Integer, String, DateTime, ForeignKey, ARRAY
from sqlalchemy.sql import func
from app.core.database import Base

class Processamento(Base):
    __tablename__ = "processamentos"

    id = Column(Integer, primary_key=True, index=True)
    id_imagem = Column(String, nullable=False)

    banda13 = Column(String)
    banda14 = Column(String)
    banda15 = Column(String)
    banda16 = Column(String)
    cmask = Column(String, nullable=True)
    thumbnail = Column(String, nullable=True)

    ndvi_tif = Column(String)
    ndvi_png = Column(String)
    segmentado_tif = Column(String)
    segmentado_png = Column(String)

    bbox_real = Column(ARRAY(Float))
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    data_processamento = Column(DateTime(timezone=True), server_default=func.now())
