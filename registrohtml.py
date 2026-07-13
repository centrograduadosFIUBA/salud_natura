"""
registrohtml.py — Aplicación FastAPI auto-contenida de Registro, Login
y Recuperación de Contraseñas.

Gestiona clientes en 3 bases de datos escalonadas por antigüedad:
  - staging.db  (SQLite)      → mes 1
  - final.db    (SQLite)      → mes 2
  - clientes    (PostgreSQL)  → después del mes 2

Ejecución:
    python registrohtml.py
    → http://localhost:8010
"""
import os
import re
import sqlite3
import secrets
import hashlib
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from typing import Optional
from contextlib import asynccontextmanager

from dotenv import load_dotenv
import psycopg2
import psycopg2.extras
from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt

load_dotenv()

# ===============================================================
# Config
# ===============================================================
SMTP_HOST = os.getenv("SMTP_HOST") or os.getenv("AUTH_SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT") or os.getenv("AUTH_SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER") or os.getenv("AUTH_GMAIL_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD") or os.getenv("AUTH_GMAIL_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM", SMTP_USER)

PG_HOST = os.getenv("PG_HOST", "localhost")
PG_PORT = int(os.getenv("PG_PORT", "5432"))
PG_USER = os.getenv("PG_USER", "postgres")
PG_PASSWORD = os.getenv("PG_PASSWORD", "postgres")

DB_STAGING = "staging.db"
DB_FINAL = "final.db"
DB_CLIENTES = "clientes"

BASE_URL = os.getenv("AUTH_BASE_URL", "http://localhost:8010")
SECRET_KEY = os.getenv("AUTH_SECRET_KEY", "cambiar-esta-clave-en-produccion")
JWT_ALGORITHM = os.getenv("AUTH_JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("AUTH_JWT_EXPIRE_MINUTES", "60"))

_CLIENTES_FIELDS = """
    email TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    whatsapp TEXT,
    provincia_pais TEXT,
    email_verificado INTEGER DEFAULT 0,
    activo INTEGER DEFAULT 1,
    fecha_alta TIMESTAMP,
    fecha_baja TIMESTAMP
"""

# ===============================================================
# Password hashing (PBKDF2)
# ===============================================================
def _hash_password(password: str, salt: Optional[str] = None):
    if salt is None:
        salt = secrets.token_hex(16)
    hash_bytes = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000
    )
    return hash_bytes.hex(), salt


def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    new_hash, _ = _hash_password(password, salt)
    return new_hash == stored_hash


# ===============================================================
# JWT
# ===============================================================
def _crear_token(data: dict, minutos: Optional[int] = None) -> str:
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=minutos or JWT_EXPIRE_MINUTES)
    payload["exp"] = expire
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)


def _verificar_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except JWTError:
        return None


# ===============================================================
# Conexiones
# ===============================================================
def _con_sqlite(db_path: str):
    return sqlite3.connect(db_path)


def _con_pg():
    return psycopg2.connect(
        host=PG_HOST, port=PG_PORT, dbname=DB_CLIENTES,
        user=PG_USER, password=PG_PASSWORD,
    )


# ===============================================================
# Inicialización de bases
# ===============================================================
def init_bases():
    for db in (DB_STAGING, DB_FINAL):
        conn = _con_sqlite(db)
        conn.execute(f"CREATE TABLE IF NOT EXISTS clientes ({_CLIENTES_FIELDS})")
        conn.commit()
        conn.close()
    try:
        conn = _con_pg()
        conn.execute(
            f"CREATE TABLE IF NOT EXISTS clientes "
            f"({_CLIENTES_FIELDS.replace('?', '%s').replace('INTEGER', 'INT')})"
        )
        conn.commit()
        conn.close()
    except Exception:
        pass


# ===============================================================
# Envío de correos
# ===============================================================
def _enviar_email(destinatario: str, asunto: str, cuerpo_html: str):
    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        return
    msg = MIMEText(cuerpo_html, "html")
    msg["Subject"] = asunto
    msg["From"] = EMAIL_FROM
    msg["To"] = destinatario
    try:
        with smtplib.SMTP(SMTP_HOST, int(SMTP_PORT), timeout=5) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
    except smtplib.SMTPException:
        try:
            with smtplib.SMTP_SSL(SMTP_HOST, int(SMTP_PORT), timeout=5) as server:
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
        except Exception:
            pass


