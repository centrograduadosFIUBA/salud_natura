import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "salud_natura.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS base_conocimiento_salud (
            id_remedio INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre_remedio TEXT NOT NULL,
            planta_base TEXT,
            propiedades TEXT,
            contraindicaciones TEXT,
            dosificacion TEXT,
            link_articulo_web TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios_y_clientes (
            id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre_completo TEXT NOT NULL,
            celular TEXT,
            email TEXT,
            direccion_completa TEXT,
            ciudad_prov_pais TEXT,
            latitud REAL,
            longitud REAL
        )
    """)

    conn.commit()
    conn.close()
