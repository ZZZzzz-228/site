# backend/app.py
import os
from flask import Flask, jsonify, send_from_directory
from flask_caching import Cache
from flask_compress import Compress
from parser import get_connection

# папка public
BASE_DIR   = os.path.dirname(__file__)
PUBLIC_DIR = os.path.abspath(os.path.join(BASE_DIR, os.pardir, 'public'))

app = Flask(
    __name__,
    static_folder=PUBLIC_DIR,
    static_url_path='/'
)
Compress(app)

# кеш 60 секунд
cache = Cache(app, config={
    'CACHE_TYPE': 'SimpleCache',
    'CACHE_DEFAULT_TIMEOUT': 60
})

def fetch_latest_outages(limit=10):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT `id`,`type`,`date`,`title`,`link`,`start_date`,`end_date`,`address`,`district`
          FROM outages
         ORDER BY id DESC
         LIMIT %s
    """, (limit,))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

@app.route('/api/news')
@app.route('/api/events')
@cache.cached()  # кэшируем на 60 сек
def api_news():
    data = fetch_latest_outages(limit=10)
    return jsonify(data)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_front(path):
    fullpath = os.path.join(PUBLIC_DIR, path)
    if path and os.path.exists(fullpath):
        return send_from_directory(PUBLIC_DIR, path)
    return send_from_directory(PUBLIC_DIR, 'index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
