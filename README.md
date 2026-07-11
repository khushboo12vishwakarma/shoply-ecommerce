# Shoply — React + Django E-commerce

A clean, Amazon-style marketplace (its own UI, not a layout copy) with a
Django REST API backend and a React (Vite + Tailwind) frontend.

## Features

| # | Feature | Where |
|---|---------|-------|
| 1 | **Add to cart** | per-user cart, quantity updates, stock-aware |
| 2 | **Category-based search** | category chips + free-text search + sorting |
| 3 | **Signup & login (admin / vendor / client)** | JWT auth, role-based access |
| 4 | **Order history & statement** | orders list + spend summary by status |
| 5 | **User profile** | edit name, phone, default shipping address |
| + | **Vendor dashboard** | vendors add / edit / delete their own products |

## Tech stack

- **Backend:** Django 5 · Django REST Framework · SimpleJWT · PostgreSQL (sqlite for local dev)
- **Frontend:** React 18 · Vite · React Router · Tailwind CSS · Axios
- **Config:** all backend settings/secrets live in `backend/.env`
- **Deploy:** Dockerfile for each service + `docker-compose.yml`

---

## Run with Docker (recommended)

```bash
docker compose up --build
```

- Frontend → http://localhost:5173
- Backend API → http://localhost:8000/api
- Django admin → http://localhost:8000/admin

Demo data is seeded automatically on first boot (`SEED_ON_START=true`).

### Demo accounts

| Role   | Email             | Password    |
|--------|-------------------|-------------|
| Admin  | admin@shop.com    | admin1234   |
| Vendor | vendor@shop.com   | vendor1234  |
| Client | client@shop.com   | client1234  |

---
## Docker Images

### Backend

Repository:
https://hub.docker.com/r/khushboovishwakarma/amazon_clone-backend

Pull command:

```bash
docker pull khushboovishwakarma/amazon_clone-backend:latest
```

### Frontend

Repository:
https://hub.docker.com/r/khushboovishwakarma/amazon_clone-frontend

Pull command:

```bash
docker pull khushboovishwakarma/amazon_clone-frontend:latest
```

> **Note:** The project uses the official PostgreSQL Docker image (`postgres:16-alpine`), which Docker Compose downloads automatically.
---
## Run locally (without Docker)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows  (source .venv/bin/activate on macOS/Linux)
pip install -r requirements.txt
cp .env.example .env          # then edit if needed (empty DATABASE_URL = sqlite)
python manage.py migrate
python manage.py seed         # demo users + products
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_URL defaults to http://localhost:8000/api
npm run dev
```

---

## Configuration (`backend/.env`)

| Key | Meaning |
|-----|---------|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | `True` / `False` |
| `ALLOWED_HOSTS` | comma-separated hosts |
| `DATABASE_URL` | Postgres URL; empty = local sqlite |
| `CORS_ALLOWED_ORIGINS` | frontend origins allowed to call the API |
| `ACCESS_TOKEN_LIFETIME_MIN` | JWT access token lifetime (minutes) |
| `REFRESH_TOKEN_LIFETIME_DAYS` | JWT refresh token lifetime (days) |

---

## API overview

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register/` | sign up (client or vendor) |
| POST | `/api/auth/login/` | obtain JWT + user info |
| POST | `/api/auth/refresh/` | refresh access token |
| GET/PATCH | `/api/auth/profile/` | current user profile |
| GET | `/api/categories/` | list categories |
| GET | `/api/products/?category__slug=&search=&ordering=` | browse / search |
| CRUD | `/api/products/` | vendor/admin manage products |
| GET | `/api/cart/` | current cart |
| POST | `/api/cart/add/` · `update_item/` · `remove/` · `clear/` | cart ops |
| POST | `/api/orders/checkout/` | place order from cart |
| GET | `/api/orders/` | order history |
| GET | `/api/orders/statement/` | spend statement |
