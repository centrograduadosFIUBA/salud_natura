#!/usr/bin/env python3
import http.server
import os
import json
import sqlite3
import urllib.request
import urllib.parse
import hashlib
from datetime import datetime

def hash_password(pw):
    return hashlib.sha256(pw.strip().encode('utf-8')).hexdigest()

PORT = int(os.environ.get("PORT", 5002))
# Ruta relativa: el archivo salud_natura.db debe estar en la misma carpeta que server.py
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "salud_natura.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA encoding = 'UTF-8'")
    return conn

def geocodificar(direccion, ciudad_prov_pais):
    """Convierte dirección en latitud/longitud usando Nominatim (OpenStreetMap)"""
    intentos = []
    if direccion:
        intentos.append(f"{direccion}, {ciudad_prov_pais}")
    intentos.append(ciudad_prov_pais)  # fallback: solo ciudad

    for q in intentos:
        try:
            query = urllib.parse.quote(q)
            url = f"https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=1"
            req = urllib.request.Request(url, headers={"User-Agent": "SaludNatura/1.0 (salud.natura@gmail.com)"})
            with urllib.request.urlopen(req, timeout=8) as r:
                data = json.loads(r.read())
                if data:
                    return float(data[0]["lat"]), float(data[0]["lon"])
        except:
            continue
    return None, None

