# Investfolio

> A modern **Progressive Web App (PWA)** for tracking **stocks, mutual funds, and crypto** - live prices, gains/losses, allocation breakdowns, and annualized returns (XIRR), in one place.

This repository contains two sub-projects:

- `investfolio-frontend/` - Angular 20 SPA
- `investfolio-backend/` - Next.js API-only server (no UI)

---

## Tech Stack

### Frontend

| Area | Choice |
|---|---|
| Framework | Angular 20 (standalone components, no NgModules) |
| Reactivity | Angular signals + RxJS 7 |
| Control flow | Native `@if` / `@for` / `@empty` |
| Auth | Firebase Authentication via `@angular/fire` 20 |
| Language | TypeScript 5.8 |
| Styling | Component-scoped SCSS + CSS custom properties (dark/light themes) |
| 3D accents | Three.js (lazy-loaded, reduced-motion aware) |
| PWA | `@angular/service-worker` (offline + installable) |
| Routing | Hash-based, lazy-loaded routes |

### Backend

| Area | Choice |
|---|---|
| Runtime | Next.js (App Router) - API routes only, no UI |
| Database | MongoDB Atlas via Mongoose |
| Auth | Firebase Admin SDK |
| Edge middleware | CORS, per-IP rate limiting, body-size limit (`middleware.ts`) |

---

## Features

### Asset Tracking
- Three asset classes - **Stocks, Mutual Funds, Crypto** - each with its own dashboard: summary cards, allocation donut, sortable/searchable holdings table, and CSV export.
- **Combined overview** (`/dashboard`) - total invested/current/P&L/return across all assets, with a unified allocation donut.
- **Grouped holdings** - multiple buy lots of the same stock/coin collapse into one row, expandable to per-lot edit/delete.
- **XIRR** - annualized returns via Newton-Raphson, guarded so very-new holdings show `-` instead of misleading numbers.
- **Mutual Fund SIP tracking** - records holdings and mirrors real-world SIP installments (tracker only, no money movement or order placement).
- **Live prices** via Google Sheets + `GOOGLEFINANCE()`, proxied through the backend.

### Offline and PWA
- **Offline-first** - last-fetched data cached to `localStorage`; the app renders it when offline, with an offline banner, per-page "No internet / Retry" state, and silent auto-retry on reconnect.
- **PWA** - installable on desktop and mobile; service worker prefetches all route chunks so every page works offline after the first visit.

### Auth and Session
- Firebase Auth with email/password + Google sign-in, password reset, **change password** (email accounts), and **delete account** (full data wipe).
- **Auto-logout** - 30-min idle timeout with a "Still there?" warning, plus a sliding 7-day absolute session cap.

### UX
- **Loading UX** - branded animated loader (ascending bars) + scroll-lock during initial load; skeleton screens throughout.
- **Dark mode** modern UI with responsive layouts.
- **Responsive** - desktop layout above 1024px; mobile/tablet gets a bottom nav, card layouts, and swipe-to-switch tabs.

### Account and Legal
- `/settings`, `/contact` (bug-report form with spam honeypot, no email address exposed).
- Privacy, Terms, Cookies, and Disclaimer pages - plain, vendor-agnostic templates.
- Footer shown on public/logged-out pages only (hidden inside the app to avoid overlapping the bottom nav).

---

## Local Development

### Prerequisites

- Node.js v18+
- npm
- Angular CLI
- Firebase project (Auth enabled)
- Google Cloud project (Sheets API enabled)
- MongoDB Atlas cluster (or local instance)

### 1. Clone

```bash
git clone https://github.com/MisterStranger03/Investfolio.git
cd Investfolio
```

### 2. Frontend

```bash
cd investfolio-frontend
npm install
npm start          # ng serve -> http://localhost:4200
```

> The PWA service worker is only active in a production build served over HTTP(S), not in `ng serve`.

```bash
npm run build        # production build -> dist/my-portfolio-frontend
npm run serve:prod   # serve built bundle (service worker + offline active)
npm test             # unit tests (Karma/Jasmine)
```

### 3. Backend

```bash
cd investfolio-backend
npm install
# create .env.local with the env vars below
npm run dev        # http://localhost:3000
npx tsc --noEmit   # type-check
```

### 4. Backend Environment Variables (`.env.local`)

```bash
# Google Sheets API
GOOGLE_SHEETS_ID=YOUR_SHEET_ID
GOOGLE_CLIENT_EMAIL=YOUR_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/myportfolio

# Firebase Admin
FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
```

---

## Deployment

| Layer | Platform | Notes |
|---|---|---|
| Frontend (Angular) | Vercel / Firebase Hosting | Deploy the `dist/` build output |
| Backend (Next.js) | Render / Vercel | API routes only |
| Database | MongoDB Atlas | Cloud-hosted |
| Auth | Firebase | Login, Google sign-in, password reset |

---

## Summary

| Component | Technology | Purpose |
|---|---|---|
| Frontend | Angular 20 (PWA) | Modern UI, offline-ready |
| Backend | Next.js (API Routes) | Data bridge - Firebase, MongoDB, Sheets |
| Database | MongoDB Atlas | Persistent user and portfolio data |
| Auth | Firebase | Secure authentication |
| Live Data | Google Sheets + Finance API | Real-time stock/fund/crypto prices |

---

## Developer

Built by **Raman Sah**.

Feedbacks, bug reports, and suggestions are welcome - use the **Contact / Feedback form** available inside the app. Every report is read and appreciated.

> If you find Investfolio useful, consider giving it a star on GitHub. It means a lot and helps others discover the project.
