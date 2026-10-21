# VedaLearn — LMS платформа для обучения веб-разработке

Fullstack-приложение образовательной платформы для разработчиков. Включает интерактивный плеер уроков с отслеживанием прогресса, каталог курсов, личный кабинет студента и глобальные настройки темы и интерфейса.

> 🌐 **Live Demo:** [https://lms-client-k1nz.onrender.com](https://lms-client-k1nz.onrender.com)

---

## 🛠 Стек технологий

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query v5, React Router 7, Lucide Icons
- **Backend:** Node.js 22, Express 5, TypeScript, PostgreSQL (pg pool), JWT, bcrypt, Zod
- **DevOps & Инфраструктура:** Docker, Docker Compose, Nginx (Reverse Proxy + SPA routing), Multi-stage builds

---

## ⚡️ Быстрый старт через Docker

Все сервисы (клиент, сервер и база данных со всеми курсами и уроками) поднимаются одной командой:

```bash
docker compose up -d --build
```

- **Frontend:** [http://localhost](http://localhost) (Nginx + React SPA)
- **Backend API:** [http://localhost:3000/api](http://localhost:3000/api) (Express)
- **PostgreSQL:** `localhost:5433` (внутри сети Docker — `postgres:5432`). Скрипт `init.sql` автоматически накатывает схему и начальные данные при первом старте.

Остановка контейнеров:
```bash
docker compose down
```

---

## 🚀 Основные возможности

### Обучение и плеер уроков
- **Каталог курсов:** фильтрация по категориям (Frontend, Backend, Базы данных, Архитектура), поиск, карточки с длительностью и тегами.
- **Плеер уроков:** блочный теоретический контент, сниппеты кода, интерактивный сайдбар с прогрессом по модулям.
- **Сохранение прогресса:** автоматическое запоминание позиции скролла при чтении и опциональный автопереход к следующему уроку.

### Личный кабинет и настройки
- **Дашборд «Мои курсы»:** сводная статистика обучения, прогресс-бары и быстрый возврат к последнему уроку.
- **Профиль:** редактирование данных, смена пароля и статус аккаунта.
- **Настройки интерфейса:** переключение темы (Dark / Light), изменение размера шрифта и управление поведением плеера уроков (сохраняются в `localStorage`).

---

## 📁 Структура проекта

```text
├── backend/
│   ├── src/
│   │   ├── db/          # Подключение к PostgreSQL (pg pool)
│   │   ├── middleware/  # JWT-авторизация и Zod-валидация
│   │   ├── routes/      # Роуты API (auth, courses, modules, lessons, enrollments)
│   │   ├── schemas/     # Схемы валидации запросов Zod
│   │   └── services/    # Бизнес-логика и SQL-запросы к БД
│   └── Dockerfile       # Multi-stage сборка (Node 22)
│
├── frontend/
│   ├── src/
│   │   ├── app/         # Роутер и провайдеры (React Query, Auth, Settings)
│   │   ├── features/    # Модульная архитектура по фичам (auth, courses, lessons)
│   │   ├── pages/       # Страницы приложения
│   │   └── shared/      # Общие компоненты и API-клиент (axios)
│   ├── nginx.conf       # Конфигурация Nginx: SPA fallback + API reverse proxy
│   └── Dockerfile       # Multi-stage сборка (Node 22 builder -> Nginx Alpine)
│
├── init.sql             # SQL-дамп схемы и данных для автоматической инициализации базы
└── docker-compose.yml   # Оркестрация контейнеров
```

---

## 💻 Локальный запуск (для разработки)

### 1. Требования
- Node.js 22+
- Запущенный PostgreSQL

### 2. Бэкенд
```bash
cd backend
npm install
```

Создайте `.env` в папке `backend/`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=lms
JWT_SECRET=your_jwt_secret
```

Запуск:
```bash
npm run dev
```

### 3. Фронтенд
```bash
cd ../frontend
npm install
npm run dev
```
Фронтенд будет доступен по адресу `http://localhost:5173`.
