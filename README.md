# 🚀 Backend Developer Intern Assignment

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?style=flat&logo=prisma&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react&logoColor=black)

This repository is my submission for the **Backend Developer Intern** assignment at **Primetrade.ai**.  
It is a full‑stack application demonstrating a secure, scalable REST API with authentication, role‑based access control (RBAC), full CRUD operations, and a simple frontend for testing.

---

## 📋 Table of Contents

- [Assignment Overview](#-assignment-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#-api-documentation)
- [Security & Scalability](#-security--scalability)
- [Demo Flow](#-demo-flow)

---

## 📌 Assignment Overview

- **Objective:** Build a Scalable REST API with Authentication & Role‑Based Access, and create a simple frontend UI to interact with it.

- **Core requirements:**
  - User registration & login with password hashing and JWT (HTTP‑only cookies).
  - Role‑based access (USER vs ADMIN).
  - CRUD APIs for a secondary entity (`Task`).
  - API versioning, error handling, validation.
  - API documentation (Swagger).
  - Basic frontend (React + Vite) to register, log in, and manage tasks.

---

## ✨ Key Features

### Backend
- **Express.js + TypeScript** – robust and type‑safe.
- **PostgreSQL** via Neon – cloud database with Prisma ORM.
- **Secure authentication** – JWT stored in HTTP‑only cookies (XSS‑safe).
- **Role‑based access** – protect routes for `USER` and `ADMIN` roles.
- **Full CRUD for Tasks** – users manage their own tasks; admins can manage all.
- **Input validation** – using `Zod` to sanitize and validate all inputs.
- **Centralised error handling** – consistent error responses.
- **Swagger documentation** – interactive API docs at `/api-docs`.
- **Rate limiting** – prevents brute‑force attacks.
- **Security headers** – via `helmet`.

### Frontend
- **React + Vite** – fast development and build.
- **Authentication UI** – login and registration forms.
- **Protected dashboard** – only accessible after login.
- **Task management** – create, edit, delete, and list tasks.
- **Admin panel** – admins can view all users.
- **Responsive dark theme** – clean and modern.

---

## 🛠️ Tech Stack

| Category       | Technology                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------ |
| **Backend**    | Node.js, Express.js, TypeScript                                                            |
| **Database**   | PostgreSQL (Neon), Prisma ORM                                                              |
| **Auth**       | JWT, bcryptjs, HTTP‑only cookies                                                           |
| **Validation** | Zod                                                                                        |
| **Docs**       | Swagger (swagger-jsdoc, swagger-ui-express)                                                |
| **Frontend**   | React, Vite, TypeScript                                                                    |
| **Security**   | Helmet, CORS, express-rate-limit, morgan                                                   |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v20 or higher
- **npm** v10 or higher
- A [Neon](https://neon.tech/) PostgreSQL database (or any PostgreSQL instance)

---

### Backend Setup

1. **Clone the repository** and navigate to the `backend` folder.
   ```bash
   git clone https://github.com/DevPatel1479/backend_intern_assignment.git
   cd backend-intern-assignment/backend
   ```

2. **Install dependencies.**
   ```bash
   npm install
   ```

3. **Set up environment variables.**
   Copy the example file:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your own values:
   ```env
   DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
   JWT_ACCESS_SECRET="your-very-long-and-random-secret"
   CLIENT_ORIGIN="http://localhost:5173"
   ```
   > **Tip:** Generate a secure secret with `openssl rand -base64 32`.

4. **Run Prisma migrations and seed the database.**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx prisma db seed
   ```
   The seed script creates an admin user:
   - **Email:** `admin@example.com`
   - **Password:** `Admin@12345`

5. **Start the development server.**
   ```bash
   npm run dev
   ```
   The backend will be available at `http://localhost:4000`.

---

### Frontend Setup

1. **Navigate to the `frontend` folder.**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies.**
   ```bash
   npm install
   ```

3. **Set up environment variables.**
   Copy the example:
   ```bash
   cp .env.example .env
   ```
   Ensure the `VITE_API_URL` points to your backend (default is `http://localhost:4000`).

4. **Start the development server.**
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173`.

---

## 📚 API Documentation

Interactive Swagger documentation is available once the backend is running:

> **http://localhost:4000/api-docs**

### Main Endpoints

| Method | Endpoint                   | Description                     | Access     |
|--------|----------------------------|---------------------------------|------------|
| POST   | `/api/v1/auth/register`    | Register a new user             | Public     |
| POST   | `/api/v1/auth/login`       | Log in                          | Public     |
| POST   | `/api/v1/auth/logout`      | Log out                         | Private    |
| GET    | `/api/v1/auth/me`          | Get current user profile        | Private    |
| GET    | `/api/v1/tasks`            | List tasks (user’s or all)      | Private    |
| POST   | `/api/v1/tasks`            | Create a task                   | Private    |
| GET    | `/api/v1/tasks/:id`        | Get a single task               | Private    |
| PATCH  | `/api/v1/tasks/:id`        | Update a task                   | Private    |
| DELETE | `/api/v1/tasks/:id`        | Delete a task                   | Private    |
| GET    | `/api/v1/admin/users`      | List all users (admin only)     | Admin only |

> **Note:** All private endpoints require a valid JWT token (sent automatically via the HTTP‑only cookie after login).

---

## 🔒 Security & Scalability

- **JWT in HTTP‑only cookies** – prevents XSS token theft.
- **Password hashing** – `bcryptjs` with salt rounds = 12.
- **Input validation** – every request body is validated with Zod before processing.
- **Centralised error handler** – gives consistent error responses.
- **Helmet & CORS** – protect against common web vulnerabilities.
- **Rate limiting** – 200 requests per 15 minutes per IP.
- **Modular architecture** – separation of concerns (routes, controllers, services) makes it easy to add new features.
- **Future‑proof** – the structure is ready for caching (Redis), background jobs, microservices, or Docker deployment.

---

## ▶️ Demo Flow

1. **Register** a new user via the frontend.
2. **Log in** – the JWT is set in an HTTP‑only cookie.
3. **Create** tasks – fill in the form and submit.
4. **View** your task list.
5. **Edit** or **delete** any of your own tasks.
6. **Log out** and log in as the admin (`admin@example.com` / `Admin@12345`).
7. Admins can see all users and also manage any task (though not exposed in the UI, the API allows it).
8. Explore the **Swagger** docs to test endpoints interactively.

---

