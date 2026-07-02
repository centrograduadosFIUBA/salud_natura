from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class RegistroRequest(BaseModel):
    nombre_completo: str
    email: EmailStr
    password: str
    whatsapp: Optional[str] = None
    ubicacion: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UsuarioResponse(BaseModel):
    id: int
    nombre_completo: str
    email: str
    whatsapp: Optional[str] = None
    ubicacion: Optional[str] = None
    email_verificado: bool
    activo: bool
    fecha_alta: Optional[datetime] = None
    fecha_baja: Optional[datetime] = None

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResponse
