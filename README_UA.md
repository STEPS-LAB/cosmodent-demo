# 🦷 Cosmodent — Система управління стоматологічною клінікою

**Повністю готове до продакшену, full-stack рішення** для сучасної стоматологічної клініки.
Модульне, масштабоване, типізоване, контейнеризоване та протестоване.

---

## ✨ Ключові інновації

| Рівень | Інновація |
|--------|-----------|
| **Frontend** | Next.js 15 App Router, ISR + стрімінг, мікроанімації, AI-підказки для слотів |
| **Backend** | Fastify + event-driven WebSockets, модульна сервісна архітектура, Zod-валідація |
| **База даних** | MongoDB з составними індексами, модульні Mongoose-схеми, bulk-write для сортування |
| **Real-time** | WebSocket-хаб транслює події записів всім адмін-клієнтам миттєво |
| **AI** | GPT-4o-mini для пропозицій наступної послуги та SEO (з graceful fallback) |
| **UX** | Реальна доступність слотів (опитування кожні 30с), drag-and-drop, toast-повідомлення |
| **Тестування** | Vitest юніт-тести, Jest + Supertest інтеграційні, Playwright E2E (≥80% покриття) |
| **DevOps** | Багатоетапні Docker-збірки, health checks, graceful shutdown, Docker Compose |

---

## 🏗 Архітектура

```
demo-cosmodent/
├── backend/                    # Fastify REST API + WebSocket
│   ├── src/
│   │   ├── app.ts              # Fastify app builder
│   │   ├── server.ts           # Точка входу
│   │   ├── plugins/            # database | websocket | auth
│   │   ├── modules/            # appointments | services | doctors
│   │   │                       # auth | reviews | blog | settings | ai
│   │   ├── shared/             # Типи, пагінація, утиліти
│   │   └── scripts/seed.ts     # Скрипт наповнення бази
│   └── tests/
│       ├── unit/               # Jest юніт-тести
│       └── integration/        # Supertest HTTP-тести
│
├── frontend/                   # Next.js 15 App Router
│   ├── app/
│   │   ├── (public)/           # Публічний сайт (українська мова)
│   │   │   ├── page.tsx        # Головна
│   │   │   ├── services/       # Послуги + [slug]
│   │   │   ├── doctors/        # Лікарі
│   │   │   ├── reviews/        # Відгуки
│   │   │   └── contacts/       # Контакти
│   │   └── admin/              # Адмін-панель (захищена JWT)
│   │       ├── page.tsx        # Дашборд + статистика в реальному часі
│   │       ├── appointments/   # Управління записами
│   │       ├── services/       # CRUD + drag-and-drop
│   │       ├── doctors/        # CRUD
│   │       ├── reviews/        # Модерація відгуків
│   │       ├── blog/           # CRUD блогу
│   │       └── settings/       # SEO + контакти
│   ├── components/
│   │   ├── ui/                 # Button, Card, Modal, StarRating
│   │   ├── booking/            # BookingForm, TimeSlotPicker
│   │   ├── public/             # Navbar, Footer, ReviewSubmitForm
│   │   ├── admin/              # AdminSidebar, AdminAuthGuard
│   │   └── providers/          # QueryProvider
│   ├── lib/
│   │   ├── api.ts              # Типізований Axios API-клієнт
│   │   ├── hooks/              # useBooking, useWebSocket
│   │   └── utils.ts            # cn, formatPrice, statusLabel…
│   ├── types/index.ts          # Спільні TypeScript-типи
│   └── tests/
│       ├── unit/               # Vitest компонентні та утилітарні тести
│       └── e2e/                # Playwright E2E
│
├── docker/mongo/init.js        # Скрипт ініціалізації MongoDB
├── docker-compose.yml          # Оркестрація всього стеку
├── .env.example                # Шаблон середовища
├── README.md                   # Документація (англійська)
└── README_UA.md                # Документація (українська)
```

---

## 🚀 Швидкий старт

