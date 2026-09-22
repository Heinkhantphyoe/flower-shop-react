# FlowerShop Frontend

Customer-facing e-commerce storefront and admin dashboard for the FlowerShop platform. Browse products, manage a cart, place orders, save wishlists, and chat with an AI shopping assistant — plus a full admin panel for catalog, orders, and analytics.

Built with **React 19**, **Vite 7**, **Redux Toolkit (RTK Query)**, and **Tailwind CSS v4**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Routing & Access Control](#routing--access-control)
- [State & API Layer](#state--api-layer)
- [Styling](#styling)
- [Product Images](#product-images)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)
- [Related Projects](#related-projects)

---

## Features

### Customer (public & authenticated)

| Feature | Description |
|---------|-------------|
| **Home & catalog** | Browse paginated products with category and price filters |
| **Product detail** | Modal view with add-to-cart and wishlist actions |
| **Shopping cart** | Slide-out drawer — add, update quantity, remove items |
| **Checkout** | Place orders with optional coupon codes |
| **Wishlist** | Save products and move items to cart |
| **Order history** | View and cancel pending orders |
| **Profile** | Update name, phone, and avatar |
| **Auth** | Register (OTP verification), login, forgot/reset password, Google Sign-In |
| **AI chatbot** | Product-aware assistant powered by the backend |

### Admin (`/admin`)

| Section | Description |
|---------|-------------|
| **Analytics** | Revenue charts and customer metrics (Recharts) |
| **Products** | Create, edit, delete products with image upload |
| **Categories** | Manage product categories |
| **Orders** | View all orders and update status |
| **Customers** | Customer directory |
| **Profile** | Admin account settings |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | React 19, JSX (no TypeScript) |
| Build | Vite 7 |
| Routing | React Router 7 |
| State / data | Redux Toolkit, RTK Query |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Auth (OAuth) | `@react-oauth/google` |
| Notifications | React Toastify |
| HTTP | Axios (via RTK Query `fetchBaseQuery`) |
| Linting | ESLint 9 (flat config) |

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ recommended |
| npm | 10+ |
| FlowerShop Backend | Running at `http://localhost:8080/api` |
| Redis | Required by the backend (carts & chatbot) |

---

## Quick Start

### 1. Clone and install

```bash
git clone <repository-url>
cd flower-shop-frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Minimum `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Start the backend

The frontend expects the [FlowerShop Backend](https://github.com/Heinkhantphyoe/flower-shop) API to be running. See the backend README for PostgreSQL, Redis, and `.env` setup.

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Default admin login

Use the credentials from the backend `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`), then navigate to `/admin`.

---

## Configuration

All frontend environment variables must be prefixed with `VITE_` to be exposed to the client.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Backend API base URL (e.g. `http://localhost:8080/api`) |
| `VITE_GOOGLE_CLIENT_ID` | No | Google OAuth client ID — Sign-In button is hidden when unset |

### Google Sign-In setup

1. Create an OAuth 2.0 **Web** client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Add `http://localhost:5173` to **Authorized JavaScript origins**.
3. Set the same client ID in:
   - Frontend `.env` → `VITE_GOOGLE_CLIENT_ID`
   - Backend `.env` → `GOOGLE_CLIENT_ID`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port `5173` with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Project Structure

```
src/
├── api/                 # RTK Query API slices
│   ├── baseQuery.js     # Auth headers + automatic token refresh
│   ├── authApi.js
│   ├── productApi.js
│   ├── cartApi.js
│   ├── orderApi.js
│   ├── couponApi.js
│   ├── wishlistApi.js
│   ├── categoryApi.js
│   ├── chatApi.js
│   └── analyticApi.js
├── components/          # Shared UI (Navbar, Footer, CartDrawer, Chatbot, …)
├── layouts/
│   ├── UserLayout.jsx   # Public + customer shell
│   └── AdminLayout.jsx  # Admin shell
├── pages/
│   ├── auth/            # Login, Register, OTP, Forgot/Reset password
│   ├── public/          # Home, Products, About Us
│   ├── user/            # Profile, Orders, Wishlists
│   └── admin/           # Dashboard, Products, Orders, Analytics, …
├── redux/
│   └── authSlice.js     # Auth state (token, user, refresh token)
├── router/
│   ├── AppRouter.jsx    # Route definitions
│   └── RequireAuth.jsx  # Role-based route guard
├── store/
│   └── store.js         # Redux store configuration
├── utils/
│   └── authUtil.js
├── index.css            # Tailwind v4 theme & global styles
├── App.jsx
└── main.jsx             # Entry point (Redux Provider, Google OAuth)

public/
└── uploads/             # Product images (written by the backend)
```

---

## Routing & Access Control

Routes are defined in `src/router/AppRouter.jsx`.

| Path | Access | Page |
|------|--------|------|
| `/` | Public | Home |
| `/products` | Public | Product catalog |
| `/about-us` | Public | About page |
| `/login` | Public | Login |
| `/register` | Public | Registration |
| `/otp-confirmation` | Public | OTP verification |
| `/forgot-password` | Public | Forgot password |
| `/reset-password` | Public | Reset password (token in URL) |
| `/user/profile` | `ROLE_USER` | User profile |
| `/wishlists` | `ROLE_USER` | Wishlist |
| `/user/orders` | `ROLE_USER` | Order history |
| `/admin` | `ROLE_ADMIN` | Admin dashboard |
| `/unauthorized` | — | 401 error page |
| `*` | — | 404 error page |

`RequireAuth` checks the JWT role from Redux and redirects unauthorized users.

---

## State & API Layer

### RTK Query slices

Each domain has an API slice in `src/api/` built on a shared `baseQueryWithReauth` wrapper.

### Auth token handling (important)

- **Always read the JWT from Redux state** (`state.auth.user.token`) — never from `localStorage` directly.
- Reading `localStorage` causes race-condition 401s because Redux updates synchronously while `localStorage` does not.
- On `401`, `baseQueryWithReauth` automatically calls `/auth/refresh` and retries the original request.
- If refresh fails, the user is logged out.

### Redux auth slice

`src/redux/authSlice.js` stores:

- Access token
- Refresh token
- User profile / role

Persisted to `localStorage` for session continuity across page reloads, but **headers are always sourced from Redux at request time**.

---

## Styling

- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin — there is no `tailwind.config.js`.
- Theme tokens, custom properties, and base styles live in `src/index.css`.
- Component styling uses Tailwind utility classes throughout.
- Animations use Framer Motion for page transitions and the admin sidebar.

---

## Product Images

Product images are uploaded by the backend and stored in:

```
public/uploads/
```

The backend writes directly to this directory (configured via `product.image.uploadDir`). In development, both apps run locally so images appear immediately. In Docker, the uploads folder is bind-mounted between containers.

Serve uploaded images from `/uploads/<filename>` — Vite serves `public/` at the root.

---

## Building for Production

```bash
npm run build
```

Output is written to `dist/`. Preview locally:

```bash
npm run preview
```

### Environment for production builds

Set `VITE_API_BASE_URL` to your deployed API URL **before** building:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

Vite inlines env vars at build time — changing `.env` after `npm run build` has no effect.

### Deployment notes

- Configure your static host to serve `index.html` for all routes (SPA fallback).
- Ensure the backend `cors.allowed-origins` includes your production frontend URL.
- Uploaded product images must be served from a persistent volume or object storage in production.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| API requests fail / CORS errors | Confirm backend is running and `VITE_API_BASE_URL` is correct |
| Immediate 401 after login | Do not read tokens from `localStorage` in API code — use Redux state |
| Google Sign-In button missing | Set `VITE_GOOGLE_CLIENT_ID` in `.env` |
| Google login fails server-side | Match `VITE_GOOGLE_CLIENT_ID` with backend `GOOGLE_CLIENT_ID` |
| Product images broken | Check `public/uploads/` exists and backend `product.image.uploadDir` points here |
| Cart / chatbot errors | Backend requires Redis on `localhost:6379` |
| Admin page redirects to `/unauthorized` | Log in with the admin account (`ADMIN_EMAIL` from backend `.env`) |
| Styles not applying | Ensure `@tailwindcss/vite` plugin is in `vite.config.js` and `index.css` imports Tailwind |

---

## Related Projects

| Project | Description |
|---------|-------------|
| [FlowerShop Backend](../flowershop/) | Spring Boot REST API — required for all data operations |

### Full-stack local development

```bash
# Terminal 1 — Redis
docker run -d -p 6379:6379 redis:7-alpine

# Terminal 2 — Backend (from flowershop/)
.\mvnw.cmd spring-boot:run

# Terminal 3 — Frontend (from flower-shop-frontend/)
npm run dev
```

---

## License

This project is part of the FlowerShop monorepo. See the repository root for license information.
