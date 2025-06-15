from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from app.core.security import decode_token
from app.controllers.usuario_controller import UsuarioController

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido ou expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    controller = UsuarioController()
    usuarios = await controller.buscar_usuarios()
    usuario = next((u for u in usuarios if u.email == email), None)

    if usuario is None or not usuario.isLogged:
        raise credentials_exception

    return usuario
