@echo off
cd /d "%~dp0"

REM Активируем виртуальное окружение
call .venv\Scripts\activate

REM Запуск Flask API (порт 8000)
start cmd /k "cd backend && python app.py"

REM Запуск парсера
start cmd /k "cd backend && python parser.py"

REM Запуск Telegram-бота
start cmd /k "cd ..\telegram-server && python bot.py"
