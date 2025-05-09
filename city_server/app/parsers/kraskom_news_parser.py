import requests  # type: ignore
from bs4 import BeautifulSoup  # type: ignore
from app.database import get_connection  # type: ignore

BASE_URL = "https://www.kraskom.com/abonent/news/"

def get_latest_news_url():
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/110.0.0.0 Safari/537.36"
        )
    }
    response = requests.get(BASE_URL, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    news_blocks = soup.find_all("div", class_="news-release")
    if not news_blocks:
        raise ValueError("Не удалось найти новости на странице")

    latest_news = news_blocks[0]
    link_tag = latest_news.find("a", href=True)
    if not link_tag:
        raise ValueError("Не удалось найти ссылку на самую свежую новость")

    relative_url = link_tag["href"].lstrip("/")
    latest_news_url = (
        BASE_URL.rstrip("/") +
        "/" +
        relative_url.lstrip("/").replace("abonent/news/", "")
    )
    return latest_news_url

def parse_news_page(url):
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/110.0.0.0 Safari/537.36"
        )
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    left_col = soup.find("div", class_="left-col")
    if not left_col:
        raise ValueError("Не удалось найти левую колонку с новостью")

    title_tag = left_col.find("div", class_="col-header").find("h5")
    title = title_tag.text.strip() if title_tag else "Заголовок не найден"

    date_tag = left_col.find("div", class_="item-date")
    date = date_tag.text.strip() if date_tag else "Дата не найдена"

    content_tags = left_col.find_all("p")
    content = "\n".join(
        tag.get_text(strip=True)
        for tag in content_tags
        if tag.text.strip()
    )

    print(f"Парсинг завершён: title = {title}, date = {date}")  # Логирование

    return {
        "title": title,
        "date": date,
        "content": content
    }

def save_to_database(data):
    conn = get_connection()
    if conn is None:
        print("Ошибка подключения к базе данных!")
        raise ValueError("Нет подключения к базе данных")

    print("Данные, которые будут сохранены в базу данных:", data)

    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            INSERT INTO news (title, date, content)
            VALUES (%s, %s, %s)
            """,
            (data["title"], data["date"], data["content"])
        )
        conn.commit()
        print("Данные успешно сохранены в базу данных")
    except Exception as e:
        print(f"Ошибка при сохранении данных в базу: {e}")
    finally:
        cursor.close()
        conn.close()

def main():
    try:
        latest_news_url = get_latest_news_url()
        print(f"Самая свежая новость: {latest_news_url}")
        news_data = parse_news_page(latest_news_url)
        save_to_database(news_data)
        print("Данные успешно сохранены в базу данных")
    except Exception as e:
        print(f"Произошла ошибка: {e}")

if __name__ == "__main__":
    main()
