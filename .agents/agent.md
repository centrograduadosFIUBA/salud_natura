# 🌿 SALUD NATURA — Instrucciones Maestras del Agente (agent.md)

Este archivo es la **memoria principal y guía maestra** para el asistente de IA trabajando en el proyecto **Salud Natura**. Refleja la arquitectura actual, decisiones tomadas y reglas operativas.

---

## 📦 El arnés `.agents` — Política de versionado y secretos

La carpeta **`.agents/`** (este `agent.md`, `rules/` y `skills/`) es el **arnés de trabajo compartido** del proyecto.

- **`.agents/` SÍ se versiona** en el repositorio (privado). **NO** agregarla a `.gitignore`.
- **Qué PUEDE ir versionado:** instrucciones, reglas, skills, specs, y datos de infraestructura como referencia.
- **Qué NUNCA va versionado (secretos):** contraseñas, tokens, claves de API, App Passwords. Viven **solo** en `.env` (gitignored).
- **Regla práctica:** si un valor permite *autenticarse o tomar control* → es secreto → fuera del repo. Si solo *describe dónde está algo* → es referencia → puede versionarse.

---

## 1. 🌐 Contexto Global del Proyecto

- **Propósito:** Plataforma digital de salud natural. Catálogo interactivo de hierbas medicinales, remedios y conocimiento ancestral denominado "El Grimorio".
- **Titular:** José de la Fuente Martínez.
- **Contacto:** josepsaludnatura@gmail.com / delafuentemartinezjose@gmail.com
- **Tutor:** Ariel Alegre (comunidadfiuba@gmail.com).
- **Estado:** Fase MVP — base de datos inicial + sitio web.
- **Stack Tecnológico:**
  - **Backend:** Python 3, FastAPI, Jinja2 (SSR).
  - **Base de datos:** SQLite (MVP).
  - **Frontend:** HTML/CSS/JS vanilla.
  - **Despliegue:** GitHub + hosting web (por definir).

---

## 2. 🏗️ Arquitectura del Proyecto (MVP)

```
salud_natura/
├── .agents/                 ← Arnés de trabajo del agente IA
│   ├── agent.md
│   ├── rules/
│   └── skills/
├── app/
│   ├── main.py              ← FastAPI app: rutas y endpoints
│   ├── config.py            ← Settings leídos del entorno/.env
│   ├── database.py          ← Conexión y setup de SQLite
│   ├── models.py            ← Modelos Pydantic
│   ├── templates/
│   │   └── index.html       ← Página principal (Jinja2)
│   └── static/
│       ├── css/styles.css
│       └── js/app.js
├── data/
│   └── salud_natura.db      ← Base de datos SQLite
├── .env                     ← Variables de entorno (NO se versiona)
├── .env.example             ← Plantilla pública de variables
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 3. 🗄️ Modelo de Datos (MVP)

### Fase 1 — Tablas iniciales

**BASE_CONOCIMIENTO_SALUD** (El Grimorio)
| Columna | Tipo | Descripción |
|---|---|---|
| ID_Remedio | INTEGER PK | Identificador único autoincremental |
| Nombre_Remedio | TEXT | Ej: "Infusión relajante" |
| Planta_Base | TEXT | Nombre de la hierba |
| Propiedades | TEXT | Beneficios técnicos |
| Contraindicaciones | TEXT | Advertencias obligatorias |
| Dosificacion | TEXT | Cantidad sugerida |
| Link_Articulo_Web | TEXT | Link interno a la página web |

**USUARIOS_Y_CLIENTES**
| Columna | Tipo | Descripción |
|---|---|---|
| ID_Usuario | INTEGER PK | Identificador único autoincremental |
| Nombre_Completo | TEXT | Nombre y apellido |
| Celular | TEXT | Incluir código de país (+54...) |
| Email | TEXT | Email para campañas |
| Direccion_Completa | TEXT | Calle, altura, piso/depto |
| Ciudad_Prov_Pais | TEXT | Datos para geolocalización |
| Latitud | REAL | Para cálculo de proximidad |
| Longitud | REAL | Para cálculo de proximidad |

### Fase 2 — Tablas futuras
- **CATALOGO_PRODUCTOS_EXTERNAL** — Productos de afiliados (Amazon/Mercado Libre).
- **RED_FRANQUICIAS** — Herbolarios con radio de cobertura.
- **CONTROL_COMISIONES** — Transacciones y trazabilidad financiera.

---

## 4. 🔑 Variables de Entorno (.env)

| Variable | Default | Descripción |
|---|---|---|
| `APP_NAME` | Salud Natura | Nombre mostrado en el sitio |
| `APP_TAGLINE` | Sabiduría Ancestral de la Tierra | Subtítulo principal |
| `CONTACT_EMAIL` | josepsaludnatura@gmail.com | Email de contacto |
| `DATABASE_URL` | sqlite:///data/salud_natura.db | Ruta de la base de datos |
| `ENVIRONMENT` | development | Entorno de ejecución |

---

## 5. 🔄 Flujos Clave (MVP)

### Endpoints
- `GET /` → Renderiza la página principal con el catálogo de remedios.
- `GET /health` → Healthcheck (`{"status": "ok"}`).
- `GET /api/remedios` → Lista los remedios de la base de conocimiento.
- `GET /api/remedios/{id}` → Detalle de un remedio.
- `POST /api/usuarios` → Registro de usuario/lead.

---

## 6. 🧠 Reglas de Oro

- **SQLite para MVP:** Liviano y sin dependencias. Migrar a PostgreSQL cuando escale.
- **Credenciales:** NUNCA hardcodear secretos. Todo en `.env`. El `.env` NUNCA se commitea.
- **Sin build step en frontend:** CSS/JS vanilla servido desde `app/static/`.
- **Validación de entrada:** Toda entrada de usuario pasa por modelos Pydantic.
- **Protocolo de Seguridad del contenido:** El catálogo se limita estrictamente a temas de Salud Natura.

---

## 7. 📜 Reglas de Comportamiento del Agente

1. **Idioma:** SIEMPRE responder, documentar y comentar en **ESPAÑOL**.
2. **Estilo de código:** Seguir PEP8. Docstrings estilo Google.
3. **Cambios mínimos:** Preferir ediciones quirúrgicas sobre reescrituras completas.
4. **Commits (Conventional Commits):**
   ```
   feat: agrega catálogo de remedios
   fix: corrige validación de email
   docs: documenta modelo de datos
   chore: actualiza dependencias
   ```

---

## 8. 🚀 Comandos de Desarrollo

```bash
# Crear y activar entorno virtual (Windows)
python -m venv .venv
.venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Levantar servidor con hot-reload
uvicorn app.main:app --reload --port 8000
```

Abrir http://localhost:8000

---

## 9. 🔮 Próximos Pasos

- [ ] Crear estructura del proyecto (app/, data/, templates, static)
- [ ] Implementar base de datos SQLite con tablas MVP
- [ ] Crear endpoints de remedios y usuarios
- [ ] Diseñar página principal con catálogo del Grimorio
- [ ] Subir a GitHub (repositorio privado)
- [ ] Desplegar en hosting web
- [ ] Agregar tablas de Fase 2 (productos, franquicias, comisiones)

---

*Última actualización: Junio 2025 — Salud Natura*
