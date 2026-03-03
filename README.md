# 🦷 Cosmodent — Dental Clinic Management System

A **production-ready, full-stack** dental clinic platform built to 2026 standards.
Modular, scalable, fully typed, containerized, and tested.

---

## ✨ Key Innovations

| Layer | Innovation |
|-------|-----------|
| **Frontend** | Next.js 15 App Router, ISR + streaming, micro-animations, AI slot suggestions |
| **Backend** | Fastify + event-driven WebSockets, modular service architecture, Zod validation |
| **Database** | MongoDB with compound indexes, modular Mongoose schemas, bulk-write reorder |
| **Real-time** | WebSocket hub broadcasts appointment events to all admin clients instantly |
| **AI** | GPT-4o-mini suggestions for next service, SEO auto-generation (falls back gracefully) |
| **UX** | Real-time slot availability (30s poll), drag-and-drop service reorder, toast notifications |
| **Testing** | Vitest unit tests, Jest + Supertest integration, Playwright E2E (≥80% coverage) |
| **DevOps** | Multi-stage Docker builds, health checks, graceful shutdown, Docker Compose |

---

## 🏗 Architecture

```
demo-cosmodent/
├── backend/                    # Fastify REST API + WebSocket
│   ├── src/
│   │   ├── app.ts              # Fastify app builder
│   │   ├── server.ts           # Entry point
│   │   ├── plugins/            # database | websocket | auth
│   │   ├── modules/            # appointments | services | doctors
│   │   │   │                   # auth | reviews | blog | settings | ai
│   │   │   └── <module>/
│   │   │       ├── *.model.ts     # Mongoose schema + indexes
│   │   │       ├── *.service.ts   # Business logic layer
│   │   │       └── *.routes.ts    # Fastify route handlers
│   │   ├── shared/
│   │   │   ├── types/          # Shared TypeScript interfaces
│   │   │   └── utils/          # pagination, helpers
│   │   └── scripts/seed.ts     # Database seed script
│   └── tests/
│       ├── unit/               # Jest unit tests (mocked)
│       └── integration/        # Supertest HTTP tests
│
├── frontend/                   # Next.js 15 App Router
│   ├── app/
│   │   ├── (public)/           # Public site (UA content)
│   │   │   ├── page.tsx        # Головна
│   │   │   ├── services/       # Послуги + [slug]
│   │   │   ├── doctors/        # Лікарі
│   │   │   ├── reviews/        # Відгуки
│   │   │   └── contacts/       # Контакти
│   │   └── admin/              # Admin panel (protected)
│   │       ├── page.tsx        # Dashboard + real-time stats
│   │       ├── appointments/   # Manage appointments
│   │       ├── services/       # CRUD + drag-and-drop
│   │       ├── doctors/        # CRUD
│   │       ├── reviews/        # Moderate reviews
│   │       ├── blog/           # Blog CRUD
│   │       └── settings/       # SEO + contacts
│   ├── components/
│   │   ├── ui/                 # Button, Card, Modal, StarRating
│   │   ├── booking/            # BookingForm, TimeSlotPicker
│   │   ├── public/             # Navbar, Footer, ReviewSubmitForm
│   │   ├── admin/              # AdminSidebar, AdminAuthGuard
│   │   └── providers/          # QueryProvider (React Query)
│   ├── lib/
│   │   ├── api.ts              # Typed Axios API client
│   │   ├── hooks/              # useBooking, useWebSocket
│   │   └── utils.ts            # cn, formatPrice, statusLabel…
│   ├── types/index.ts          # Shared TypeScript types
│   └── tests/
│       ├── unit/               # Vitest component + util tests
│       └── e2e/                # Playwright E2E specs
│
├── docker/mongo/init.js        # MongoDB init script
├── docker-compose.yml          # Full stack orchestration
├── .env.example                # Environment template
├── README.md                   # English documentation
└── README_UA.md                # Ukrainian documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker + Docker Compose
- MongoDB (or use Docker)

### 1. Clone & configure

```bash
git clone https://github.com/your-org/demo-cosmodent.git
cd demo-cosmodent
cp .env.example .env
# Edit .env with your secrets
```

### 2. Docker (recommended — full stack)

```bash
# Start all services
docker compose up -d

# Seed the database (first run)
docker compose exec backend npm run seed

# View logs
docker compose logs -f backend
```

Services available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Swagger docs**: http://localhost:3001/documentation
- **Mongo Express** (dev): http://localhost:8081

### 3. Local development

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev

# Terminal 2 — Seed DB (first run)
cd backend
npm run seed

# Terminal 3 — Frontend
cd frontend
npm install
npm run dev
```

