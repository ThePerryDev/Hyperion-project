from fastapi import APIRouter, Depends, HTTPException
from app.controllers.usuario_controller import UsuarioController
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import verify_password, create_access_token, hash_password
from pydantic import BaseModel
from typing import Optional
from app.dependencies.auth_dependencies import get_current_user
from app.models.usuario_model import Usuario

router = APIRouter()
usuario_controller = UsuarioController()

class UsuarioSchema(BaseModel):
    name: str 
    email: str
    password: str
    admin: bool = False

class UsuarioUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    admin: Optional[bool] = None

    class Config:
        from_attributes = True

class UsuarioResponse(BaseModel):
    id: int
    name: str
    email: str
    admin: bool
    isLogged: bool

    class Config:
        from_attributes = True

@router.post("/usuarios/post", response_model=UsuarioResponse)
async def criar_usuario(usuario: UsuarioSchema):
    usuario_criado = await usuario_controller.criar_usuario(
        name=usuario.name,
        email=usuario.email,
        password=hash_password(usuario.password),
        admin=usuario.admin,
        isLogged=False
    )
    return usuario_criado

@router.get("/usuarios/getall")
async def listar_usuarios(current_user: Usuario = Depends(get_current_user)):
    return await usuario_controller.buscar_usuarios()

@router.get("/usuarios/me")
async def get_usuario_logado(current_user: Usuario = Depends(get_current_user)):
    return current_user

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
        password=hash_password(usuario_update.password) if usuario_update.password else None,
        admin=usuario_update.admin
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
