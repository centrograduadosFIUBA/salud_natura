import http.server, os, sys, json, sqlite3, re
from urllib.parse import urlparse

REPO = r'C:\Users\leoca\salud_natura'
DB = os.path.join(REPO, 'data', 'salud_natura.db')

def get_remedios():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    rows = conn.execute('SELECT * FROM base_conocimiento_salud ORDER BY id_remedio').fetchall()
    conn.close()
    return [dict(r) for r in rows]

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        p = self.path.split('?')[0]
        if p == '/api/remedios':
            data = get_remedios()
            body = json.dumps({'data': data}, ensure_ascii=False).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        return super().do_GET()

    def translate_path(self, path):
        p = path.split('?')[0]
        if p == '/' or p == '/index.html':
            return os.path.join(REPO, 'app', 'templates', 'index.html')
        if p.startswith('/grimorio'):
            return os.path.join(REPO, 'app', 'templates', 'grimorio.html')
        if p.startswith('/static/'):
            return os.path.join(REPO, 'app', p[1:])
        return super().translate_path(path)

    def log_message(self, fmt, *args): pass

os.chdir(REPO)
server = http.server.HTTPServer(('0.0.0.0', 5002), Handler)
print('Servidor en http://localhost:5002', flush=True)
server.serve_forever()