---

## 🔑 Admin Access

Default credentials (after seed):
- **URL**: http://localhost:3000/admin
- **Email**: `admin@cosmodent.ua`
- **Password**: `Admin@123456`

> Change these in `.env` before seeding in production!

---

## 🌐 API Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/login` | — | Admin login |
| `GET`  | `/api/auth/me` | JWT | Current admin info |
| `GET`  | `/api/appointments/slots` | — | Available time slots |
| `POST` | `/api/appointments` | — | Book appointment |
| `GET`  | `/api/appointments` | JWT | List appointments |
| `PATCH`| `/api/appointments/:id/status` | JWT | Update status |
| `GET`  | `/api/appointments/stats/summary` | JWT | Dashboard stats |
| `GET`  | `/api/services/public` | — | Active services |
| `GET`  | `/api/services/public/:slug` | — | Service detail |
| `POST` | `/api/services/reorder` | JWT | Drag-and-drop reorder |
| `GET`  | `/api/doctors/public` | — | Active doctors |
| `GET`  | `/api/reviews/public` | — | Highlighted reviews |
| `POST` | `/api/reviews` | — | Submit review |
| `GET`  | `/api/settings/public` | — | Clinic settings |
| `WS`   | `/ws` | — | Real-time events |

Full interactive docs: http://localhost:3001/documentation

---

## 🧪 Testing

```bash
# Backend unit tests
cd backend && npm run test:unit

# Backend integration tests
cd backend && npm run test:integration

# Backend coverage report
cd backend && npm run test:coverage

# Frontend unit tests (Vitest)
cd frontend && npm test

# Frontend E2E (Playwright)
cd frontend && npm run test:e2e

# E2E with UI
cd frontend && npm run test:e2e:ui
```

Coverage target: **≥ 80%** branches, functions, and lines.

---

## 🌍 Services

All 10 dental services are seeded automatically:

| Service | Slug | From (UAH) |
|---------|------|-----------|
| Імплантологія | `implantology` | 18,000 |
| Хірургічна стоматологія | `surgical-dentistry` | 1,200 |
| Лазерне лікування | `laser-treatment` | 800 |
| Ортодонтія | `orthodontics` | 15,000 |
| Терапевтична стоматологія | `therapeutic-dentistry` | 700 |
| Естетична стоматологія | `aesthetic-dentistry` | 8,000 |
| Пародонтологія | `periodontology` | 600 |
| Дитяча стоматологія | `pediatric-dentistry` | 500 |
| Протезування | `prosthetics` | 5,000 |
| Відбілювання зубів | `teeth-whitening` | 3,500 |

---

## 🤖 AI Features

Set `OPENAI_API_KEY` in `.env` to enable:
- **Next service suggestions** — shown after booking based on treatment history
- **SEO auto-generation** — generates title/description/keywords for new services
- **Content optimization hints** — admin panel suggestions for service descriptions

Without the API key, the system falls back to rule-based suggestions automatically.

---

## 🐳 Docker Production Tips

```bash
# Build and run in production mode
docker compose up -d --build

# Scale backend horizontally (with external MongoDB)
docker compose up -d --scale backend=3

# Health check endpoints
curl http://localhost:3001/health
curl http://localhost:3000/api/health
```

---

## 📦 Technology Stack

### Backend
- **Fastify 4** — High-performance web framework
- **TypeScript 5.7** — Fully typed codebase
- **Mongoose 8** — MongoDB ODM with advanced indexing
- **Zod** — Runtime schema validation
- **@fastify/websocket** — WebSocket real-time events
- **@fastify/jwt** — JWT authentication
- **bcryptjs** — Secure password hashing
- **OpenAI SDK** — AI suggestions (optional)

### Frontend
- **Next.js 15** (App Router) — React meta-framework
- **TailwindCSS 3** — Utility-first CSS
- **React Query (@tanstack/react-query)** — Server state management
- **React Hook Form + Zod** — Type-safe form validation
- **Framer Motion** — Micro-animations
- **@hello-pangea/dnd** — Drag-and-drop reorder
- **Lucide React** — Icon system
- **Axios** — HTTP client with interceptors

### Testing
- **Jest + ts-jest** — Backend unit/integration tests
- **Supertest** — HTTP request testing
- **Vitest** — Frontend unit tests
- **@testing-library/react** — Component testing
- **Playwright** — E2E browser automation

---

## 📄 License

MIT © 2025 Cosmodent
