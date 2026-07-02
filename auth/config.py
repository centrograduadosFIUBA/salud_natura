from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class AuthSettings(BaseSettings):
    # ── Base ──
    app_name: str = "Salud Natura"
    base_url: str = Field("http://localhost:8000", alias="AUTH_BASE_URL")

    # ── Base de datos ──
    # PostgreSQL: postgresql+asyncpg://user:pass@host:5432/salud_natura_usuarios
    # MySQL:      mysql+aiomysql://user:pass@host:3306/salud_natura_usuarios
    database_url: str = Field("sqlite+aiosqlite:///data/sn_usuarios.db", alias="AUTH_DATABASE_URL")

    # ── JWT ──
    secret_key: str = Field("cambiar-esta-clave-en-produccion", alias="AUTH_SECRET_KEY")
    jwt_algorithm: str = Field("HS256", alias="AUTH_JWT_ALGORITHM")
    jwt_expire_minutes: int = Field(60, alias="AUTH_JWT_EXPIRE_MINUTES")

    # ── Gmail SMTP (rellenar en .env) ──
    smtp_host: str = Field("smtp.gmail.com", alias="AUTH_SMTP_HOST")
    smtp_port: int = Field(587, alias="AUTH_SMTP_PORT")
    gmail_user: str = Field("tu-correo@gmail.com", alias="AUTH_GMAIL_USER")
    gmail_password: str = Field("", alias="AUTH_GMAIL_PASSWORD")

    # ── Admin ──
    admin_email: str = Field("admin@saludnatura.com", alias="AUTH_ADMIN_EMAIL")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore", populate_by_name=False)


auth_settings = AuthSettings()