def buscar_tiendas(lat, lon, radio_km=1):
    """Busca tiendas naturistas cercanas usando Overpass API (OpenStreetMap)"""
    radio_m = radio_km * 1000
    query = f"""
[out:json][timeout:15];
(
  node["shop"="herbalist"](around:{radio_m},{lat},{lon});
  node["shop"="health_food"](around:{radio_m},{lat},{lon});
  node["shop"="organic"](around:{radio_m},{lat},{lon});
  node["shop"="nutrition_supplements"](around:{radio_m},{lat},{lon});
  node["shop"="dietetics"](around:{radio_m},{lat},{lon});
  node["shop"="natural_health"](around:{radio_m},{lat},{lon});
  node["shop"="food"]["organic"="yes"](around:{radio_m},{lat},{lon});
  node["amenity"="pharmacy"]["organic"="yes"](around:{radio_m},{lat},{lon});
  way["shop"="herbalist"](around:{radio_m},{lat},{lon});
  way["shop"="health_food"](around:{radio_m},{lat},{lon});
  way["shop"="dietetics"](around:{radio_m},{lat},{lon});
);
out center 10;
"""
    try:
        data = urllib.parse.urlencode({"data": query}).encode()
        req = urllib.request.Request(
            "https://overpass-api.de/api/interpreter",
            data=data,
            headers={"User-Agent": "SaludNatura/1.0"}
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            result = json.loads(r.read())
            tiendas = []
            for el in result.get("elements", []):
                tags = el.get("tags", {})
                nombre = tags.get("name", "Tienda naturista")
                calle  = tags.get("addr:street", "")
                numero = tags.get("addr:housenumber", "")
                dir_   = f"{calle} {numero}".strip() or "Sin dirección registrada"
                tel    = tags.get("phone", tags.get("contact:phone", ""))
                web    = tags.get("website", tags.get("contact:website", ""))
                tiendas.append({
                    "nombre": nombre,
                    "direccion": dir_,
                    "telefono": tel,
                    "web": web,
                    "lat": el.get("lat"),
                    "lon": el.get("lon"),
                    "maps": f"https://www.google.com/maps?q={el.get('lat')},{el.get('lon')}"
                })
            return tiendas
    except:
        return []

class SaludNaturaHandler(http.server.SimpleHTTPRequestHandler):

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == "/api/registro":
            self._registro()
        elif self.path == "/api/geocodificar":
            self._geocodificar_usuario()
        elif self.path == "/api/login":
            self._login()
        elif self.path == "/api/apagar":
            self._apagar()
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        if self.path.startswith("/api/tiendas"):
            self._tiendas()
        elif self.path == "/api/plantas":
            self._plantas()
        else:
            super().do_GET()

    def _leer_body(self):
        length = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(length))

    def _json(self, code, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def _registro(self):
        try:
            d = self._leer_body()
            nombre_completo   = d.get("nombre_completo", "").strip()
            celular           = d.get("celular", "").strip()
            email             = d.get("email", "").strip()
            password          = d.get("password", "").strip()
            direccion_completa= d.get("direccion_completa", "").strip()
            ciudad_prov_pais  = d.get("ciudad_prov_pais", "").strip()
            codigo_postal     = d.get("codigo_postal", "").strip()
            pais_codigo       = d.get("pais_codigo", "").strip()

            if not all([nombre_completo, celular, email, password, ciudad_prov_pais]):
                return self._json(400, {"error": "Faltan campos obligatorios"})

            conn = get_db()
            existe = conn.execute(
                "SELECT id_usuario FROM usuarios_y_clientes WHERE email=?", (email,)
            ).fetchone()
            if existe:
                conn.close()
                return self._json(409, {"error": "Email ya registrado"})

            lat, lon = geocodificar(direccion_completa or nombre_completo, ciudad_prov_pais)

            fecha = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            conn.execute("""
                INSERT INTO usuarios_y_clientes
                (nombre_completo, celular, email, password_hash, direccion_completa,
                 ciudad_prov_pais, latitud, longitud, codigo_postal, pais_codigo, fecha_registro)
                VALUES (?,?,?,?,?,?,?,?,?,?,?)
            """, (nombre_completo, celular, email, hash_password(password),
                  direccion_completa, ciudad_prov_pais, lat, lon,
                  codigo_postal, pais_codigo, fecha))
            conn.commit()
            nuevo_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
            conn.close()

            self._json(200, {
                "ok": True,
                "usuario": {
                    "id": nuevo_id,
                    "nombre_completo": nombre_completo,
                    "email": email,
                    "ciudad_prov_pais": ciudad_prov_pais,
                    "pais_codigo": pais_codigo,
                    "lat": lat,
                    "lon": lon
                }
            })
        except Exception as e:
            self._json(500, {"error": str(e)})

    def _login(self):
        try:
            d = self._leer_body()
            email    = d.get("email", "").strip()
            password = d.get("password", "").strip()
            conn = get_db()
            row = conn.execute(
                "SELECT * FROM usuarios_y_clientes WHERE email=?", (email,)
            ).fetchone()
            conn.close()
            if not row:
                return self._json(404, {"error": "Usuario no encontrado"})
            u = dict(row)
            if u.get("password_hash") and u["password_hash"] != hash_password(password):
                return self._json(401, {"error": "Contraseña incorrecta"})
            u["lat"] = u.pop("latitud", None)
            u["lon"] = u.pop("longitud", None)
            u.pop("password_hash", None)  # nunca enviar el hash al cliente
            self._json(200, {"ok": True, "usuario": u})
        except Exception as e:
            self._json(500, {"error": str(e)})

    def _geocodificar_usuario(self):
        """Geocodifica la dirección de un usuario ya registrado y actualiza lat/lon en la DB"""
        try:
            d = self._leer_body()
            email = d.get("email", "").strip()
            direccion = d.get("direccion_completa", "").strip()
            ciudad = d.get("ciudad_prov_pais", "").strip()

            lat, lon = geocodificar(direccion, ciudad)
            if lat is None:
                return self._json(404, {"error": "No se pudo geocodificar la dirección"})

            conn = get_db()
            conn.execute(
                "UPDATE usuarios_y_clientes SET latitud=?, longitud=? WHERE email=?",
                (lat, lon, email)
            )
            conn.commit()
            conn.close()
            self._json(200, {"ok": True, "lat": lat, "lon": lon})
        except Exception as e:
            self._json(500, {"error": str(e)})

    def _apagar(self):
        # Solo acepta peticiones desde localhost
        if self.client_address[0] not in ('127.0.0.1', '::1'):
            return self._json(403, {"error": "No autorizado"})
        self._json(200, {"ok": True})
        import threading
        threading.Timer(1.0, lambda: os._exit(0)).start()

    def _plantas(self):
        try:
            conn = get_db()
            rows = conn.execute("""
                SELECT id_remedio, nombre_remedio, planta_base, propiedades,
                       contraindicaciones, dosificacion, link_articulo_web,
                       nombres_alternativos, partes_utilizadas, fuentes,
                       imagen, imagen_fuente
                FROM base_conocimiento_salud
                ORDER BY id_remedio
            """).fetchall()
            conn.close()
            plantas = [dict(r) for r in rows]
            self._json(200, {"ok": True, "plantas": plantas})
        except Exception as e:
            self._json(500, {"error": str(e)})

    def _tiendas(self):
        try:
            params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            lat = float(params.get("lat", [0])[0])
            lon = float(params.get("lon", [0])[0])
            if not lat or not lon:
                return self._json(400, {"error": "Faltan lat/lon"})
            tiendas = buscar_tiendas(lat, lon)
            self._json(200, {"tiendas": tiendas, "total": len(tiendas)})
        except Exception as e:
            self._json(500, {"error": str(e)})

    def log_message(self, format, *args):
        print(f"[{datetime.now().strftime('%H:%M:%S')}]", format % args)

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f"✦ Salud Natura corriendo en http://localhost:{PORT}")
    print(f"✦ Base de datos: {DB_PATH}")
    with http.server.HTTPServer(("", PORT), SaludNaturaHandler) as httpd:
        httpd.serve_forever()
