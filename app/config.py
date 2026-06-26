from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Salud Natura"
    app_tagline: str = "Sabiduría Ancestral de la Tierra"
    contact_email: str = "josepsaludnatura@gmail.com"
    database_url: str = "sqlite:///data/salud_natura.db"
    environment: str = "development"

    class Config:
        env_file = ".env"


settings = Settings()
