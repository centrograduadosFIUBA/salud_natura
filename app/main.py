from fastapi import FastAPI, Form, Request, HTTPException, status
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from contextlib import asynccontextmanager
from typing import Optional

from app.config import settings
from app.database import init_db, get_db
from app.models import RemedioIn, UsuarioIn
from app.auth import hashear_contraseña, verificar_contraseña, crear_access_token


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")


@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "settings": settings,
    })


@app.get("/grimorio")
async def grimorio(request: Request):
    return templates.TemplateResponse("grimorio.html", {
        "request": request,
    })


@app.get("/botiquin")
async def botiquin(request: Request):
    return templates.TemplateResponse("botiquin.html", {"request": request})


@app.get("/taller")
async def taller(request: Request):
    return templates.TemplateResponse("taller.html", {
        "request": request,
        "settings": settings,
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


@app.get("/api/botiquin")
async def listar_botiquin():
    conn = get_db()
    # Calcular índice del grimorio (posición 0-based en lista ordenada por id_remedio)
    idx_map = {r[0]: i for i, r in enumerate(
        conn.execute("SELECT id_remedio FROM base_conocimiento_salud ORDER BY id_remedio").fetchall()
    )}
    rows = []
    for r in conn.execute("SELECT * FROM botiquin ORDER BY id").fetchall():
        item = dict(r)
        item["grimorio_idx"] = idx_map.get(item.get("id_remedio"), None)
        rows.append(item)
    conn.close()
    return {"ok": True, "data": rows}


@app.get("/api/plantas")
async def listar_plantas():
    conn = get_db()
    rows = [dict(r) for r in conn.execute("SELECT * FROM base_conocimiento_salud ORDER BY id_remedio").fetchall()]
    conn.close()
    for r in rows:
        img_url = r.get("imagen_url") or ""
        r["imagen"] = img_url.split("/")[-1] if img_url else ""
    return {"ok": True, "plantas": rows}


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


# ── Admin ──

@app.get("/admin")
async def admin_inicio(request: Request):
    conn = get_db()
    total_remedios = conn.execute("SELECT COUNT(*) FROM base_conocimiento_salud").fetchone()[0]
    total_usuarios = conn.execute("SELECT COUNT(*) FROM usuarios_y_clientes").fetchone()[0]
    conn.close()
    return templates.TemplateResponse("admin_inicio.html", {
        "request": request, "settings": settings, "seccion": "inicio",
        "total_remedios": total_remedios, "total_usuarios": total_usuarios,
    })


@app.get("/admin/remedios")
async def admin_remedios(request: Request, mensaje: Optional[str] = None):
    conn = get_db()
    remedios = conn.execute("SELECT * FROM base_conocimiento_salud ORDER BY id_remedio DESC").fetchall()
    conn.close()
    return templates.TemplateResponse("admin_remedios.html", {
        "request": request, "settings": settings, "seccion": "remedios",
        "remedios": remedios, "mensaje": mensaje,
    })


@app.post("/admin/remedios/guardar")
async def admin_remedios_guardar(
    nombre_remedio: str = Form(...),
    planta_base: str = Form(""),
    propiedades: str = Form(""),
    contraindicaciones: str = Form(""),
    dosificacion: str = Form(""),
    link_articulo_web: str = Form(""),
    imagen_url: str = Form(""),
    id_remedio: str = Form(""),
):
    conn = get_db()
    if id_remedio:
        conn.execute(
            "UPDATE base_conocimiento_salud SET nombre_remedio=?, planta_base=?, propiedades=?, contraindicaciones=?, dosificacion=?, link_articulo_web=?, imagen_url=? WHERE id_remedio=?",
            (nombre_remedio, planta_base or None, propiedades or None, contraindicaciones or None, dosificacion or None, link_articulo_web or None, imagen_url or None, int(id_remedio)),
        )
        mensaje = "Remedio actualizado"
    else:
        conn.execute(
            "INSERT INTO base_conocimiento_salud (nombre_remedio, planta_base, propiedades, contraindicaciones, dosificacion, link_articulo_web, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (nombre_remedio, planta_base or None, propiedades or None, contraindicaciones or None, dosificacion or None, link_articulo_web or None, imagen_url or None),
        )
        mensaje = "Remedio creado"
    conn.commit()
    conn.close()
    return RedirectResponse(f"/admin/remedios?mensaje={mensaje}", status_code=303)


@app.post("/admin/remedios/{id_remedio}/eliminar")
async def admin_remedios_eliminar(id_remedio: int):
    conn = get_db()
    conn.execute("DELETE FROM base_conocimiento_salud WHERE id_remedio=?", (id_remedio,))
    conn.commit()
    conn.close()
    return RedirectResponse("/admin/remedios?mensaje=Remedio eliminado", status_code=303)


@app.get("/admin/botiquin")
async def admin_botiquin(request: Request, mensaje: Optional[str] = None):
    conn = get_db()
    items = conn.execute("SELECT * FROM botiquin ORDER BY id").fetchall()
    conn.close()
    return templates.TemplateResponse("admin_botiquin.html", {
        "request": request, "settings": settings, "items": items, "mensaje": mensaje,
    })


@app.post("/admin/botiquin/guardar")
async def admin_botiquin_guardar(
    dolencia: str = Form(...),
    emoji: str = Form(""),
    categoria: str = Form(""),
    planta: str = Form(""),
    nombre_cientifico: str = Form(""),
    preparacion: str = Form(""),
    nota: str = Form(""),
    id: str = Form(""),
):
    conn = get_db()
    if id:
        conn.execute(
            "UPDATE botiquin SET dolencia=?, emoji=?, categoria=?, planta=?, nombre_cientifico=?, preparacion=?, nota=? WHERE id=?",
            (dolencia, emoji, categoria, planta, nombre_cientifico, preparacion, nota, int(id)),
        )
        mensaje = "Dolencia actualizada"
    else:
        conn.execute(
            "INSERT INTO botiquin (dolencia, emoji, categoria, planta, nombre_cientifico, preparacion, nota) VALUES (?,?,?,?,?,?,?)",
            (dolencia, emoji, categoria, planta, nombre_cientifico, preparacion, nota),
        )
        mensaje = "Dolencia creada"
    conn.commit()
    conn.close()
    return RedirectResponse(f"/admin/botiquin?mensaje={mensaje}", status_code=303)


@app.post("/admin/botiquin/{id}/eliminar")
async def admin_botiquin_eliminar(id: int):
    conn = get_db()
    conn.execute("DELETE FROM botiquin WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return RedirectResponse("/admin/botiquin?mensaje=Dolencia eliminada", status_code=303)


@app.get("/admin/usuarios")
async def admin_usuarios(request: Request, mensaje: Optional[str] = None):
    conn = get_db()
    usuarios = conn.execute("SELECT * FROM usuarios_y_clientes ORDER BY id_usuario DESC").fetchall()
    conn.close()
    return templates.TemplateResponse("admin_usuarios.html", {
        "request": request, "settings": settings, "seccion": "usuarios",
        "usuarios": usuarios, "mensaje": mensaje,
    })


@app.post("/admin/usuarios/guardar")
async def admin_usuarios_guardar(
    nombre_completo: str = Form(...),
    celular: str = Form(""),
    email: str = Form(""),
    direccion_completa: str = Form(""),
    ciudad_prov_pais: str = Form(""),
    latitud: str = Form(""),
    longitud: str = Form(""),
    id_usuario: str = Form(""),
):
    lat = float(latitud) if latitud else None
    lon = float(longitud) if longitud else None
    conn = get_db()
    if id_usuario:
        conn.execute(
            "UPDATE usuarios_y_clientes SET nombre_completo=?, celular=?, email=?, direccion_completa=?, ciudad_prov_pais=?, latitud=?, longitud=? WHERE id_usuario=?",
            (nombre_completo, celular or None, email or None, direccion_completa or None, ciudad_prov_pais or None, lat, lon, int(id_usuario)),
        )
        mensaje = "Usuario actualizado"
    else:
        conn.execute(
            "INSERT INTO usuarios_y_clientes (nombre_completo, celular, email, direccion_completa, ciudad_prov_pais, latitud, longitud) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (nombre_completo, celular or None, email or None, direccion_completa or None, ciudad_prov_pais or None, lat, lon),
        )
        mensaje = "Usuario creado"
    conn.commit()
    conn.close()
    return RedirectResponse(f"/admin/usuarios?mensaje={mensaje}", status_code=303)


@app.post("/admin/usuarios/{id_usuario}/eliminar")
async def admin_usuarios_eliminar(id_usuario: int):
    conn = get_db()
    conn.execute("DELETE FROM usuarios_y_clientes WHERE id_usuario=?", (id_usuario,))
    conn.commit()
    conn.close()
    return RedirectResponse("/admin/usuarios?mensaje=Usuario eliminado", status_code=303)


# ── Autenticación ──

@app.post("/api/registro")
async def registro(request: Request):
    try:
        data = await request.json()
        nombre_completo = data.get("nombre_completo", "").strip()
        celular = data.get("celular", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()
        direccion_completa = data.get("direccion_completa", "").strip()
        ciudad_prov_pais = data.get("ciudad_prov_pais", "").strip()
        pais_codigo = data.get("pais_codigo", "").strip()

        if not nombre_completo or not email or not password:
            raise HTTPException(status_code=400, detail="Faltan campos requeridos")

        conn = get_db()

        # Verificar si el email ya existe en usuarios_auth
        existe_auth = conn.execute("SELECT id_usuario_auth FROM usuarios_auth WHERE email=?", (email,)).fetchone()
        if existe_auth:
            conn.close()
            return JSONResponse(
                status_code=409,
                content={"ok": False, "detail": "El email ya está registrado"}
            )

        # Hashear la contraseña
        contraseña_hash = hashear_contraseña(password)

        # Insertar en tabla de autenticación
        conn.execute(
            "INSERT INTO usuarios_auth (nombre_usuario, email, contraseña_hash) VALUES (?, ?, ?)",
            (nombre_completo, email, contraseña_hash)
        )

        # También insertar en tabla de usuarios_y_clientes para compatibilidad
        cursor_usuarios = conn.execute(
            "INSERT INTO usuarios_y_clientes (nombre_completo, celular, email, direccion_completa, ciudad_prov_pais) VALUES (?, ?, ?, ?, ?)",
            (nombre_completo, celular or None, email, direccion_completa or None, ciudad_prov_pais or None)
        )
        conn.commit()

        usuario_id = cursor_usuarios.lastrowid
        conn.close()

        return {
            "ok": True,
            "id_usuario": usuario_id,
            "usuario": {
                "id_usuario": usuario_id,
                "nombre_completo": nombre_completo,
                "email": email,
                "celular": celular,
                "ciudad_prov_pais": ciudad_prov_pais,
                "pais_codigo": pais_codigo,
            }
        }
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"ok": False, "detail": str(e)}
        )


@app.post("/api/login")
async def login(request: Request):
    try:
        data = await request.json()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()

        if not email or not password:
            raise HTTPException(status_code=400, detail="Email y contraseña requeridos")

        conn = get_db()

        # Buscar usuario por email en tabla de autenticación
        db_usuario = conn.execute("SELECT * FROM usuarios_auth WHERE email=?", (email,)).fetchone()

        if not db_usuario:
            conn.close()
            return JSONResponse(
                status_code=401,
                content={"ok": False, "detail": "Credenciales inválidas"}
            )

        # Verificar contraseña
        if not verificar_contraseña(password, db_usuario["contraseña_hash"]):
            conn.close()
            return JSONResponse(
                status_code=401,
                content={"ok": False, "detail": "Credenciales inválidas"}
            )

        # Obtener datos completos del usuario desde tabla usuarios_y_clientes
        usuario_completo = conn.execute(
            "SELECT * FROM usuarios_y_clientes WHERE email=?", (email,)
        ).fetchone()
        conn.close()

        # Crear token
        access_token = crear_access_token(data={"sub": email, "id": db_usuario["id_usuario_auth"]})

        usuario_data = {
            "id_usuario": usuario_completo["id_usuario"] if usuario_completo else db_usuario["id_usuario_auth"],
            "nombre_completo": usuario_completo["nombre_completo"] if usuario_completo else db_usuario["nombre_usuario"],
            "email": email,
            "celular": usuario_completo["celular"] if usuario_completo else None,
            "ciudad_prov_pais": usuario_completo["ciudad_prov_pais"] if usuario_completo else None,
            "pais_codigo": None,
        }

        return {
            "ok": True,
            "access_token": access_token,
            "token_type": "bearer",
            "usuario": usuario_data
        }
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"ok": False, "detail": str(e)}
        )
