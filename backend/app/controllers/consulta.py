from sqlalchemy.future import select
from app.core.database import SessionLocal
from app.schemas.tb_consulta import Consulta

async def persistir_consulta(data: dict):
    """
    Persiste no banco de dados os dados de uma imagem processada. 
    Se o registro (baseado em data['id']) já existir, retorna o registro existente.
    
    Campos esperados em 'data':
      - id: ID da imagem, ex: "CBERS_4A_WFI_20240830_202_140"
      - bandas: dicionário com keys "BAND13", "BAND14", "BAND15", "BAND16" contendo os links de download
      - cmask: (opcional) link da máscara, se existir
      - thumbnail: (opcional) link da thumbnail/preview da imagem
      - data: data da imagem (já formatada ou como objeto datetime)
      - cobertura_nuvem: valor da cobertura de nuvens
      - bbox: bounding box da imagem
      - ndvi_tif: caminho para o arquivo NDVI .tif gerado
      - ndvi_png: caminho para o arquivo NDVI .png gerado
      - segmentado_tif: caminho para o arquivo segmentado .tif gerado
      - segmentado_png: caminho para o arquivo segmentado .png gerado
      - usuario_id: ID do usuário que processou a imagem
    """
    async with SessionLocal() as session:
        result = await session.execute(
            select(Consulta).where(Consulta.id == data['id'])
        )
        existente = result.scalar_one_or_none()
        if existente:
            return existente  # Registro já existe, retorna-o sem persistir novamente

        # Cria um novo registro no modelo Consulta
        consulta = Consulta(
            id=data['id'],
            id_consulta=data['id'],
            banda13=data['bandas'].get('BAND13'),
            banda14=data['bandas'].get('BAND14'),
            banda15=data['bandas'].get('BAND15'),
            banda16=data['bandas'].get('BAND16'),
            cmask=data.get('cmask'),
            thumbnail=data.get('thumbnail'),
            data=data['data'],
            cobertura_nuvem=data.get('cobertura_nuvem'),
            bbox=data['bbox'],
            bandas=data['bandas'],
            ndvi_tif=data.get('ndvi_tif'),
            ndvi_png=data.get('ndvi_png'),
            segmentado_tif=data.get('segmentado_tif'),
            segmentado_png=data.get('segmentado_png'),
            usuario_id=data.get('usuario_id')
        )

        session.add(consulta)
        await session.commit()
        return consulta
