from sqlalchemy import Column, String, Date, JSON, Integer, ForeignKey
from app.core.database import Base
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import engine  # O engine assíncrono configurado
from datetime import date

class Consulta(Base):
    __tablename__ = 'tb_consultas'
    
    id = Column(String, primary_key=True, unique=True, index=True) 
    id_consulta = Column(String, nullable=False)
    banda13 = Column(String, nullable=True)
    banda14 = Column(String, nullable=True)
    banda15 = Column(String, nullable=True)
    banda16 = Column(String, nullable=True)
    cmask = Column(String, nullable=True)
    thumbnail = Column(String, nullable=True)
    data = Column(Date, nullable=False, default=date.today)
    cobertura_nuvem = Column(String, nullable=True)
    bbox = Column(JSON, nullable=True)  # Usando JSON para armazenar o array "bbox"
    bandas = Column(JSON, nullable=True)  # Usando JSON para armazenar o dicionário "bandas"

    # 🆕 Novos campos para persistir resultados do processamento
    ndvi_tif = Column(String, nullable=True)
    ndvi_png = Column(String, nullable=True)
    segmentado_tif = Column(String, nullable=True)
    segmentado_png = Column(String, nullable=True)

    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)

# Função assíncrona para criar a tabela
async def create_tables():
    async with engine.begin() as conn:
        # Cria a tabela tb_consultas no banco de dados
        await conn.run_sync(Base.metadata.create_all)

# Chama a função para criar a tabela dentro do evento do loop assíncrono
if __name__ == "__main__":
    import asyncio
    loop = asyncio.get_event_loop()
    loop.run_until_complete(create_tables())
