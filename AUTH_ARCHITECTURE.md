# 🔐 AUTHENTICATION ARCHITECTURE DOCUMENTATION

## Production-Ready JWT Authentication System

---

## 📋 TABLE OF CONTENTS

1. [Architecture Overview](#architecture-overview)
2. [Token Flow](#token-flow)
3. [Security Features](#security-features)
4. [API Endpoints](#api-endpoints)
5. [Frontend Implementation](#frontend-implementation)
6. [Backend Implementation](#backend-implementation)
7. [Troubleshooting](#troubleshooting)

---

## 🏗️ ARCHITECTURE OVERVIEW

### Token Strategy

| Token Type | Lifetime | Storage | Purpose |
|------------|----------|---------|---------|
| **Access Token** | 15 minutes | Memory + Zustand (localStorage) | API authentication |
| **Refresh Token** | 30 days | httpOnly cookie | Access token renewal |

### Why This Architecture?

✅ **Security**: Refresh token never exposed to JavaScript (httpOnly cookie)
✅ **UX**: Seamless token refresh without user interaction
✅ **Performance**: No race conditions with request queuing
✅ **Scalability**: Stateless JWT with server-side validation

---

## 🔄 TOKEN FLOW

### 1. Login Flow

```
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│   Browser   │                    │  Frontend   │                    │   Backend   │
│             │                    │   (React)   │                    │   (Fastify) │
└──────┬──────┘                    └──────┬──────┘                    └──────┬──────┘
       │                                  │                                  │
       │  POST /api/admin/auth/login      │                                  │
       │  { email, password }             │                                  │
       │─────────────────────────────────>│                                  │
       │                                  │                                  │
       │                                  │  Validate credentials            │
       │                                  │                                  │
       │                                  │  Generate access token (15m)     │
       │                                  │  Generate refresh token (30d)    │
       │                                  │                                  │
       │  Set-Cookie: refreshToken        │                                  │
       │  { accessToken, admin }          │                                  │
       │<─────────────────────────────────│                                  │
       │                                  │                                  │
       │  Store accessToken in Zustand    │                                  │
       │  Refresh token stored in cookie  │                                  │
       │                                  │                                  │
```

### 2. API Request Flow

```
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│   Browser   │                    │  Frontend   │                    │   Backend   │
│             │                    │   (React)   │                    │   (Fastify) │
└──────┬──────┘                    └──────┬──────┘                    └──────┬──────┘
       │                                  │                                  │
       │  GET /api/admin/reviews          │                                  │
       │  Authorization: Bearer <token>   │                                  │
       │─────────────────────────────────>│                                  │
       │                                  │                                  │
       │                                  │  Verify JWT                      │
       │                                  │  Check role                      │
       │                                  │                                  │
       │  { reviews... }                  │                                  │
       │<─────────────────────────────────│                                  │
       │                                  │                                  │
```

### 3. Token Refresh Flow (Auto)

```
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│   Browser   │                    │  Frontend   │                    │   Backend   │
│             │                    │   (React)   │                    │   (Fastify) │
└──────┬──────┘                    └──────┬──────┘                    └──────┬──────┘
       │                                  │                                  │
       │  API Request (expired token)     │                                  │
       │─────────────────────────────────>│                                  │
       │                                  │                                  │
       │  401 Unauthorized                │                                  │
       │<─────────────────────────────────│                                  │
       │                                  │                                  │
       │  POST /api/admin/auth/refresh    │                                  │
       │  (cookie: refreshToken)          │                                  │
       │─────────────────────────────────>│                                  │
       │                                  │                                  │
       │                                  │  Verify refresh token            │
       │                                  │  Generate new access token       │
       │                                  │                                  │
       │  { accessToken }                 │                                  │
       │<─────────────────────────────────│                                  │
       │                                  │                                  │
       │  Retry original request          │                                  │
       │  (with new token)                │                                  │
       │─────────────────────────────────>│                                  │
       │                                  │                                  │
```

---

## 🛡️ SECURITY FEATURES

### 1. Token Security

| Feature | Implementation |
|---------|----------------|
| **Short-lived Access** | 15 minutes expiration |
| **httpOnly Cookie** | Refresh token inaccessible to JS |
| **Secure Flag** | HTTPS-only in production |
| **SameSite Strict** | CSRF protection |
| **Signed JWT** | HMAC-SHA256 with strong secret |

### 2. Request Protection

```typescript
// Axios interceptor prevents race conditions
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Queue requests during refresh
if (isRefreshing) {
  return new Promise((resolve) => {
    subscribeTokenRefresh((token: string) => {
      // Retry with new token
    });
  });
}
```

### 3. CORS Configuration

```typescript
await fastify.register(cors, {
  origin: ['https://yourdomain.com'], // Explicit whitelist
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
});
```

---

## 📡 API ENDPOINTS

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/admin/auth/login` | ❌ | Login with credentials |
| POST | `/api/admin/auth/refresh` | ❌ | Refresh access token |
| POST | `/api/admin/auth/logout` | ✅ | Logout (clear cookie) |
| GET | `/api/admin/auth/me` | ✅ | Get current user |

### Response Examples

**Login Success (200)**
```json
{
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "superadmin"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Set-Cookie Header**
```
Set-Cookie: refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000
```

**Refresh Token (200)**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

---

## 💻 FRONTEND IMPLEMENTATION

### File Structure

```
frontend/src/
├── services/
│   └── api.ts          # Axios instance with interceptors
├── stores/
│   └── adminStore.ts   # Zustand auth state
└── components/
    └── admin/
        ├── AdminLoginPage.tsx
        ├── AdminLayout.tsx
        └── reviews/
            └── AdminReviewsPage.tsx
```

### Key Components

#### 1. API Client (`services/api.ts`)

```typescript
// Centralized Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Enable cookies
});

// Request interceptor - add token
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - auto refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Handle token refresh
    }
    return Promise.reject(error);
  }
);
```

#### 2. Auth Store (`stores/adminStore.ts`)

```typescript
export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isInitialized: false,
      
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

---

## 🔧 BACKEND IMPLEMENTATION

### File Structure

```
backend/src/
├── config/
│   └── index.ts        # Configuration with JWT settings
├── middleware/
│   └── auth.ts         # JWT verification middleware
├── controllers/
│   └── admin/
│       └── AuthController.ts  # Auth endpoints
├── routes/
│   └── adminRoutes.ts  # Route registration
└── server.ts           # Fastify setup
```

### Key Components

#### 1. JWT Setup (`server.ts`)

```typescript
await fastify.register(jwt, {
  secret: config.jwt.secret,
  sign: {
    expiresIn: config.jwt.expiresIn, // 15m
    issuer: 'cosmodent-backend',
    audience: 'cosmodent-frontend',
  },
});
```

#### 2. Auth Middleware (`middleware/auth.ts`)

```typescript
export const authMiddleware = async (request, reply) => {
  const authHeader = request.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.code(401).send({ message: 'Missing Authorization header' });
  }

  const token = authHeader.substring(7);
  const payload = await request.jwtVerify(token);

  request.user = payload;
};
```

#### 3. Login Controller (`AuthController.ts`)

```typescript
export const login = async (request, reply) => {
  const { email, password } = request.body;
  
  // Validate credentials
  const admin = await authService.login({ email, password });

  // Generate tokens
  const accessToken = await reply.jwtSign(
    { id: admin._id, email, role, name },
    { expiresIn: '15m' }
  );

  const refreshToken = await reply.jwtSign(
    { id: admin._id, type: 'refresh' },
    { expiresIn: '30d' }
  );

  // Set httpOnly cookie
  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60,
  });

  return reply.send({ admin, accessToken });
};
```

---

## 🐛 TROUBLESHOOTING

### Common Issues

#### 1. 401 Unauthorized on Protected Endpoints

**Possible causes:**
- Token expired → Check auto-refresh is working
- Wrong token format → Ensure `Authorization: Bearer <token>`
- CORS blocking → Verify `CORS_ORIGIN` includes frontend URL
- Cookie not sent → Check `withCredentials: true` in Axios

**Solution:**
```bash
# Check backend logs
docker logs backend-container

# Verify token in browser console
console.log(localStorage.getItem('admin-storage'))
```

#### 2. Infinite Refresh Loop

**Cause:** Refresh token also expired

**Solution:**
- Backend clears cookie on invalid refresh
- Frontend redirects to `/admin/login`
- User must re-authenticate

#### 3. CORS Errors

**Check:**
```typescript
// backend/src/config/index.ts
cors: {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
}

// Must include frontend URL exactly
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```

#### 4. Cookie Not Being Set

**Check:**
- `@fastify/cookie` registered before routes
- `reply.setCookie()` called before `reply.send()`
- In production, HTTPS is required for secure cookies

---

## 🚀 DEPLOYMENT CHECKLIST

### Environment Variables

```bash
# Production .env
NODE_ENV=production
JWT_SECRET=<generate-strong-secret-min-32-chars>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=https://yourdomain.com
```

### Security Hardening

1. ✅ Change JWT_SECRET to cryptographically secure value
2. ✅ Enable HTTPS (required for secure cookies)
3. ✅ Configure CORS for production domain only
4. ✅ Enable helmet CSP in production
5. ✅ Set up rate limiting
6. ✅ Use MongoDB with authentication
7. ✅ Regular token secret rotation

---

## 📚 ADDITIONAL RESOURCES

- [Fastify JWT Documentation](https://github.com/fastify/fastify-jwt)
- [Fastify CORS Documentation](https://github.com/fastify/fastify-cors)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [Zustand Persistence](https://github.com/pmndrs/zustand#persist-middleware)

---

**Last Updated:** March 2026
**Version:** 2.0.0 (Production Ready)
