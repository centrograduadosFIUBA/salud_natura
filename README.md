Descripción del proyecto

¿Qué hace?
registrohtml.py es una aplicación web FastAPI auto-contenida que permite a los usuarios:

1. Registrarse con nombre, apellido, email, contraseña, WhatsApp y ubicación
2. Iniciar sesión con JWT (JSON Web Token)
3. Verificar email mediante enlace enviado por correo
4. Recuperar contraseña con token por email (olvido de contraseña)
5. Migrar automáticamente los clientes entre 3 bases de datos escalonadas por antigüedad

Bases de datos escalonadas
BD	Tipo	Cuándo se usa
staging.db	SQLite	Primer mes del registro
final.db	SQLite	Segundo mes del registro
clientes	PostgreSQL	Después del segundo mes

La función migrar_clientes() mueve los registros automáticamente entre las 3 según su fecha_alta.

Archivos necesarios para correr
salud_natura/
├── registrohtml.py           ← APP PRINCIPAL (se ejecuta con python)
├── app/
│   ├── templates/
│   │   ├── index.html         ← Página principal
│   │   ├── login.html         ← Login + recuperación
│   │   ├── registro.html      ← Registro
│   ├── static/
│       ├── css/style.css      ← Estilos
│       ├── img/logo.jpg       ← Logo
│       └── js/script.js       ← Scripts generales
├── .env                       ← Config (SMTP, JWT, BD)
├── requirements.txt           ← Dependencias
└── data/
    └── sn_usuarios.db         ← BD vieja del auth anterior (sobra)

Solo registrohtml.py es el archivo nuevo que se ejecuta. El resto ya existía.

Archivos que modificamos y para qué

Archivo			Cambio			Propósito
registrohtml.py		Creado desde cero	App FastAPI con registro, login, JWT, recuperación contraseña, 3 BD escalonadas, envío de email

app/templates/registro.html	Input nombre_completo → nombre + apellido; link "¿Olvidaste contraseña?"	Formulario con campos separados + acceso a recuperación

app/templates/login.html	3 secciones: login / solicitar token / restablecer contraseña. Soporta ?token=xxx, ?recuperar=1, ?verificado=1	Flujo completo de olvido de contraseña

app/templates/index.html	Script que lee localStorage y cambia navbar a "👤 Nombre · Salir" al estar logueado	Navbar dinámico post-login

app/static/css/style.css	margin-left: 1.5rem en .nav-auth	Separar nombre del usuario del borde izquierdo


Resumen para Pull Request

PR: Registro de clientes con 3 BD escalonadas + Login JWT(JSON Web Token), método de autenticación donde el servidor le entrega al usuario un "pase digital" seguro tras iniciar sesión + Recuperación de contraseña por email

Archivos incluidos (5):
1- registrohtml.py — Nueva app FastAPI auto-contenida con registro, login, JWT, recuperación de contraseña, envío de emails SMTP, y migración automática entre staging.db (SQLite, mes 1) → final.db (SQLite, mes 2) → clientes (PostgreSQL, después del mes 2)

2- app/templates/registro.html — Formulario con nombre/apellido separados + enlace a recuperación

3- app/templates/login.html — Login + secciones de solicitud y restablecimiento de contraseña

4- app/templates/index.html — Navbar dinámico que muestra el nombre del usuario logueado

5- app/static/css/style.css — Ajuste de espaciado en .nav-auth

Lo que NO incluye (pendiente para futuros PR):
- Seguridad inputs cifrados/permisos de empleados (ControlAccesoCampos, Permiso)
- Admin/Tkinter, empleados/tkinter en Background
- Cifrado Fernet
- SegInputs, SegBusqueda, rate limiting


- Si el puerto 8010 está ocupado: taskkill /PID <PID> /F comando ejecutable en terminal powershell del entorno venv

Ejecución: python registrohtml.py → servidor en http://localhost:8010

Si el sistema no envía los correos electrónicos lo más probable es que Gmail rechaza la contraseña de aplicación (535 5.7.8 Username and Password not accepted). No avisa, y si lo hace, la opción es si fuiste vos no hagas nada, pero hay que ir al link y decir que fue uno y entonces el sistema puede arrancar enviando mails.

Posibles causas:
1. La contraseña de aplicación expiró o fue revocada
2. Tiene espacios literales (zhhc qblb strx dfti) que Gmail no interpreta como App Password válida

Plan para resolver:

1. Verificar la contraseña de aplicación
- Andá a https://myaccount.google.com/apppasswords
- Iniciá sesión con tu email
- En la lista, fijate si "Salud Natura" sigue activa
- Si no aparece o expiró, generá una nueva:
- Nombre de la app: Salud Natura
- Te dará 16 letras sin espacios (ej: zhhcqblbstrxdfti)

2. Actualizar .env
Cuando tengas la nueva contraseña (sacarle los espacios), reemplazá en .env la línea:
AUTH_GMAIL_PASSWORD=zhhc qblb strx dfti
por:
AUTH_GMAIL_PASSWORD=zhhcqblbstrxdfti
Alternativa: si preferís, podés probar primero sacándole los espacios a la que ya tenés (puede que funcione).

3. Probar de nuevo
python -c "
import smtplib
server = smtplib.SMTP('smtp.gmail.com', 587, timeout=5)
server.starttls()
server.login('neniahidalgo@gmail.com', 'zhhcqblbstrxdfti')
print('LOGIN EXITOSO')
server.quit()
"
Si ves LOGIN EXITOSO, el mail va a funcionar. 

En la prueba del sistema, si ya ingresó en la base de datos tu email, el sistema no te permitirá registrarte denuevo, para probar.
Antes de correr el sistema, ejecuta el código en la powershell del entorno:
borrar.py
import sqlite3
conn = sqlite3.connect('staging.db')
conn.execute("DELETE FROM clientes WHERE email='neniahidalgo@gmail.com'")
conn.commit()
conn.close()
print('OK')

Después ejecutá python registrohtml.py en la powershell del entorno: 

DeepSeek V4 Flash Free · 16.4s