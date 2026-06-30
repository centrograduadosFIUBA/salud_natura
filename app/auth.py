import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional

SECRET_KEY = "tu-clave-secreta-super-segura-cambiar-en-produccion"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def hashear_contraseña(contraseña: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(contraseña.encode(), salt).decode()


def verificar_contraseña(contraseña: str, hash_contraseña: str) -> bool:
    return bcrypt.checkpw(contraseña.encode(), hash_contraseña.encode())


def crear_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verificar_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.InvalidTokenError:
        return None
