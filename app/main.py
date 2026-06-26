from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db, get_db
from app.models import RemedioIn, UsuarioIn


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")


@app.get("/")
async def home(request: Request):
    conn = get_db()
    remedios = conn.execute("SELECT * FROM base_conocimiento_salud").fetchall()
    conn.close()
    return templates.TemplateResponse("index.html", {
        "request": request,
        "settings": settings,
        "remedios": remedios,
    })


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/api/remedios")
async def listar_remedios():
    conn = get_db()
    remedios = [dict(r) for r in conn.execute("SELECT * FROM base_conocimiento_salud").fetchall()]
    conn.close()
    return {"ok": True, "data": remedios}


@app.get("/api/remedios/{id_remedio}")
async def obtener_remedio(id_remedio: int):
    conn = get_db()
    remedio = conn.execute("SELECT * FROM base_conocimiento_salud WHERE id_remedio = ?", (id_remedio,)).fetchone()
    conn.close()
    if not remedio:
        return {"ok": False, "error": "Remedio no encontrado"}
    return {"ok": True, "data": dict(remedio)}


@app.post("/api/remedios")
async def crear_remedio(remedio: RemedioIn):
    conn = get_db()
    cursor = conn.execute(
        "INSERT INTO base_conocimiento_salud (nombre_remedio, planta_base, propiedades, contraindicaciones, dosificacion, link_articulo_web) VALUES (?, ?, ?, ?, ?, ?)",
        (remedio.nombre_remedio, remedio.planta_base, remedio.propiedades, remedio.contraindicaciones, remedio.dosificacion, remedio.link_articulo_web),
    )
    conn.commit()
    id_nuevo = cursor.lastrowid
    conn.close()
    return {"ok": True, "id_remedio": id_nuevo}


@app.post("/api/usuarios")
async def registrar_usuario(usuario: UsuarioIn):
    conn = get_db()
    cursor = conn.execute(
        "INSERT INTO usuarios_y_clientes (nombre_completo, celular, email, direccion_completa, ciudad_prov_pais, latitud, longitud) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (usuario.nombre_completo, usuario.celular, usuario.email, usuario.direccion_completa, usuario.ciudad_prov_pais, usuario.latitud, usuario.longitud),
    )
    conn.commit()
    id_nuevo = cursor.lastrowid
    conn.close()
    return {"ok": True, "id_usuario": id_nuevo}
