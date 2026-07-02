import smtplib
from email.mime.text import MIMEText
from auth.config import auth_settings


SKIP_PASSWORDS = {"", "1234", "tu-contrasena-de-aplicacion"}


def enviar_email_verificacion(destinatario: str, token: str) -> None:
    if auth_settings.gmail_password in SKIP_PASSWORDS:
        return

    enlace = f"{auth_settings.base_url}/auth/verificar/{token}"
    msg = MIMEText(_cuerpo_html(enlace), "html")
    msg["Subject"] = "Verifica tu correo - Salud Natura"
    msg["From"] = auth_settings.gmail_user
    msg["To"] = destinatario

    try:
        with smtplib.SMTP(auth_settings.smtp_host, auth_settings.smtp_port, timeout=5) as server:
            server.starttls()
            server.login(auth_settings.gmail_user, auth_settings.gmail_password)
            server.send_message(msg)
    except Exception:
        pass


def _cuerpo_html(enlace: str) -> str:
    return f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Bienvenido a Salud Natura</h2>
        <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
        <p><a href="{enlace}" style="display: inline-block; padding: 12px 24px; background: #4CAF50; color: #fff; text-decoration: none; border-radius: 6px;">Verificar mi correo</a></p>
        <p>O copia y pega esta URL en tu navegador:</p>
        <p><code>{enlace}</code></p>
        <p style="color: #888; font-size: 12px;">Si no te registraste en Salud Natura, ignora este mensaje.</p>
    </body>
    </html>
    """
