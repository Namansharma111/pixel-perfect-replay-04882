# Social Waale - High-Performance Digital Marketing Agency & CMS

This project is organized into two independent directories: **Frontend** and **Backend**.

```
pixel-perfect-replay-04882/
├── frontend/             # Complete React / Vite Frontend Application & UI
│   ├── src/              # All pages, components, hooks, styles, routes
│   ├── public/           # Public static assets, images, icons
│   ├── package.json      # Frontend dependencies & scripts
│   ├── tsconfig.json     # Frontend TypeScript configuration
│   ├── vite.config.ts    # Vite bundler configuration
│   ├── .env.example      # Frontend environment template
│   └── .env              # Configured with VITE_API_URL=http://localhost:5000/api
│
├── backend/              # Independent Express + TypeScript REST API Server
│   ├── src/
│   │   ├── server.ts     # Express application entry point (Port 5000)
│   │   ├── routes/       # Auth, Articles, Services, Homepage, Downloader, Leads, Media
│   │   ├── middleware/   # JWT Bearer authentication & Error handling
│   │   ├── storage/      # Secure scrypt hashing, JSON store engine, CRUD
│   │   ├── models/       # TypeScript interface schemas
│   │   └── test/         # Automated Vitest backend tests
│   ├── data/
│   │   └── cms-store.json# Primary CMS persistent JSON database
│   ├── uploads/          # User-uploaded media and assets
│   ├── package.json      # Backend dependencies & scripts
│   ├── tsconfig.json     # NodeNext TypeScript configuration
│   ├── .env.example      # Backend environment template
│   └── .env              # Configured with PORT=5000 & SESSION_SECRET
│
└── docs/
    └── API_DOCUMENTATION.md  # Comprehensive API endpoint reference
```

---

## Quick Start (Running Both Services)

### 1. Backend Server (Express + TypeScript)
In a terminal window:
```bash
cd backend
npm install
npm run dev
```
- **Backend API Base URL**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

### 2. Frontend Application (Vite + React)
In a second terminal window:
```bash
cd frontend
npm install
npm run dev
```
- **Website & CMS URL**: `http://localhost:8080`

---

## Key Features & Architecture

### Frontend (`frontend/`)
- **Public Website**: Modern landing pages for SEO, Google Ads, Social Media, Branding, Web Development, and Instagram Downloader tools.
- **CMS Admin Suite**: Complete management dashboard for Articles, Services, Homepage, Downloader Tools, Website Leads, and Media Library.
- **Zero Server Secrets**: Communicates purely via `frontend/src/lib/api-client.ts` over REST API with automatic JWT Bearer token authentication.

### Backend (`backend/`)
- **Security**: Memory-hard `scrypt` password hashing, timing-safe equality verification, brute-force rate-limiting, and temporary account lockout protection.
- **REST Endpoints**: Modular Express routers for `/api/auth`, `/api/articles`, `/api/services`, `/api/homepage`, `/api/downloader`, `/api/leads`, `/api/media`, `/api/settings`.
- **Database Engine**: Atomic persistence to `backend/data/cms-store.json`.
- **Downloader Resolver**: Automated Instagram media extraction with graceful fallback.

---

## Detailed API Documentation
See [API_DOCUMENTATION.md](file:///c:/Users/Dell/OneDrive/Desktop/New%20folder/pixel-perfect-replay-04882/docs/API_DOCUMENTATION.md) for full endpoint specifications, request payloads, and response examples.
