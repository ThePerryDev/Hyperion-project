# backend/app/controller/consulta.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.tb_consulta import Consulta
from app.core.database import SessionLocal

# Função assíncrona para persistir os dados no banco
async def persistir_consulta(data: dict):
    async with SessionLocal() as session:  # Sessão assíncrona
        consulta = Consulta(
            id=data['id'],
            id_consulta=data['id'],
            banda13=data['bandas']['BAND13'],
            banda14=data['bandas']['BAND14'],
            banda15=data['bandas']['BAND15'],
            banda16=data['bandas']['BAND16'],
            cmask=data['cmask'],
            thumbnail=data['thumbnail'],
            data=data['data'],
            cobertura_nuvem=data['cobertura_nuvem'],
            bbox=data['bbox'],
            bandas=data['bandas']
        )

        session.add(consulta)
        await session.commit()
        return consulta  # Retorna o objeto persistido para feedback
