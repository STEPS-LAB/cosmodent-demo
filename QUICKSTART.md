# CosmoDent - Швидкий старт

## Вимоги
- Node.js 20+
- MongoDB 6+
- Docker (опціонально)

## Запуск з Docker (рекомендовано)

```bash
# Клонувати репозиторій
cd demo-cosmodent-qwen

# Запустити всі сервіси
docker-compose up --build

# Дочекатися запуску MongoDB та ініціалізувати базу даних
docker-compose exec backend npm run seed

# Доступ до додатку:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001
# - Admin Panel: http://localhost:3000/admin/login
```

## Локальний запуск

### 1. Встановлення залежностей

```bash
# Встановити залежності для всіх частин проекту
npm install

# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Налаштування оточення

```bash
# Скопіювати .env.example в .env
cp .env.example .env

# Відредагувати .env за потреби
```

### 3. Запуск MongoDB

```bash
# Використовуйте Docker для MongoDB
docker run -d -p 27017:27017 --name cosmodent-mongo mongo:7

# Або локальний MongoDB
mongod --dbpath /data/db
```

### 4. Ініціалізація бази даних

```bash
cd backend
npm run seed
```

Це створить:
- Адміна: admin@cosmodent.ua / Admin123!
- 15 послуг
- 4 лікарів
- Налаштування клініки

### 5. Запуск розробки

```bash
# З кореневої директорії (одночасно backend + frontend)
npm run dev

# Або окремо:
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

## Доступ до додатку

- **Головна сторінка**: http://localhost:3000
- **Адмін-панель**: http://localhost:3000/admin/login
  - Email: admin@cosmodent.ua
  - Пароль: Admin123!
- **API Документація**: http://localhost:3001/api/docs (якщо налаштовано)
- **Health Check**: http://localhost:3001/api/health

## Тестування

```bash
# Backend тести
cd backend
npm test

# Frontend тести
cd frontend
npm test

# E2E тести (Playwright)
cd frontend
npm run test:e2e
```

## Структура проекту

```
demo-cosmodent-qwen/
├── backend/           # Fastify API сервер
│   ├── src/
│   │   ├── config/    # Конфігурація
│   │   ├── models/    # Mongoose схеми
│   │   ├── services/  # Бізнес-логіка
│   │   ├── controllers/ # API обробники
│   │   ├── routes/    # Маршрути
│   │   └── middleware/ # Middleware
│   └── tests/
├── frontend/          # Next.js додаток
│   ├── src/
│   │   ├── app/       # Next.js App Router
│   │   ├── components/ # React компоненти
│   │   ├── services/  # API клієнт
│   │   └── stores/    # State management
│   └── tests/
└── docker-compose.yml
```

## Основні можливості

### Публічний сайт
- Головна сторінка з_hero секцією
- Каталог послуг з фільтрацією
- Сторінка кожної послуги
- Профіль лікарів
- Відгуки пацієнтів
- Контакти
- Онлайн-бронювання

### Адмін-панель
- Dashboard зі статистикою
- Управління записами (статуси, real-time оновлення)
- CRUD послуг (з drag-and-drop сортуванням)
- CRUD лікарів
- Управління відгуками
- Блог
- Налаштування клініки

### Технічні особливості
- Real-time оновлення через WebSocket
- AI-підказки для оптимізації
- Модульна архітектура
- Повне покриття тестами
- Docker контейнеризація

## Поширені проблеми

### MongoDB не підключається
Перевірте, що MongoDB запущено:
```bash
docker ps | grep mongo
```

### Порт вже зайнятий
Змініть порт у .env файлі:
```
PORT=3001  # для backend
```

### Помилки з залежностями
Видаліть node_modules та перевстановіть:
```bash
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Підтримка

Для питань та проблем створюйте issue на GitHub.
