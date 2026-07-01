# Backend Developer Intern Assignment

A production-ready monorepo starter with:

- Express + TypeScript backend
- PostgreSQL via Prisma (works with Neon)
- JWT auth in httpOnly cookies
- Role-based access (`USER`, `ADMIN`)
- CRUD for `Task`
- Validation with Zod
- Centralized error handling
- Swagger docs
- React + Vite frontend demo

## 1) Project structure

```bash
backend/
frontend/
```

## 2) Backend setup

### Prerequisites
- Node.js 20+
- A Neon PostgreSQL connection string

### Install

```bash
cd backend
npm install
```

### Environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Fill in:

- `DATABASE_URL` from Neon
- `JWT_ACCESS_SECRET` a long random string
- `JWT_ACCESS_EXPIRES_IN` e.g. `7d`
- `CLIENT_ORIGIN` your frontend URL, e.g. `http://localhost:5173`

### Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

If you only want to push schema to Neon quickly during the assignment:

```bash
npx prisma db push
npx prisma db seed
```

### Run backend

```bash
npm run dev
```

Backend runs on `http://localhost:4000`

Swagger docs:
- `http://localhost:4000/api-docs`

Health:
- `http://localhost:4000/health`

## 3) Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`

## 4) What to show the interviewer

Use these flows:

1. Register a user from the UI.
2. Log in.
3. Create tasks.
4. Update and delete tasks.
5. Log in with an admin account.
6. Access admin-only route:
   - `GET /api/v1/admin/users`
7. Open Swagger docs and show the endpoints.

## 5) API summary

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Tasks
- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `GET /api/v1/tasks/:id`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`

### Admin
- `GET /api/v1/admin/users`

## 6) Notes on scalability

- Modular route/controller/service structure
- Versioned API path: `/api/v1`
- HTTP-only cookie for token handling
- Strong validation before DB writes
- Prisma helps schema migration and clean DB access
- Easy to split into auth/task/admin modules later
- Optional future improvements:
  - Redis caching
  - refresh tokens
  - background jobs
  - request logging
  - rate limiting per route
  - Docker + CI/CD

## 7) Important interview note

If asked why you used httpOnly cookies:
- They reduce XSS risk compared to storing JWT in localStorage.
- Backend controls auth state more safely.
- Frontend only needs `credentials: 'include'`.

---

If you want a one-command deployment setup after this, add Docker later. For the assignment, this structure is already strong enough to demonstrate production habits.
