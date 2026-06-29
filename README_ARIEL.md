# Salud Natura — Guía de Despliegue en VPS
> Preparado para Ariel · Junio 2026

---

## Resumen del sistema

| Componente | Tecnología |
|---|---|
| Servidor web | Python 3 (stdlib pura, sin pip) |
| Base de datos | SQLite 3 (archivo `.db`) |
| Frontend | HTML + CSS + JS estático |
| Puerto interno | 5002 (configurable con variable de entorno `PORT`) |

**No se necesita instalar ningún paquete de pip.** El servidor usa únicamente módulos de la librería estándar de Python 3.

---

## Estructura de archivos

```
/var/www/saludnatura/          ← carpeta raíz del proyecto
│
├── server.py                  ← servidor Python (NO tocar)
├── salud_natura.db            ← base de datos SQLite (subir la última versión)
│
├── index.html                 ← página principal
├── grimorio.html              ← grimorio de plantas
├── botiquin.html              ← botiquín herbal
├── style.css
├── script.js
├── logo.jpg
│
└── img/                       ← fotos de las plantas
    ├── manzanilla.jpg
    ├── lavanda.jpg
    └── ... (resto de imágenes)
```

---

## Instalación en el VPS

### 1. Crear carpeta y subir archivos

```bash
sudo mkdir -p /var/www/saludnatura
sudo chown $USER:$USER /var/www/saludnatura
```

Subir todos los archivos (por SFTP, scp o git) a `/var/www/saludnatura/`.
Incluir la carpeta `img/` completa y el archivo `salud_natura.db`.

### 2. Verificar Python 3

```bash
python3 --version   # necesita 3.6 o superior
```

Si no está instalado:
```bash
sudo apt update && sudo apt install python3 -y
```

### 3. Prueba rápida

```bash
cd /var/www/saludnatura
python3 server.py
```

Debe mostrar:
```
✦ Salud Natura corriendo en http://localhost:5002
✦ Base de datos: /var/www/saludnatura/salud_natura.db
```

Probar en el navegador del VPS: `http://localhost:5002`

Detener con `Ctrl + C`.

---

## Configurar como servicio (systemd) — arranca automáticamente

Crear el archivo de servicio:

```bash
sudo nano /etc/systemd/system/saludnatura.service
```

Pegar este contenido:

```ini
[Unit]
Description=Salud Natura Web Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/saludnatura
ExecStart=/usr/bin/python3 /var/www/saludnatura/server.py
Restart=always
RestartSec=5
Environment=PORT=5002

[Install]
WantedBy=multi-user.target
```

Activar y arrancar:

```bash
sudo systemctl daemon-reload
sudo systemctl enable saludnatura
sudo systemctl start saludnatura
sudo systemctl status saludnatura    # verificar que está corriendo
```

---

## Configurar Nginx como proxy inverso

Instalar Nginx:

```bash
sudo apt install nginx -y
```

Crear configuración del sitio:

```bash
sudo nano /etc/nginx/sites-available/saludnatura
```

Pegar (reemplazar `saludnaturalezamundo.com` con el dominio real):

```nginx
server {
    listen 80;
    server_name saludnaturalezamundo.com www.saludnaturalezamundo.com;

    location / {
        proxy_pass http://127.0.0.1:5002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10M;
    }
}
```

Activar el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/saludnatura /etc/nginx/sites-enabled/
sudo nginx -t          # verificar que no hay errores de sintaxis
sudo systemctl restart nginx
```

---

## SSL / HTTPS con Let's Encrypt (certificado gratuito)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d saludnaturalezamundo.com -d www.saludnaturalezamundo.com
```

Certbot configura automáticamente el HTTPS y renueva el certificado cada 90 días.

---

## Apuntar el dominio al VPS

En el panel DNS del dominio (`saludnaturalezamundo.com` y `saludnatura.com.ar`), crear registros:

| Tipo | Nombre | Valor |
|---|---|---|
| A | @ | IP del VPS |
| A | www | IP del VPS |

La propagación DNS puede tardar entre 15 min y 24 horas.

---

## Actualizar la base de datos en producción

Cuando Josep tenga una versión nueva de `salud_natura.db`:

1. Detener el servicio momentáneamente:
   ```bash
   sudo systemctl stop saludnatura
   ```
2. Reemplazar el archivo:
   ```bash
   cp salud_natura_nueva.db /var/www/saludnatura/salud_natura.db
   ```
3. Volver a arrancar:
   ```bash
   sudo systemctl start saludnatura
   ```

El tiempo de interrupción es de segundos.

---

## Comandos útiles de mantenimiento

```bash
# Ver logs en tiempo real
sudo journalctl -u saludnatura -f

# Reiniciar el servidor
sudo systemctl restart saludnatura

# Ver estado
sudo systemctl status saludnatura

# Apagar el servidor desde la web (endpoint local)
curl -X POST http://localhost:5002/api/apagar
```

---

## Contacto del proyecto

- **Josep** (propietario): delafuentemartinezjose@gmail.com
- **Dominio principal**: saludnaturalezamundo.com
- **Dominio local AR**: saludnatura.com.ar
