# main.py
from fastapi import FastAPI  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from app.parsers.kraskom_parser import get_kraskom_outages
from app.parsers.kraskom_news_parser import main as run_kraskom_parser
from app.database import get_connection
import asyncio

app = FastAPI(
    title="Городской API",
    description="API для получения данных о ЖКХ-отключениях",
    version="1.0.0"
)

# Разрешаем запросы от фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def periodic_parser():
    while True:
        try:
            print("Запуск парсера Kraskom...")
            run_kraskom_parser()
            print("Парсер Kraskom успешно завершил работу.")
        except Exception as e:
            print(f"Ошибка при выполнении парсера: {e}")
        await asyncio.sleep(3600)  # каждые 60 минут

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(periodic_parser())

@app.get("/api/outages", tags=["Outages"])
async def fetch_outages():
    return get_kraskom_outages()

@app.get("/api/news", tags=["News"])
def get_news():
    conn = get_connection()
    if conn is None:
        return {"error": "Нет подключения к базе данных"}

    cursor = conn.cursor()
    cursor.execute("SELECT title, date, content FROM news ORDER BY date DESC LIMIT 10")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    return [
        {"title": title, "date": date, "content": content}
        for title, date, content in rows
    ]
