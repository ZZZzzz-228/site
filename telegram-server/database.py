import mysql.connector  # type: ignore
from mysql.connector import Error  # type: ignore
import os
from dotenv import load_dotenv  # type: ignore

load_dotenv()

def get_connection():
    """
    Получение соединения с базой данных
    """
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            database=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD")
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Ошибка при подключении к базе данных: {e}")
        return None

def add_subscriber(chat_id: int, phone_number: str):
    """
    Добавление нового подписчика в базу данных
    """
    conn = get_connection()
    if conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO subscribers (chat_id, phone_number) VALUES (%s, %s)",
            (chat_id, phone_number)
        )
        conn.commit()
        cursor.close()
        conn.close()
