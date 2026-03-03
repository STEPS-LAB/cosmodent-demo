# CosmoDent - Сучасна Система Управління Стоматологічною Клінікою

## 🌟 Огляд

CosmoDent - це production-ready, модульна система управління стоматологічною клінікою, побудована за сучасними стандартами (2026). Включає публічний вебсайт, адмін-панель, систему бронювання в реальному часі та AI-покращений UX.

## 🚀 Можливості

### Публічний Вебсайт
- **Адаптивний Дизайн**: Mobile-first підхід з TailwindCSS
- **SEO Оптимізація**: Next.js App Router з оптимізацією метаданих
- **Бронювання в Реальному Часі**: Перевірка доступності слотів миттєво
- **AI Пропозиції**: Розумні рекомендації послуг на основі поведінки користувача
- **Український Контент**: Повна локалізація для українського ринку

### Адмін-Панель
- **JWT Автентифікація**: Безпечний контроль доступу на основі ролей
- **Статистика в Реальному Часі**: Жива панель з метриками записів
- **Управління Записами**: Оновлення статусів з WebSocket-сповіщеннями
- **CRUD Послуг**: Drag-and-drop перевпорядкування з підказками оптимізації цін
- **Управління Лікарями**: Управління профілями з завантаженням зображень
- **Блог-Система**: Управління контентом для новин клініки
- **Панель Налаштувань**: SEO, контакти та конфігурація соціальних мереж

### Архітектура Backend
- **Fastify + TypeScript**: Високопродуктивний API-сервер
- **Модульні Сервіси**: Event-driven архітектура для масштабованості
- **MongoDB + Mongoose**: Оптимізовані схеми з розширеним індексуванням
- **WebSocket Підтримка**: Сповіщення в реальному часі для бронювань
- **JWT Auth**: Безпечна автентифікація з refresh-токенами

## 📁 Структура Проекту

```
demo-cosmodent-qwen/
├── backend/
│   ├── src/
│   │   ├── config/          # Файли конфігурації
│   │   ├── models/          # Mongoose схеми з індексами
│   │   ├── services/        # Шар бізнес-логіки
│   │   ├── controllers/     # Обробники запитів
│   │   ├── routes/          # Визначення API маршрутів
│   │   ├── middleware/      # Auth, валідація, обробка помилок
│   │   ├── utils/           # Допоміжні функції, валідатори
│   │   ├── websocket/       # WebSocket обробники
│   │   └── server.ts        # Точка входу додатку
│   ├── tests/
│   │   ├── unit/            # Unit-тести
│   │   ├── integration/     # Integration-тести
│   │   └── e2e/             # End-to-end тести
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # Багаторазові UI компоненти
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API клієнтські сервіси
│   │   ├── stores/          # Управління станом
│   │   ├── types/           # TypeScript визначення
│   │   ├── utils/           # Допоміжні функції
│   │   └── styles/          # Глобальні стилі
│   ├── public/              # Статичні активи
│   ├── tests/
│   │   ├── unit/            # Unit-тести
│   │   └── e2e/             # Playwright e2e тести
│   ├── Dockerfile
│   ├── package.json
│   └── next.config.ts
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🛠 Технологічний Стек

### Frontend
- **Next.js 15** (App Router) + TypeScript
- **TailwindCSS** + Headless UI
- **React Query** для отримання даних
- **Zustand** для управління станом
- **React Hook Form** + Zod валідація
- **Socket.io Client** для оновлень в реальному часі

### Backend
- **Fastify** + TypeScript
- **Mongoose** з розширеним індексуванням
- **JWT** для автентифікації
- **Socket.io** для WebSocket підтримки
- **Bcrypt** для хешування паролів
- **Winston** для логування

### Тестування
- **Jest** + Supertest (backend)
- **Vitest** (frontend)
- **Playwright** (e2e)

### DevOps
- **Docker** + Docker Compose
- **GitHub Actions** готовий

## 🏃 Швидкий Старт

### Вимоги
- Node.js 20+
- MongoDB 6+
- Docker (опціонально)

### Налаштування Оточення

1. Скопіюйте файл оточення:
```bash
cp .env.example .env
```

2. Оновіть змінні оточення:
```env
# Backend
MONGODB_URI=mongodb://localhost:27017/cosmodent
JWT_SECRET=your-super-secret-jwt-key
PORT=3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Запуск з Docker

```bash
docker-compose up --build
```

Доступ:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Адмін-Панель: http://localhost:3000/admin

### Запуск Локально

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Тестування

### Backend Тести
```bash
cd backend
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Frontend Тести
```bash
cd frontend
npm run test:unit
npm run test:e2e
```

### Повний Набір Тестів
```bash
npm run test:coverage
```

## 📡 API Ендпоінти

### Публічний API
- `GET /api/services` - Список всіх послуг
- `GET /api/services/:slug` - Деталі послуги
- `GET /api/doctors` - Список всіх лікарів
- `GET /api/reviews` - Відгуки пацієнтів
- `POST /api/appointments` - Створити запис
- `GET /api/appointments/availability` - Перевірити доступні слоти

### Admin API (Потребує JWT)
- `POST /api/admin/auth/login` - Вхід адміна
- `GET /api/admin/dashboard` - Статистика панелі
- `GET /api/admin/appointments` - Список записів
- `PATCH /api/admin/appointments/:id` - Оновити статус запису
- `CRUD /api/admin/services` - Управління послугами
- `CRUD /api/admin/doctors` - Управління лікарями
- `CRUD /api/admin/blog` - Управління блогом
- `GET /api/admin/settings` - Отримати налаштування
- `PATCH /api/admin/settings` - Оновити налаштування

## 🎨 Система Дизайну

### Кольорова Палітра
- **Основний**: М'який Зелений (#10B981)
- **Вторинний**: Білий (#FFFFFF)
- **Акцент**: Світло-Сірий (#F3F4F6)
- **Текст**: Темно-Сірий (#1F2937)

### Типографія
- **Заголовки**: Inter Bold
- **Текст**: Inter Regular
- **WCAG AA** сумісні коефіцієнти контрастності

## 🔐 Функції Безпеки

- JWT з ротацією refresh-токенів
- Rate limiting на API ендпоінтах
- Валідація вхідних даних з Zod
- CORS конфігурація
- Helmet заголовки безпеки
- Запобігання MongoDB ін'єкціям

## 📈 Оптимізації Продуктивності

- **Frontend**: Часткова гідратація, ISR, оптимізація зображень
- **Backend**: Пул з'єднань, оптимізація запитів, кешування
- **Database**: Індексовані запити, агрегаційні пайплайни

## 🚀 Розгортання

### Production Збірка

```bash
# Backend
cd backend
npm run build
npm run start

# Frontend
cd frontend
npm run build
npm run start
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📝 Ліцензія

MIT License - Дивіться файл LICENSE для деталей

## 👥 Підтримка

Для проблем та запитань, будь ласка, створіть issue на GitHub.
