import asyncio
import logging
import os
import mysql.connector  # type: ignore
from aiogram import Bot, Dispatcher, types  # type: ignore
from aiogram.filters import Command  # type: ignore
from dotenv import load_dotenv  # type: ignore

# Загрузка переменных окружения
load_dotenv()

API_TOKEN = os.getenv("API_TOKEN")
if not API_TOKEN:
    raise ValueError("❌ API_TOKEN не найден в .env!")

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "city_db")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD")
if not DB_PASSWORD:
    raise ValueError("❌ DB_PASSWORD не найден в .env!")

bot = Bot(token=API_TOKEN)
dp = Dispatcher()
logging.basicConfig(level=logging.INFO)


def get_connection():
    try:
        return mysql.connector.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
    except Exception as e:
        logging.error(f"❌ Ошибка подключения к БД: {e}")
        return None


def create_subscribers_table():
    conn = get_connection()
    if conn is None:
        return
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subscribers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            chat_id BIGINT NOT NULL,
            phone_number VARCHAR(100),
            username VARCHAR(255)
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()


@dp.message(Command("start"))
async def start(message: types.Message):
    keyboard = types.ReplyKeyboardMarkup(
        keyboard=[
            [
                types.KeyboardButton(
                    text="👉🏻📲👈🏻",
                    request_contact=True
                )
            ],
            [
                types.KeyboardButton(
                    text="❌Отписка❌"
                )
            ]
        ],
        resize_keyboard=True
    )
    await message.answer(
        "👋 Привет!\nНажми на кнопку 👉🏻📲👈🏻, чтобы подписаться и получать важные уведомления🗞️.",
        reply_markup=keyboard
    )


@dp.message(lambda msg: msg.contact is not None)
async def contact_handler(message: types.Message):
    phone = message.contact.phone_number
    chat_id = message.chat.id
    username = message.from_user.username or "unknown_user"

    conn = get_connection()
    if conn is None:
        await message.answer("❌ Ошибка подключения к базе данных.")
        return

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM subscribers WHERE chat_id = %s", (chat_id,))
    if cursor.fetchone() is None:
        cursor.execute(
            "INSERT INTO subscribers (chat_id, phone_number, username) VALUES (%s, %s, %s)",
            (chat_id, phone, username)
        )
        conn.commit()
        await message.answer("✅✅ Отлично!✅✅\nТеперь ты будешь в курсе всех событий 🗞️")
        await bot.send_message(
            chat_id,
            "🌐 Также доступен сайт проекта (временно на localhost):\nhttp://localhost:8080\n\n📌 В будущем здесь будет настоящий адрес!"
        )
        logging.info(f"🥳 Новый подписчик: {username} | {phone} | chat_id: {chat_id}")
    else:
        await message.answer("👻 Вы уже подписаны 👻.")

    cursor.close()
    conn.close()


@dp.message(lambda msg: msg.text.strip().lower() == "❌отписка❌")
async def unsubscribe_handler(message: types.Message):
    chat_id = message.chat.id
    conn = get_connection()
    if conn is None:
        await message.answer("❌ Ошибка подключения к базе данных.")
        return

    cursor = conn.cursor()
    cursor.execute("DELETE FROM subscribers WHERE chat_id = %s", (chat_id,))
    conn.commit()
    cursor.close()
    conn.close()

    await message.answer("Ты отписался 😢 Если захочешь вернуться — жми на кнопку 👉🏻📲👈🏻")
    logging.info(f"👋 Пользователь отписался: chat_id {chat_id}")


async def send_alert_to_subscribers(message_text: str):
    conn = get_connection()
    if conn is None:
        logging.error("❌ Не удалось подключиться к базе данных для рассылки.")
        return

    cursor = conn.cursor()
    cursor.execute("SELECT chat_id FROM subscribers")
    subscribers = cursor.fetchall()
    for (chat_id,) in subscribers:
        try:
            await bot.send_message(chat_id, message_text)
        except Exception as e:
            logging.error(f"❌ Ошибка отправки пользователю {chat_id}: {e}")
    cursor.close()
    conn.close()


async def main():
    logging.info("🤖 Бот запущен. Ожидаем новых подписчиков… 🤖")
    await dp.start_polling(bot)


if __name__ == "__main__":
    create_subscribers_table()
    asyncio.run(main())
