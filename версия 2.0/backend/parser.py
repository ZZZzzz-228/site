import requests
import time
import pymysql
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import re
from datetime import datetime

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "Ze2Ma2==03",
    "database": "city_db",
    "charset": "utf8mb4",
    "cursorclass": pymysql.cursors.DictCursor
}

BASE_URL = "http://005красноярск.рф/"

MONTHS_RU = {
    "января": "01", "февраля": "02", "марта": "03", "апреля": "04",
    "мая": "05", "июня": "06", "июля": "07", "августа": "08",
    "сентября": "09", "октября": "10", "ноября": "11", "декабря": "12"
}

def get_connection():
    return pymysql.connect(**DB_CONFIG)

def save_to_db(item):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id FROM outages WHERE title=%s AND date=%s AND district=%s",
        (item["title"], item["date"], item["district"])
    )
    if cur.fetchone() is None:
        cur.execute(
            """INSERT INTO outages
               (type, date, title, link,
                start_date, end_date, address, district)
               VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
            (
                item["type"], item["date"], item["title"], item["link"],
                item["start_date"], item["end_date"], item["address"], item["district"]
            )
        )
        conn.commit()
        print(f"✅ Сохранено: {item['title']} ({item['district']})")
    else:
        print(f"⚠️ Уже есть: {item['title']} ({item['district']})")
    cur.close()
    conn.close()

def normalize_date(raw):
    try:
        parts = raw.strip().split()
        if len(parts) >= 2:
            day = parts[0]
            month = MONTHS_RU.get(parts[1].lower(), "??")
            if month != "??":
                return f"{day.zfill(2)}.{month}"
        raise ValueError(f"Не удалось разобрать дату: {raw}")
    except Exception as e:
        raise ValueError(f"Ошибка при обработке даты: {raw} — {e}")

def parse_005():
    print("📡 Загружаем главную страницу...")
    resp = requests.get(BASE_URL, headers={"User-Agent": "Mozilla/5.0"})
    resp.encoding = resp.apparent_encoding
    soup = BeautifulSoup(resp.text, "html.parser")

    tabs = soup.select(".elementor-tabs-wrapper .elementor-tab-title")
    print(f"🔍 Найдено вкладок: {len(tabs)}")

    total_saved = 0
    for tab in tabs:
        content = soup.select_one(f".elementor-tab-content[data-tab='{tab['data-tab']}']")
        if not content:
            continue
        iframe = content.find("iframe", src=True)
        if not iframe:
            continue

        iframe_url = urljoin(BASE_URL, iframe["src"])
        print(f"🌐 Загружаем iframe: {iframe_url}")
        page = requests.get(iframe_url, headers={"User-Agent": "Mozilla/5.0"})
        page.encoding = "cp1251"
        frame = BeautifulSoup(page.text, "html.parser")
        table = frame.find("table")
        if not table:
            continue

        current_district = None
        for tr in table.select("tr"):
            for td in tr.select("td"):
                style = td.get("style", "").lower()
                txt = td.get_text(strip=True).lower()
                if "background:#0069d2" in style and "район" in txt:
                    current_district = td.get_text(strip=True)
                    break
            else:
                pass
            if current_district and any("background:#0069d2" in td.get("style", "").lower() for td in tr.select("td")):
                continue
            if current_district is None:
                continue

            cells = tr.select("td")
            if len(cells) != 3:
                continue

            parts = list(cells[0].stripped_strings)
            if not parts:
                continue
            service = parts[0]
            skip = {
                "ресурс", "адреса причина", "начало - завершение",
                "запланированные отключения на завтра"
            }
            if service.lower() in skip:
                continue
            org = ", ".join(parts[1:]) if len(parts) > 1 else ""
            title = f"{service} — {org}".strip(" —")

            address = " ".join(cells[1].stripped_strings)
            times = list(cells[2].stripped_strings)
            if not times:
                continue
            start = times[0]
            end = times[1] if len(times) > 1 else ""

            try:
                date = normalize_date(start)
            except Exception as e:
                print(f"❌ {e}")
                continue

            save_to_db({
                "type":       service,
                "date":       date,
                "title":      title,
                "link":       iframe_url,
                "start_date": start,
                "end_date":   end,
                "address":    address,
                "district":   current_district
            })
            total_saved += 1

    print(f"\n📥 Завершено. Сохранено новых записей: {total_saved}")

if __name__ == "__main__":
    print("🔁 Парсер запущен в бесконечном цикле. Обновление каждые 2 минуты.")
    while True:
        try:
            parse_005()
        except Exception as e:
            print(f"❌ Ошибка при парсинге: {e}")
        print("⏳ Ожидание 2 минуты...\n")
        time.sleep(120)
