from fastapi import APIRouter, HTTPException
from app.controllers.usuario_controller import UsuarioController
from pydantic import BaseModel
from typing import Optional

router = APIRouter()
usuario_controller = UsuarioController()

class UsuarioSchema(BaseModel):
    name: str 
    email: str
    password: str
    admin: bool = False
    isLogged: bool = False


class UsuarioUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    admin: Optional[bool] = None
    isLogged: Optional[bool] = None

    class Config:
        orm_mode = True


class UsuarioResponse(BaseModel):
    id: int
    name: str
    email: str
    admin: bool
    isLogged: bool

    class Config:
        orm_mode = True


@router.post("/usuarios/post")
async def criar_usuario(usuario: UsuarioSchema):
    usuario_criado = await usuario_controller.criar_usuario(
        name=usuario.name,
        email=usuario.email,
        password=usuario.password,
        admin=usuario.admin,
        isLogged=usuario.isLogged
    )
    return usuario_criado


@router.get("/usuarios/getall")
async def listar_usuarios():
    usuarios = await usuario_controller.buscar_usuarios()
    return usuarios

@router.get("/usuarios/get/{id}")
async def buscar_usuario(id: int):
    usuario = await usuario_controller.buscar_usuario_por_id(id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario

@router.put("/usuarios/put/{id}", response_model=UsuarioResponse)
async def atualizar_usuario(id: int, usuario_update: UsuarioUpdate):
    usuario = await usuario_controller.atualizar_usuario(
        id=id,
        name=usuario_update.name,
        email=usuario_update.email,
        password=usuario_update.password,
        admin=usuario_update.admin,
        isLogged=usuario_update.isLogged
    )
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return usuario


@router.delete("/usuarios/delete/{id}")
async def deletar_usuario(id: int):
    usuario = await usuario_controller.deletar_usuario(id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return {"detail": "Usuário deletado com sucesso"}