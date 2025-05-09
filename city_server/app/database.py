# database.py
import mysql.connector  # type: ignore
from mysql.connector import Error  # type: ignore

def get_connection():
    """
    Получение соединения с базой данных
    """
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='city_db',  # Замените на правильное имя вашей базы данных
            user='root',         # Имя пользователя
            password='Ze2Ma2==03'  # Замените на свой пароль
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Ошибка при подключении к базе данных: {e}")
        return None
