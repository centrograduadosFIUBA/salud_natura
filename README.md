# Salud Natura 🌿

**Sabiduría Ancestral de la Tierra**

Plataforma web para gestionar un grimorio de plantas medicinales, botiquín natural y base de datos de usuarios. Construida con FastAPI y SQLite.

---

## 📋 Requisitos

### Opción 1: Ejecución Local
- **Python 3.11+** (descargar desde [python.org](https://www.python.org/))
- pip (incluido con Python)

### Opción 2: Ejecución con Docker
- **Docker** (descargar desde [docker.com](https://www.docker.com/products/docker-desktop))
- **Docker Compose** (incluido en Docker Desktop)

---

## 🚀 Instalación y Ejecución Local

### 1. Clonar o descargar el repositorio

```bash
cd ruta/al/proyecto
```

### 2. Crear un entorno virtual de Python

```bash
python -m venv venv
```

### 3. Activar el entorno virtual

**En PowerShell (Windows):**
```powershell
.\venv\Scripts\Activate.ps1
```

**En CMD (Windows):**
```cmd
venv\Scripts\activate.bat
```

**En macOS/Linux:**
```bash
source venv/bin/activate
```

### 4. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 5. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto (o copiar desde `.env.example`):

```env
APP_NAME=Salud Natura
APP_TAGLINE=Sabiduría Ancestral de la Tierra
CONTACT_EMAIL=tu_email@ejemplo.com
DATABASE_URL=sqlite:///data/salud_natura.db
ENVIRONMENT=development
APP_PORT=8000
```

### 6. Ejecutar la aplicación

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ La aplicación estará disponible en: **http://localhost:8000**

El flag `--reload` reinicia automáticamente la aplicación cuando detecta cambios en el código.

---

## 🐳 Instalación y Ejecución con Docker

### 1. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto (ver ejemplo arriba).

### 2. Construir y ejecutar los contenedores

```bash
docker-compose up
```

Para ejecutar en segundo plano:
```bash
docker-compose up -d
```

✅ La aplicación estará disponible en: **http://localhost:8010** (puerto configurable en `.env`)

### 3. Comandos útiles

**Ver los logs:**
```bash
docker-compose logs -f
```

**Detener los contenedores:**
```bash
docker-compose down
```

**Reconstruir los contenedores:**
```bash
docker-compose build --no-cache
```

**Acceder a la shell del contenedor:**
```bash
docker-compose exec web bash
```

---

## 📁 Estructura del Proyecto

```
salud_natura/
├── app/
│   ├── __init__.py
│   ├── main.py              # Aplicación FastAPI principal
│   ├── config.py            # Configuración y variables de entorno
│   ├── database.py          # Inicialización y conexión a BD
│   ├── models.py            # Modelos Pydantic
│   ├── static/              # Archivos CSS, JS, imágenes
│   └── templates/           # Plantillas HTML Jinja2
├── data/                    # Base de datos SQLite (creada al iniciar)
├── Dockerfile               # Configuración Docker
├── docker-compose.yml       # Orquestación de servicios
├── requirements.txt         # Dependencias Python
├── .env.example             # Plantilla de variables de entorno
└── README.md                # Este archivo
```

---

## 🔌 Endpoints Principales

### Público
- `GET /` - Página principal
- `GET /grimorio` - Grimorio de plantas medicinales
- `GET /botiquin` - Botiquín natural
- `GET /taller` - Taller/recursos
- `GET /health` - Estado de la aplicación

### API - Remedios
- `GET /api/remedios` - Listar todos los remedios
- `GET /api/remedios/{id}` - Obtener remedio específico
- `POST /api/remedios` - Crear nuevo remedio
- `GET /api/plantas` - Listar plantas medicinales

### API - Botiquín
- `GET /api/botiquin` - Listar items del botiquín

### API - Usuarios
- `POST /api/usuarios` - Registrar usuario

### Administración
- `GET /admin` - Panel de administración
- `GET /admin/remedios` - Gestionar remedios
- `GET /admin/botiquin` - Gestionar botiquín
- `GET /admin/usuarios` - Gestionar usuarios

---

## 🔧 Tecnologías

- **FastAPI** - Framework web moderno para Python
- **Uvicorn** - Servidor ASGI de alto rendimiento
- **SQLite** - Base de datos ligera
- **Jinja2** - Motor de plantillas HTML
- **Pydantic** - Validación de datos
- **Docker** - Containerización

---

## 📧 Contacto

Para consultas: **josepsaludnatura@gmail.com**

---

## 📝 Notas

- La base de datos SQLite se crea automáticamente en la carpeta `data/` al iniciar la aplicación
- Con Docker, los datos persisten en un volumen (`salud_natura_data`)
- En desarrollo local, los datos se guardan en `data/salud_natura.db`
- El panel de administración está disponible en `/admin`

---

**Última actualización:** Junio 2026
