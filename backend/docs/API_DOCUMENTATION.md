# Social Waale CMS - API Documentation

This document describes all REST API endpoints provided by the independent Express + TypeScript backend service (`backend/`).

## Base URL
- **Local Development**: `http://localhost:5000/api`
- **Port**: `5000` (configurable via `backend/.env`)

---

## Authentication & Authorization
All secured endpoints require an `Authorization` header with a valid Bearer token:
```http
Authorization: Bearer <TOKEN>
```

### 1. Admin Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public (rate-limited, brute-force protected)
- **Request Body**:
```json
{
  "email": "admin@socialwaale.com",
  "password": "<ADMIN_PASSWORD>"
}
```
- **Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "usr-admin-01",
    "email": "admin@socialwaale.com",
    "name": "Naman Sharma",
    "role": "superadmin"
  }
}
```

### 2. Verify Session
- **Endpoint**: `POST /api/auth/verify`
- **Request Body**: `{ "token": "..." }`

### 3. Forgot Password
- **Endpoint**: `POST /api/auth/forgot-password`
- **Request Body**: `{ "email": "admin@socialwaale.com" }`

### 4. Reset Password
- **Endpoint**: `POST /api/auth/reset-password`
- **Request Body**: `{ "token": "...", "newPassword": "..." }`

---

## Articles & Blog CMS
- **`GET /api/articles`**: Retrieve articles. Supports `?includeUnpublished=true`.
- **`GET /api/articles/:id`**: Retrieve article by ID.
- **`GET /api/articles/by-slug/:slug`**: Retrieve article by slug.
- **`POST /api/articles`** *(Auth required)*: Create or update article.
- **`DELETE /api/articles/:id`** *(Auth required)*: Delete article.
- **`POST /api/articles/:id/duplicate`** *(Auth required)*: Duplicate article as draft.
- **`POST /api/articles/bulk`** *(Auth required)*: Bulk publish, draft, archive, or delete.
- **Categories**: `GET /api/articles/categories/all`, `POST /api/articles/categories`, `DELETE /api/articles/categories/:id`
- **Tags**: `GET /api/articles/tags/all`, `POST /api/articles/tags`, `DELETE /api/articles/tags/:id`
- **Authors**: `GET /api/articles/authors/all`, `POST /api/articles/authors`, `DELETE /api/articles/authors/:id`

---

## Services Management CMS
- **`GET /api/services`**: List all service pages.
- **`GET /api/services/:id`**: Get single service page by ID.
- **`GET /api/services/by-slug/:slug`**: Get service page by URL slug.
- **`POST /api/services`** *(Auth required)*: Create or update service page.
- **`POST /api/services/:id/toggle`** *(Auth required)*: Toggle status between published and draft.
- **`POST /api/services/reorder`** *(Auth required)*: Update service display order.
- **`DELETE /api/services/:id`** *(Auth required)*: Delete service page.

---

## Homepage Management CMS
- **`GET /api/homepage`**: Public live homepage content.
- **`GET /api/homepage/cms`** *(Auth required)*: CMS draft homepage + full revision history.
- **`POST /api/homepage/draft`** *(Auth required)*: Save section changes to draft.
- **`POST /api/homepage/publish`** *(Auth required)*: Publish draft changes live with change log note.
- **`POST /api/homepage/restore-revision`** *(Auth required)*: Rollback to any previous snapshot.

---

## Instagram Downloader Tools
- **`POST /api/downloader/resolve`**:
  - Extracts Instagram video, reels, photo, story, audio media streams.
  - Request: `{ "url": "https://www.instagram.com/reel/...", "toolType": "video" }`
  - Response: `{ "success": true, "data": { "media": [ ... ] } }`
- **`GET /api/downloader/pages`**: List all downloader landing pages.
- **`GET /api/downloader/pages/:slug`**: Get downloader page details.
- **`POST /api/downloader/pages`** *(Auth required)*: Save page content & SEO metadata.
- **`POST /api/downloader/pages/:id/publish`** *(Auth required)*: Publish page.
- **`GET /api/downloader/settings`**: API provider and rate limit configurations.
- **`POST /api/downloader/settings`** *(Auth required)*: Update downloader configuration.
- **`GET /api/downloader/stats`**: Performance and request telemetry.
- **`GET /api/downloader/logs`** *(Auth required)*: Real-time request and error logs.

---

## Centralized Website Leads & Forms
- **`POST /api/leads/submit`** *(Public)*:
  - Central ingestion endpoint for all website contact forms, quotation forms, callback requests, and service consultation forms.
  - Features built-in honeypot spam filtering and automatic 60-second duplicate submission throttling.
  - Fields: `fullName`, `phone`, `email`, `service`, `businessName`, `budget`, `message`, `formName`, `formType`, `sourceUrl`, `utmSource`, `utmMedium`, `utmCampaign`.
- **`GET /api/leads`** *(Auth required)*: Query and filter leads.
- **`GET /api/leads/stats`** *(Auth required)*: Total, new, contacted, qualified, converted lead counts.
- **`PUT /api/leads/:id/status`** *(Auth required)*: Transition status (`new`, `contacted`, `follow_up`, `in_progress`, `converted`, `rejected`).
- **`PUT /api/leads/:id/assign`** *(Auth required)*: Assign lead to sales team member.
- **`POST /api/leads/:id/notes`** *(Auth required)*: Add timestamped audit note.
- **`DELETE /api/leads/:id`** *(Auth required)*: Delete lead record.
- **`POST /api/leads/bulk`** *(Auth required)*: Bulk update or delete leads.

---

## Media Library
- **`GET /api/media`**: List uploaded media assets.
- **`POST /api/media/upload`** *(Auth required)*: Multipart form-data file upload (images, banners, logos).
- **`DELETE /api/media/:id`** *(Auth required)*: Delete media asset.

---

## Site Settings & Redirects
- **`GET /api/settings`**: Site-wide configuration.
- **`POST /api/settings`** *(Auth required)*: Update settings.
- **`GET /api/settings/redirects`**: Active 301/302 redirects.
- **`POST /api/settings/redirects`** *(Auth required)*: Add redirect rule.
- **`DELETE /api/settings/redirects/:id`** *(Auth required)*: Remove redirect.
