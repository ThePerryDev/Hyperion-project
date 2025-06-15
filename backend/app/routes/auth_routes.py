from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import verify_password, create_access_token
from app.controllers.usuario_controller import UsuarioController
from app.dependencies.auth_dependencies import get_current_user
from app.models.usuario_model import Usuario

router = APIRouter()
usuario_controller = UsuarioController()

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    usuarios = await usuario_controller.buscar_usuarios()
    usuario = next((u for u in usuarios if u.email == form_data.username), None)

    if not usuario or not verify_password(form_data.password, usuario.password):
        raise HTTPException(status_code=400, detail="Usuário ou senha inválidos")

    token = create_access_token({"sub": usuario.email})

    # 🔁 Agora usando a função correta só para atualizar isLogged
    await usuario_controller.atualizar_status_login(id=usuario.id, isLogged=True)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": usuario.id,
            "name": usuario.name,
            "email": usuario.email,
            "admin": usuario.admin,
            "isLogged": True  # <-- Força o valor correto
        }
    }

@router.post("/logout")
async def logout(current_user: Usuario = Depends(get_current_user)):
    await usuario_controller.atualizar_status_login(id=current_user.id, isLogged=False)
    return {"detail": "Logout realizado com sucesso"}
