from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.utils.websocket_manager import websocket_manager
from app.core.security import decode_token
from jose import JWTError

router = APIRouter()

@router.websocket("/ws/{id}")
async def websocket_endpoint(websocket: WebSocket, id: str, token: str = Query(...)):
    try:
        # 🔐 Decodifica e valida o token
        payload = decode_token(token)
        user_id = payload.get("sub")

        if user_id is None:
            await websocket.close(code=1008)  # Policy Violation
            return

        await websocket_manager.connect(id, websocket)
        print(f"🔗 WebSocket conectado para {id} pelo usuário {user_id}")

        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        print(f"❌ WebSocket desconectado: {id}")
        await websocket_manager.disconnect(id)
    except JWTError as e:
        print(f"🔒 Token JWT inválido: {e}")
        await websocket.close(code=1008)
    except Exception as e:
        print(f"⚠️ Erro inesperado no WebSocket de {id}: {e}")
        await websocket_manager.disconnect(id)