def _email_verificacion(destinatario: str, token: str):
    enlace = f"{BASE_URL}/auth/verificar/{token}"
    _enviar_email(
        destinatario,
        "Verifica tu correo - Salud Natura",
        f"""
        <html><body style="font-family:Arial,sans-serif;padding:20px;">
        <h2>Bienvenido a Salud Natura</h2>
        <p>Gracias por registrarte. Haz clic para activar tu cuenta:</p>
        <p><a href="{enlace}" style="display:inline-block;padding:12px 24px;
        background:#4CAF50;color:#fff;text-decoration:none;border-radius:6px;">
        Verificar mi correo</a></p>
        <p style="color:#888;font-size:12px;">Si no te registraste, ignora este mensaje.</p>
        </body></html>
        """
    )


def _email_recuperacion(destinatario: str, token: str):
    enlace = f"{BASE_URL}/restablecer?token={token}"
    _enviar_email(
        destinatario,
        "Recuperación de contraseña - Salud Natura",
        f"""
        <html><body style="font-family:Arial,sans-serif;padding:20px;">
        <h2>Recupera tu contraseña</h2>
        <p>Recibimos una solicitud de recuperación. Haz clic para continuar:</p>
        <p><a href="{enlace}" style="display:inline-block;padding:12px 24px;
        background:#d4af37;color:#0a1a0d;text-decoration:none;border-radius:6px;">
        Restablecer contraseña</a></p>
        <p>O copia esta URL en tu navegador:</p>
        <p><code>{enlace}</code></p>
        <p style="color:#888;font-size:12px;">Este enlace expira en 1 hora.
        Si no solicitaste el cambio, ignora este mensaje.</p>
        </body></html>
        """
    )


# ===============================================================
# Búsqueda de clientes
# ===============================================================
def _buscar_por_email(email: str) -> Optional[dict]:
    registros = _buscar_registros(email)
    return registros[0][1] if registros else None


def _buscar_registros(email: str):
    resultados = []
    for db_name in (DB_STAGING, DB_FINAL):
        conn = _con_sqlite(db_name)
        conn.row_factory = sqlite3.Row
        row = conn.execute(
            "SELECT * FROM clientes WHERE email = ?", (email,)
        ).fetchone()
        conn.close()
        if row:
            resultados.append((db_name, dict(row)))
            return resultados
    try:
        conn = _con_pg()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT * FROM clientes WHERE email = %s", (email,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row:
            resultados.append(("clientes (PG)", dict(row)))
    except Exception:
        pass
    return resultados


# ===============================================================
# Validación
# ===============================================================
def validar_password(password: str):
    if len(password) < 6:
        raise ValueError("La contraseña debe tener al menos 6 caracteres")


# ===============================================================
# Registro
# ===============================================================
def registrar(
    nombre: str, apellido: str, email: str, password: str,
    whatsapp: Optional[str] = None, provincia_pais: Optional[str] = None,
):
    email = email.strip().lower()
    validar_password(password)
    existente = _buscar_por_email(email)
    if existente:
        return {"ok": False, "error": "El email ya está registrado"}
    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        return {"ok": False, "error": "Email inválido"}
    password_hash, password_salt = _hash_password(password)
    ahora = datetime.now()
    conn = _con_sqlite(DB_STAGING)
    try:
        conn.execute(
            "INSERT INTO clientes (email, nombre, apellido, password_hash, "
            "password_salt, whatsapp, provincia_pais, email_verificado, activo, "
            "fecha_alta) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1, ?)",
            (email, nombre, apellido, password_hash, password_salt,
             whatsapp, provincia_pais, ahora),
        )
        conn.commit()
    except Exception as e:
        return {"ok": False, "error": str(e)}
    finally:
        conn.close()
    token_jwt = _crear_token({"sub": email, "tipo": "verificacion"}, minutos=1440)
    _email_verificacion(email, token_jwt)
    return {"ok": True, "email": email}


# ===============================================================
# Login
# ===============================================================
def iniciar_sesion(email: str, password: str):
    email = email.strip().lower()
    registros = _buscar_registros(email)
    if not registros:
        return {"ok": False, "error": "Email o contraseña incorrectos"}
    db_name, row = registros[0]
    if not verify_password(password, row["password_hash"], row["password_salt"]):
        return {"ok": False, "error": "Email o contraseña incorrectos"}
    if not row.get("activo", 1):
        return {"ok": False, "error": "Cuenta desactivada"}
    return {
        "ok": True, "email": row["email"], "nombre": row["nombre"],
        "apellido": row["apellido"], "whatsapp": row.get("whatsapp"),
        "provincia_pais": row.get("provincia_pais"),
        "email_verificado": bool(row.get("email_verificado", 0)),
        "db_origen": db_name,
    }


