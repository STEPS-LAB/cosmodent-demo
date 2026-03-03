# CosmoDent - Modern Dental Clinic Management System

## 🌟 Overview

CosmoDent is a production-ready, modular dental clinic management system built with modern technologies (2026 standards). It features a public website, admin dashboard, real-time booking system, and AI-powered UX enhancements.

## 🚀 Features

### Public Website
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **SEO Optimized**: Next.js App Router with metadata optimization
- **Real-time Booking**: Live availability checking with instant validation
- **AI Suggestions**: Smart service recommendations based on user behavior
- **Ukrainian Content**: Fully localized for Ukrainian market

### Admin Dashboard
- **JWT Authentication**: Secure role-based access control
- **Real-time Statistics**: Live dashboard with appointment metrics
- **Appointment Management**: Status updates with WebSocket notifications
- **Service CRUD**: Drag-and-drop reordering with price optimization hints
- **Doctor Management**: Profile management with image uploads
- **Blog System**: Content management for clinic news
- **Settings Panel**: SEO, contacts, and social media configuration

### Backend Architecture
- **Fastify + TypeScript**: High-performance API server
- **Modular Services**: Event-driven architecture for scalability
- **MongoDB + Mongoose**: Optimized schemas with advanced indexing
- **WebSocket Support**: Real-time updates for bookings and notifications
- **JWT Auth**: Secure authentication with refresh tokens

## 📁 Project Structure

```
demo-cosmodent-qwen/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── models/          # Mongoose schemas with indexes
│   │   ├── services/        # Business logic layer
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API route definitions
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── utils/           # Helpers, validators, formatters
│   │   ├── websocket/       # WebSocket handlers
│   │   └── server.ts        # Application entry point
│   ├── tests/
│   │   ├── unit/            # Unit tests
│   │   ├── integration/     # Integration tests
│   │   └── e2e/             # End-to-end tests
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API client services
│   │   ├── stores/          # State management
│   │   ├── types/           # TypeScript definitions
│   │   ├── utils/           # Helpers and formatters
│   │   └── styles/          # Global styles
│   ├── public/              # Static assets
│   ├── tests/
│   │   ├── unit/            # Unit tests
│   │   └── e2e/             # Playwright e2e tests
│   ├── Dockerfile
│   ├── package.json
│   └── next.config.ts
├── docker-compose.yml
├── .env.example
└── README_UA.md
```

## 🛠 Tech Stack

### Frontend
- **Next.js 15** (App Router) + TypeScript
- **TailwindCSS** + Headless UI
- **React Query** for data fetching
- **Zustand** for state management
- **React Hook Form** + Zod validation
- **Socket.io Client** for real-time updates

### Backend
- **Fastify** + TypeScript
- **Mongoose** with advanced indexing
- **JWT** for authentication
- **Socket.io** for WebSocket support
- **Bcrypt** for password hashing
- **Winston** for logging

### Testing
- **Jest** + Supertest (backend)
- **Vitest** (frontend)
- **Playwright** (e2e)

### DevOps
- **Docker** + Docker Compose
- **GitHub Actions** ready

## 🏃 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB 6+
- Docker (optional)

### Environment Setup

1. Copy environment file:
```bash
cp .env.example .env
```

2. Update environment variables:
```env
# Backend
MONGODB_URI=mongodb://localhost:27017/cosmodent
JWT_SECRET=your-super-secret-jwt-key
PORT=3001

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Running with Docker

```bash
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Admin Panel: http://localhost:3000/admin

### Running Locally

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

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Frontend Tests
```bash
cd frontend
npm run test:unit
npm run test:e2e
```

### Full Test Suite
```bash
npm run test:coverage
```

## 📡 API Endpoints

### Public API
- `GET /api/services` - List all services
- `GET /api/services/:slug` - Get service details
- `GET /api/doctors` - List all doctors
- `GET /api/reviews` - Get patient reviews
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/availability` - Check available slots

### Admin API (Requires JWT)
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/appointments` - List appointments
- `PATCH /api/admin/appointments/:id` - Update appointment status
- `CRUD /api/admin/services` - Service management
- `CRUD /api/admin/doctors` - Doctor management
- `CRUD /api/admin/blog` - Blog management
- `GET /api/admin/settings` - Get settings
- `PATCH /api/admin/settings` - Update settings

## 🎨 Design System

### Color Palette
- **Primary**: Soft Green (#10B981)
- **Secondary**: White (#FFFFFF)
- **Accent**: Light Gray (#F3F4F6)
- **Text**: Dark Gray (#1F2937)

### Typography
- **Headings**: Inter Bold
- **Body**: Inter Regular
- **WCAG AA** compliant contrast ratios

## 🔐 Security Features

- JWT with refresh token rotation
- Rate limiting on API endpoints
- Input validation with Zod
- CORS configuration
- Helmet security headers
- MongoDB injection prevention

## 📈 Performance Optimizations

- **Frontend**: Partial hydration, ISR, image optimization
- **Backend**: Connection pooling, query optimization, caching
- **Database**: Indexed queries, aggregation pipelines

## 🚀 Deployment

### Production Build

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

## 📝 License

MIT License - See LICENSE file for details

## 👥 Support

For issues and questions, please open an issue on GitHub.
