import sys
import os
from selenium import webdriver  # type: ignore
from selenium.webdriver.chrome.service import Service  # type: ignore
from webdriver_manager.chrome import ChromeDriverManager  # type: ignore
from selenium.webdriver.common.by import By  # type: ignore
from bs4 import BeautifulSoup  # type: ignore
import re
import time

# Добавляем родительскую директорию в путь для поиска модулей
sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), '../../')
    )
)

# Теперь можно импортировать модуль 'app.database'
from app.database import get_connection  # type: ignore

def extract_details_from_text(text):
    # Убираем лишние символы новой строки и пробелы
    text = text.replace('\n', ' ').replace('\r', ' ').strip()

    # Извлекаем все даты в формате dd.mm или dd.mm.yyyy
    all_dates = re.findall(r'\d{1,2}\.\d{1,2}(?:\.\d{4})?', text)
    start_date = all_dates[0] if len(all_dates) >= 1 else None
    end_date   = all_dates[1] if len(all_dates) >= 2 else None

    # Логирование полного текста для диагностики
    print("Полный текст новости:", text)

    # Извлечение адреса
    address = None
    addr_patterns = [
        r'по адресу:? (.*?)(?:\.|\n|$)',
        r'по адресам:? (.*?)(?:\.|\n|$)',
        r'по следующим адресам:? (.*?)(?:\.|\n|$)',
        r'отключение.*?по (.*?)\.(?:\s|$)',
    ]
    for pattern in addr_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            address = match.group(1).strip()
            break

    # Извлечение района
    district = None
    district_patterns = [
        r'в\s+районе\s+([А-Яа-я0-9\- ]+?)(?:[\.,;:]|\s|$)',
        r'на территории\s+([А-Яа-я0-9\- ]+?) района',
        r'по району\s+([А-Яа-я0-9\- ]+?)(?:[\.,;:]|\s|$)',
    ]
    for pattern in district_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            district = match.group(1).strip()
            break

    # Логирование извлеченных данных
    print("Извлеченная дата начала:", start_date)
    print("Извлеченная дата окончания:", end_date)
    print("Извлеченный адрес:", address)
    print("Извлеченный район:", district)

    return {
        "start_date": start_date,
        "end_date": end_date,
        "address": address,
        "district": district
    }

def get_kraskom_outages():
    base_url = "https://www.kraskom.com"
    list_url = f"{base_url}/abonent/news/"
    outages = []

    try:
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")
        driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=options
        )

        driver.get(list_url)
        time.sleep(3)
        soup = BeautifulSoup(driver.page_source, "lxml")
        news_blocks = soup.find_all("div", class_="news-release")

        for block in news_blocks:
            try:
                date = block.find("div", class_="date").text.strip()
                header_tag = block.find("div", class_="news-header").find("a")
                title = header_tag.text.strip()
                link = header_tag["href"]
                full_link = f"{base_url}{link}"

                driver.get(full_link)
                time.sleep(2)
                detail_soup = BeautifulSoup(driver.page_source, "lxml")
                text_block = detail_soup.find("div", class_="content")
                full_text = text_block.get_text(separator=" ", strip=True) if text_block else ""

                details = extract_details_from_text(full_text)

                conn = get_connection()
                if conn is None:
                    outages.append({"error": "Нет подключения к базе данных"})
                    continue

                cursor = conn.cursor()
                cursor.execute("SELECT id FROM outages WHERE link = %s", (full_link,))
                if not cursor.fetchone():
                    cursor.execute(
                        "INSERT INTO outages "
                        "(type, date, title, link, start_date, end_date, address, district) "
                        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                        (
                            "водоснабжение",
                            date,
                            title,
                            full_link,
                            details["start_date"],
                            details["end_date"],
                            details["address"],
                            details["district"]
                        )
                    )
                    conn.commit()

                cursor.close()
                conn.close()

                outages.append({
                    "type": "водоснабжение",
                    "date": date,
                    "title": title,
                    "link": full_link,
                    "start_date": details["start_date"],
                    "end_date": details["end_date"],
                    "address": details["address"],
                    "district": details["district"]
                })

            except Exception as inner_err:
                outages.append({"error": f"Ошибка в новости: {inner_err}"})

        driver.quit()
        print("Финальный список outages:", outages)
        return outages

    except Exception as e:
        return [{"error": f"Ошибка парсера: {e}"}]