# ===============================================================
# Recuperación de contraseña
# ===============================================================
def solicitar_recuperacion(email: str):
    email = email.strip().lower()
    if not _buscar_por_email(email):
        return {"ok": False, "error": "Email no encontrado"}
    token = secrets.token_urlsafe(32)
    expira = datetime.now() + timedelta(hours=1)
    conn = _con_sqlite(DB_STAGING)
    conn.execute(
        "CREATE TABLE IF NOT EXISTS reset_tokens ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT, "
        "email TEXT NOT NULL, token TEXT UNIQUE NOT NULL, "
        "expira TIMESTAMP NOT NULL, usado INTEGER DEFAULT 0)"
    )
    conn.execute(
        "INSERT INTO reset_tokens (email, token, expira) VALUES (?, ?, ?)",
        (email, token, expira),
    )
    conn.commit()
    conn.close()
    _email_recuperacion(email, token)
    return {"ok": True, "mensaje": "Correo de recuperación enviado"}


def restablecer_password(token: str, nueva_password: str):
    validar_password(nueva_password)
    conn = _con_sqlite(DB_STAGING)
    conn.row_factory = sqlite3.Row
    row = conn.execute(
        "SELECT * FROM reset_tokens WHERE token = ? AND usado = 0 AND expira > ?",
        (token, datetime.now()),
    ).fetchone()
    if not row:
        conn.close()
        return {"ok": False, "error": "Token inválido o expirado"}
    email = row["email"]
    password_hash, password_salt = _hash_password(nueva_password)
    registros = _buscar_registros(email)
    if not registros:
        conn.close()
        return {"ok": False, "error": "Email no encontrado"}
    db_name, _ = registros[0]
    if db_name == "clientes (PG)":
        db_conn = _con_pg()
        db_conn.execute(
            "UPDATE clientes SET password_hash = %s, password_salt = %s WHERE email = %s",
            (password_hash, password_salt, email),
        )
    else:
        db_conn = _con_sqlite(db_name)
        db_conn.execute(
            "UPDATE clientes SET password_hash = ?, password_salt = ? WHERE email = ?",
            (password_hash, password_salt, email),
        )
    db_conn.commit()
    db_conn.close()
    conn.execute("UPDATE reset_tokens SET usado = 1 WHERE token = ?", (token,))
    conn.commit()
    conn.close()
    return {"ok": True, "mensaje": "Contraseña actualizada correctamente"}


# ===============================================================
# Migración entre bases de datos
# ===============================================================
def migrar_clientes():
    ahora = datetime.now()
    treinta_dias = ahora - timedelta(days=30)
    sesenta_dias = ahora - timedelta(days=60)
    _CLAVE_COLS = (
        "email, nombre, apellido, password_hash, password_salt, "
        "whatsapp, provincia_pais, email_verificado, activo, fecha_alta"
    )
    _SQLITE = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?"
    _PG = "%s, %s, %s, %s, %s, %s, %s, %s, %s, %s"
    conn_s = _con_sqlite(DB_STAGING)
    conn_s.row_factory = sqlite3.Row
    for row in conn_s.execute(
        "SELECT * FROM clientes WHERE fecha_alta < ?", (treinta_dias,)
    ).fetchall():
        d = dict(row)
        conn_f = _con_sqlite(DB_FINAL)
        try:
            conn_f.execute(
                f"INSERT OR IGNORE INTO clientes ({_CLAVE_COLS}) VALUES ({_SQLITE})",
                (d["email"], d["nombre"], d["apellido"], d["password_hash"],
                 d["password_salt"], d["whatsapp"], d["provincia_pais"],
                 d["email_verificado"], d["activo"], d["fecha_alta"]),
            )
            conn_f.commit()
        finally:
            conn_f.close()
        conn_s.execute("DELETE FROM clientes WHERE email = ?", (d["email"],))
    conn_s.commit()
    conn_s.close()
    try:
        conn_f = _con_sqlite(DB_FINAL)
        conn_f.row_factory = sqlite3.Row
        for row in conn_f.execute(
            "SELECT * FROM clientes WHERE fecha_alta < ?", (sesenta_dias,)
        ).fetchall():
            d = dict(row)
            pg = _con_pg()
            try:
                pg.execute(
                    f"INSERT INTO clientes ({_CLAVE_COLS}) VALUES ({_PG}) "
                    f"ON CONFLICT (email) DO NOTHING",
                    (d["email"], d["nombre"], d["apellido"], d["password_hash"],
                     d["password_salt"], d["whatsapp"], d["provincia_pais"],
                     d["email_verificado"], d["activo"], d["fecha_alta"]),
                )
                pg.commit()
            finally:
                pg.close()
            conn_f.execute("DELETE FROM clientes WHERE email = ?", (d["email"],))
        conn_f.commit()
        conn_f.close()
    except Exception:
        pass


