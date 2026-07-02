from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio
from datetime import datetime, timedelta, timezone

from auth.config import auth_settings
from auth.database import get_db
from auth.models import Usuario
from auth.schemas import RegistroRequest, LoginRequest, UsuarioResponse, TokenResponse
from auth.email_utils import enviar_email_verificacion

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


# ── Utils ──


def _crear_token(data: dict, minutos: int | None = None) -> str:
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=minutos or auth_settings.jwt_expire_minutes
    )
    payload["exp"] = expire
    return jwt.encode(payload, auth_settings.secret_key, algorithm=auth_settings.jwt_algorithm)


async def _usuario_actual(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> Usuario:
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token, auth_settings.secret_key, algorithms=[auth_settings.jwt_algorithm]
        )
        usuario_id: int = payload.get("sub")
        if usuario_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    result = await db.execute(select(Usuario).where(Usuario.id == usuario_id))
    usuario = result.scalar_one_or_none()
    if usuario is None or not usuario.activo:
        raise HTTPException(status_code=401, detail="Usuario no encontrado o desactivado")
    return usuario


# ── Endpoints ──


@router.post("/registro", response_model=UsuarioResponse, status_code=201)
async def registro(body: RegistroRequest, db: AsyncSession = Depends(get_db)):
    existente = await db.execute(select(Usuario).where(Usuario.email == body.email))
    if existente.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="El email ya está registrado")

    usuario = Usuario(
        nombre_completo=body.nombre_completo,
        email=body.email,
        password_hash=pwd_context.hash(body.password),
        whatsapp=body.whatsapp,
        ubicacion=body.ubicacion,
    )
    db.add(usuario)
    await db.commit()
    await db.refresh(usuario)

    # Enviar email de verificación (en segundo plano, no bloquea)
    token_verif = _crear_token({"sub": usuario.id, "tipo": "verificacion"}, minutos=1440)
    try:
        asyncio.get_running_loop().run_in_executor(None, enviar_email_verificacion, usuario.email, token_verif)
    except Exception:
        pass

    return usuario


@router.get("/verificar/{token}")
async def verificar_email(token: str, db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(
            token, auth_settings.secret_key, algorithms=[auth_settings.jwt_algorithm]
        )
        usuario_id: int = payload.get("sub")
        if payload.get("tipo") != "verificacion":
            raise HTTPException(status_code=400, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    result = await db.execute(select(Usuario).where(Usuario.id == usuario_id))
    usuario = result.scalar_one_or_none()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    usuario.email_verificado = True
    await db.commit()
    return {"mensaje": "Email verificado correctamente"}


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Usuario).where(Usuario.email == body.email))
    usuario = result.scalar_one_or_none()
    if not usuario or not pwd_context.verify(body.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    if not usuario.activo:
        raise HTTPException(status_code=401, detail="Cuenta desactivada")

    token = _crear_token({"sub": usuario.id})
    return TokenResponse(
        access_token=token,
        usuario=UsuarioResponse.model_validate(usuario),
    )


@router.post("/logout", status_code=200)
async def logout(usuario: Usuario = Depends(_usuario_actual)):
    return {"mensaje": "Sesión cerrada. Descarta el token del lado del cliente."}


@router.get("/perfil", response_model=UsuarioResponse)
async def perfil(usuario: Usuario = Depends(_usuario_actual)):
    return usuario


@router.post("/usuarios/{usuario_id}/baja", status_code=200)
async def baja_usuario(
    usuario_id: int,
    usuario: Usuario = Depends(_usuario_actual),
    db: AsyncSession = Depends(get_db),
):
    if usuario.id != usuario_id:
        raise HTTPException(status_code=403, detail="No puedes dar de baja a otro usuario")

    usuario.activo = False
    usuario.fecha_baja = datetime.now(timezone.utc)
    await db.commit()
    return {"mensaje": "Cuenta dada de baja correctamente"}