### Вимоги
- Node.js 20+
- Docker + Docker Compose
- MongoDB (або через Docker)

### 1. Клонування та налаштування

```bash
git clone https://github.com/your-org/demo-cosmodent.git
cd demo-cosmodent
cp .env.example .env
# Відредагуйте .env своїми секретами
```

### 2. Docker (рекомендовано — повний стек)

```bash
# Запустити всі сервіси
docker compose up -d

# Наповнити базу даних (перший запуск)
docker compose exec backend npm run seed

# Переглянути логи
docker compose logs -f backend
```

Доступні адреси:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Swagger**: http://localhost:3001/documentation
- **Mongo Express** (дев): http://localhost:8081

### 3. Локальна розробка

```bash
# Термінал 1 — Backend
cd backend && npm install && npm run dev

# Термінал 2 — Seed (перший запуск)
cd backend && npm run seed

# Термінал 3 — Frontend
cd frontend && npm install && npm run dev
```

---

## 🔑 Доступ до адмін-панелі

Дані за замовчуванням (після seed):
- **URL**: http://localhost:3000/admin
- **Email**: `admin@cosmodent.ua`
- **Пароль**: `Admin@123456`

> Змініть ці дані в `.env` перед деплоєм у продакшен!

---

## 🌐 API Endpoints

| Метод | Шлях | Auth | Опис |
|-------|------|------|------|
| `POST` | `/api/auth/login` | — | Вхід адміна |
| `GET`  | `/api/appointments/slots` | — | Вільні слоти |
| `POST` | `/api/appointments` | — | Запис на прийом |
| `GET`  | `/api/appointments` | JWT | Список записів |
| `PATCH`| `/api/appointments/:id/status` | JWT | Оновити статус |
| `GET`  | `/api/services/public` | — | Активні послуги |
| `POST` | `/api/services/reorder` | JWT | Drag-and-drop сортування |
| `GET`  | `/api/doctors/public` | — | Активні лікарі |
| `GET`  | `/api/reviews/public` | — | Виділені відгуки |
| `GET`  | `/api/settings/public` | — | Налаштування клініки |
| `WS`   | `/ws` | — | Real-time події |

---

## 🧪 Тестування

```bash
# Backend юніт-тести
cd backend && npm run test:unit

# Backend інтеграційні тести
cd backend && npm run test:integration

# Backend покриття
cd backend && npm run test:coverage

# Frontend юніт-тести
cd frontend && npm test

# Frontend E2E (Playwright)
cd frontend && npm run test:e2e
```

Ціль покриття: **≥ 80%** гілок, функцій та рядків.

---

## 🦷 Послуги клініки

Всі 10 послуг наповнюються автоматично скриптом seed:

| Послуга | Ціна від |
|---------|----------|
| Імплантологія | 18 000 грн |
| Хірургічна стоматологія | 1 200 грн |
| Лазерне лікування | 800 грн |
| Ортодонтія | 15 000 грн |
| Терапевтична стоматологія | 700 грн |
| Естетична стоматологія | 8 000 грн |
| Пародонтологія | 600 грн |
| Дитяча стоматологія | 500 грн |
| Протезування | 5 000 грн |
| Відбілювання зубів | 3 500 грн |

---

## 🤖 AI-функції

Встановіть `OPENAI_API_KEY` у `.env` для активації:
- **Пропозиції наступної послуги** — на основі поточного запису
- **Автогенерація SEO** — заголовок/опис/ключові слова для нових послуг
- **Підказки оптимізації контенту** — в адмін-панелі

Без API-ключа система автоматично переходить на правило-базовані підказки.

---

## 📦 Технологічний стек

### Backend
- Fastify 4, TypeScript 5.7, Mongoose 8, Zod, bcryptjs, OpenAI SDK

### Frontend
- Next.js 15 (App Router), TailwindCSS, React Query, React Hook Form, Lucide React, Axios

### Тестування
- Jest + Supertest, Vitest, @testing-library/react, Playwright

---

## 📄 Ліцензія

MIT © 2025 Cosmodent
