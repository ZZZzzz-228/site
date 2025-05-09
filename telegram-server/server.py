# server.py
from flask import Flask, request, jsonify  # type: ignore
from flask_cors import CORS  # type: ignore
import requests  # type: ignore
import mysql.connector  # type: ignore
from dotenv import load_dotenv  # type: ignore
import os

# Загружаем переменные окружения
load_dotenv()

app = Flask(__name__)
CORS(app)

BOT_TOKEN = os.getenv("API_TOKEN", "8155379356:AAGHXKIIR6PU1v2w5EgAu4p5na99fRfuWuM")

def get_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            database=os.getenv("DB_NAME", "city_db"),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", "Ze2Ma2==03")
        )
        if connection.is_connected():
            return connection
    except Exception as e:
        print(f"Ошибка подключения к базе данных: {e}")
        return None

@app.route("/send_alert", methods=["POST"])
def send_alert():
    data = request.json
    chat_id = data.get("chat_id")
    message = data.get("message")

    if not chat_id or not message:
        return {"error": "chat_id and message are required"}, 400

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {"chat_id": chat_id, "text": message}
    response = requests.post(url, json=payload)
    result = response.json()

    if not result.get("ok"):
        print("❌ Ошибка Telegram API:")
        print(f"Статус код: {response.status_code}")
        print(f"Описание: {result.get('description')}")
        return {"ok": False, "error": result.get("description")}, 400

    print("✅ Уведомление успешно отправлено!")
    return {"ok": True}, 200

@app.route("/api/events", methods=["GET"])
def get_events():
    conn = get_connection()
    if conn is None:
        return {"error": "Нет подключения к базе данных"}, 500

    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT id, type, title, address AS description, date AS time
            FROM outages
            ORDER BY id DESC
            LIMIT 10
        """)
        rows = cursor.fetchall()
        return jsonify(rows)
    except Exception as e:
        print(f"❌ Ошибка при получении событий: {e}")
        return {"error": str(e)}, 500
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    app.run(port=5000)
