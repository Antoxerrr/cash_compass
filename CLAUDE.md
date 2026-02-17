# Cash Compass — контекст для Claude

## Что это

PWA-приложение "финансовый компас". Одно число — сколько можно потратить сегодня. Баланс / дней до зарплаты. Никакой аналитики, минимум взаимодействия.

## Архитектура

Чистый фронтенд, без бэкенда. Все данные в localStorage.

```
src/
  main.jsx                — точка входа
  App.jsx                 — роутинг (dashboard / settings) через useState
  components/
    Dashboard.jsx         — главный экран: число дня, инпут, быстрые кнопки, лог
    Settings.jsx          — дни зарплаты (мульти-выбор), ручная установка баланса
  hooks/
    useFinance.js         — основной хук: расчёты, операции с балансом, лог
  utils/
    storage.js            — localStorage обёртка (данные + дневной лог)
    calculations.js       — getDaysUntilPayday(), getDailyBudget()
  index.css               — все стили, тёмная тема
```

## Ключевые концепции

- **Якорь (anchor)** — дневной бюджет из "чистого" баланса (без сегодняшних операций). cleanBalance = balance - todayNet, anchor = cleanBalance / daysUntilPayday
- **Фактическое (todayRemaining)** — anchor + todayNet. Показывает реальный остаток на сегодня
- **Лог** — хранится только за текущий день (по локальной дате), сбрасывается автоматически

## Режимы ввода

- **Изменить (adjust)** — обычная трата/приход, пишет в лог, меняет todayRemaining
- **Коррекция (past/adjustBalanceSilent)** — задним числом, меняет баланс без записи в лог, пересчитывает якорь
- **Установить (set)** — ручная установка баланса

## localStorage ключи

- `cash_compass` — `{ balance: number, paydays: number[] }`
- `cash_compass_log` — `{ date: "YYYY-MM-DD", entries: [{ time, type, amount, balanceAfter }] }`

## PWA

- vite-plugin-pwa, registerType: autoUpdate
- Service worker генерируется при билде (workbox)
- Оффлайн из коробки, тихое обновление при наличии сети

## Деплой

- GitHub Pages через GitHub Actions (push в main)
- Кастомный домен: compass.antoxer.ru (CNAME в public/)
- base: '/' в vite.config.js

## Стилистика

- Тёмная тема (фон #1a1a2e, акцент #4ecca3, ошибки #e74c3c)
- Мобильный дизайн, max-width 480px
- overscroll-behavior: none — без pull-to-refresh
- Лог скроллится внутри контейнера, без скроллбара
