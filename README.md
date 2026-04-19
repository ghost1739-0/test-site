# E-Architect MERN Skeleton

Production-oriented MERN e-commerce starter with React + Tailwind frontend and Express + MongoDB backend.

## Stack

- MongoDB + Mongoose
- Express.js + Node.js
- React (Context API for cart state)
- Tailwind CSS
- JWT authentication
- Auto-seeded product catalog on backend startup
- Checkout, order history, admin product management

## Features

- Secure auth endpoints (`register`, `login`, `me`) with JWT
- Product API with filtering (`category`, `minPrice`, `maxPrice`, `search`)
- Global error middleware + `asyncHandler` integration
- Mongoose models: `User`, `Product`, `Order`
- Cart system with React Context and LocalStorage persistence
- Product detail pages, checkout flow, order history, and admin CRUD UI
- Dark mode ready, minimalist UI with product listing and cart page

## Project Structure

- `backend/`: API server, DB config, auth, product routes, models
- `frontend/`: Vite React app, Tailwind styles, cart context, pages/components

## Run Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

## Run Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

## Important Env Variables

Backend (`backend/.env`):

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `ADMIN_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Frontend (`frontend/.env`):

- `VITE_API_URL`

## Demo Admin Login

- Email: `admin@earchitect.com`
- Password: `Admin123!`

The backend seeds this admin account automatically when the env variables are set.

## API Quick Reference

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `GET /api/products`
- `GET /api/products?category=Electronics&minPrice=1000&maxPrice=5000`
- `GET /api/products/:id`