# ===============================================================
# FastAPI App
# ===============================================================
DIR = os.path.dirname(os.path.abspath(__file__))


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_bases()
    yield


app = FastAPI(title="Salud Natura - Registro", lifespan=lifespan)
app.mount(
    "/static",
    StaticFiles(directory=os.path.join(DIR, "app", "static")),
    name="static"
)
templates = Jinja2Templates(directory=os.path.join(DIR, "app", "templates"))
auth_router = APIRouter(prefix="/auth", tags=["auth"])


class RegistroBody(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    password: str
    whatsapp: Optional[str] = None
    ubicacion: Optional[str] = None


class LoginBody(BaseModel):
    email: EmailStr
    password: str


class RecuperarBody(BaseModel):
    email: EmailStr


class RestablecerBody(BaseModel):
    token: str
    password: str


@auth_router.post("/registro", status_code=201)
async def registro_endpoint(body: RegistroBody):
     print(f"Registro recibido: nombre={body.nombre}, apellido={body.apellido}, email={body.email}")
     resultado = registrar(
        nombre=body.nombre.strip(), apellido=body.apellido.strip(),
        email=body.email, password=body.password,
        whatsapp=body.whatsapp, provincia_pais=body.ubicacion,
        )
     if not resultado["ok"]:
            raise HTTPException(status_code=409, detail=resultado["error"])
     return resultado


@auth_router.post("/login")
async def login_endpoint(body: LoginBody):
    resultado = iniciar_sesion(body.email, body.password)
    if not resultado["ok"]:
        raise HTTPException(status_code=401, detail=resultado["error"])
    token = _crear_token({"sub": resultado["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": resultado,
    }


@auth_router.post("/recuperar")
async def recuperar_endpoint(body: RecuperarBody):
    resultado = solicitar_recuperacion(body.email)
    if not resultado["ok"]:
        raise HTTPException(status_code=404, detail=resultado["error"])
    return {"mensaje": resultado["mensaje"]}


@auth_router.post("/restablecer")
async def restablecer_endpoint(body: RestablecerBody):
    resultado = restablecer_password(body.token, body.password)
    if not resultado["ok"]:
        raise HTTPException(status_code=400, detail=resultado["error"])
    return {"mensaje": resultado["mensaje"]}


@auth_router.get("/verificar/{token}")
async def verificar_email(token: str):
    payload = _verificar_token(token)
    if not payload or payload.get("tipo") != "verificacion":
        raise HTTPException(status_code=400, detail="Token inválido o expirado")
    email = payload.get("sub")
    conn = _con_sqlite(DB_STAGING)
    conn.execute("UPDATE clientes SET email_verificado = 1 WHERE email = ?", (email,))
    conn.commit()
    conn.close()
    return RedirectResponse(url="/login?verificado=1")


@auth_router.get("/perfil")
async def perfil(request: Request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token requerido")
    payload = _verificar_token(auth[7:])
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    datos = _buscar_por_email(payload.get("sub"))
    if not datos:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return datos


@app.get("/login")
async def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.get("/registro")
async def registro_page(request: Request):
    return templates.TemplateResponse("registro.html", {"request": request})


@app.get("/restablecer")
async def restablecer_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/health")
async def health():
    return {"status": "ok"}


app.include_router(auth_router)

# ===============================================================
# Ejecución directa
# ===============================================================
if __name__ == "__main__":
    import uvicorn

    init_bases()
    print("=" * 50)
    print("registrohtml.py — Servidor de Registro y Login")
    print("Bases: staging.db | final.db | clientes (PostgreSQL)")
    print("=" * 50)
    port = int(os.getenv("APP_PORT", "8010"))
    uvicorn.run(app, host="0.0.0.0", port=port)