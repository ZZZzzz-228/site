@echo off
title Бот + Сервер + Сайт

REM Запуск бота
start "Bot" cmd /k "cd /d C:\Users\kucer\OneDrive\Рабочий стол\проекты\telegram-server && py -3.11 bot.py"

REM Запуск сервера
start "Server" cmd /k "cd /d C:\Users\kucer\OneDrive\Рабочий стол\проекты\telegram-server && py -3.11 server.py"

REM Запуск сайта (npm run dev)
start "Site" cmd /k "cd /d C:\Users\kucer\OneDrive\Рабочий стол\проекты\версия 2.0 && npm run dev"
