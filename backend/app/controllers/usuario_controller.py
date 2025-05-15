from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import NoResultFound
from app.models.usuario_model import Usuario
from app.core.database import SessionLocal

class UsuarioController:
    def __init__(self):
        self.session: AsyncSession = SessionLocal()

    async def criar_usuario(self, name, email, password, admin=False, isLogged=False):
        usuario = Usuario(name=name, email=email, password=password, admin=admin, isLogged=isLogged)
        async with self.session as session:
            async with session.begin():
                session.add(usuario)
        return usuario

    async def buscar_usuarios(self):
        async with self.session as session:
            async with session.begin():
                result = await session.execute(select(Usuario))
                usuarios = result.scalars().all()
        return usuarios

    async def buscar_usuario_por_id(self, id):
        async with self.session as session:
            async with session.begin():
                result = await session.execute(select(Usuario).where(Usuario.id == id))  # Alterado id_usuario para id
                try:
                    usuario = result.scalar_one()
                except NoResultFound:
                    usuario = None
        return usuario

    async def atualizar_usuario(self, id, name, email, password, admin, isLogged):
        async with self.session as session:
            async with session.begin():
                result = await session.execute(select(Usuario).where(Usuario.id == id))  # Alterado id_usuario para id
                try:
                    usuario = result.scalar_one()
                    usuario.name = name
                    usuario.email = email
                    usuario.password = password
                    usuario.admin = admin
                    usuario.isLogged = isLogged
                    await session.commit()
                except NoResultFound:
                    usuario = None
        return usuario

    async def deletar_usuario(self, id):
        async with self.session as session:
            async with session.begin():
                result = await session.execute(select(Usuario).where(Usuario.id == id))  # Alterado id_usuario para id
                try:
                    usuario = result.scalar_one()
                    await session.delete(usuario)
                    await session.commit()
                except NoResultFound:
                    usuario = None
        return usuario
