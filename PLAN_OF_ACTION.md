## Plan of Action — Make Gully Ka Taste Production-Ready (Full SaaS)

This plan upgrades the current repo from a UI-first prototype (mock data, local state) into a **production-ready SaaS** with **dynamic data**, **complete flows**, **secure APIs**, and **deployment readiness**.

### Definitions

- **Done/Production-ready** means:
  - No core app features depend on `mockData.ts`
  - All create/update flows persist in PostgreSQL
  - Auth is Auth0-only, backend validates tokens, RBAC enforced
  - Media uploads are real (not blob URLs)
  - Pagination, error handling, loading states are in place
  - Basic tests exist for critical paths
  - App can be deployed with environment-based config (no hardcoded secrets)

---

## Executive milestones

### Milestone A — Foundation + unblock auth-to-backend (Day 1)

- **Auth0 API / Audience**
  - Create Auth0 API with Identifier: `https://gully-ka-taste-api`
  - Re-enable `VITE_AUTH0_AUDIENCE` in frontend and keep `AUTH0_AUDIENCE` in backend
  - Verify frontend can call `GET /api/me`
- **Environment & config hardening**
  - Consolidate `.env.example` files for frontend and backend
  - Ensure no secrets are committed
- **Backend project structure**
  - Introduce migrations tooling (recommended: `node-pg-migrate` or `drizzle` migrations)
  - Introduce request validation (recommended: `zod`)
  - Introduce structured logging (recommended: `pino`)

Deliverables:
- Auth0 token flow works end-to-end
- Users table populated via `/api/me`

---

## Target architecture (production)

### Backend (Node.js + PostgreSQL)

- **API style**: REST (clean, predictable, versioned at `/api/v1`)
- **Auth**: Auth0 JWT (RS256) verification via JWKS; enforce audience/issuer
- **RBAC**: app-level roles in DB (`user`, `vendor`, `admin`) + backend authorization
- **Data**: PostgreSQL as source of truth; no server in-memory state
- **Media**: external storage (recommended: Cloudinary or S3/R2) + DB stores URLs/metadata

### Frontend (Vite React)

- Replace mock data with API client + query cache
  - Recommended: `@tanstack/react-query`
- Centralize auth-aware API calls (access token + retry + error mapping)
- Harden UI states: loading skeletons, empty states, error toasts

---

## Domain model (PostgreSQL schema)

### Core entities

- **users**
  - `id`, `auth0_sub`, `email`, `full_name`, `picture`, `phone`
  - `role` (`user|vendor|admin`)
  - `created_at`, `updated_at`
- **vendors**
  - `id`, `owner_user_id` (FK users)
  - `stall_name`, `description`, `food_types[]`
  - `phone`, `open_time`, `close_time`
  - `status` (`draft|submitted|approved|rejected`)
  - `created_at`, `updated_at`
- **vendor_locations**
  - `vendor_id`, `address_text`, `lat`, `lng`
- **vendor_photos**
  - `vendor_id`, `url`, `sort_order`
- **menu_items**
  - `vendor_id`, `name`, `price`, `is_veg`, `available`
- **favorites**
  - `user_id`, `vendor_id` (unique pair)
- **reviews**
  - `id`, `user_id`, `vendor_id`, `rating`, `comment`, `created_at`
- **posts**
  - `id`, `user_id`, `content`, `location_text`, `lat`, `lng`, `created_at`
- **post_media**
  - `post_id`, `url`, `type`
- **post_comments**
  - `id`, `post_id`, `user_id`, `comment`, `created_at`
- **reels**
  - `id`, `vendor_id`, `user_id`, `video_url`, `thumbnail_url`, `description`, `created_at`
- **reel_comments**
  - `id`, `reel_id`, `user_id`, `comment`, `created_at`
- **addresses**
  - `id`, `user_id`, `label`, `type`, `address_text`, `lat`, `lng`, `is_default`
- **notifications**
  - `id`, `user_id`, `type`, `title`, `message`, `read_at`, `created_at`

### Indexing (minimum)

- Search:
  - `vendors(stall_name)` (GIN trigram recommended)
  - `menu_items(name)`
- Feed:
  - `posts(created_at)`, `reels(created_at)`
- Geo:
  - optional PostGIS later; initially store lat/lng and do radius filtering in SQL

Deliverable:
- A migration set that can create/drop/upgrade schema cleanly.

---

## Backend API plan (versioned)

Base: `/api/v1`

### Auth / user bootstrap

- `GET /me` — get current user `{complete}`
- `PATCH /me` — update `full_name`, `phone`, preferences

### Vendors (discovery + detail)

- `GET /vendors` — list vendors (filters: veg, foodType, radius, openNow, query, pagination)
- `GET /vendors/:id` — vendor detail (menu, photos, rating)
- `POST /vendor/onboarding/submit` — submit vendor onboarding (owner only)
- `GET /vendor/me` — current vendor profile (owner)
- `PATCH /vendor/me` — edit vendor profile (owner)

### Favorites

- `GET /favorites`
- `POST /favorites/:vendorId`
- `DELETE /favorites/:vendorId`

### Reviews

- `GET /vendors/:id/reviews` (paginated)
- `POST /vendors/:id/reviews`
- `PATCH /reviews/:id` (owner only)
- `DELETE /reviews/:id` (owner/admin)

### Posts (community)

- `GET /posts` (paginated)
- `POST /posts`
- `GET /posts/:id/comments`
- `POST /posts/:id/comments`

### Reels

- `GET /reels` (paginated)
- `POST /reels`
- `GET /reels/:id/comments`
- `POST /reels/:id/comments`

### Addresses

- `GET /addresses`
- `POST /addresses`
- `PATCH /addresses/:id`
- `DELETE /addresses/:id`
- `POST /addresses/:id/default`

### Notifications

- `GET /notifications`
- `POST /notifications/:id/read`

### Media upload

Recommended approach:

- `POST /uploads/sign` → returns signed upload details for Cloudinary/S3
- Client uploads directly to storage provider
- Client sends resulting `url` to create post/reel/vendor photo

Deliverables:
- All endpoints validated (Zod), authorized, and tested.

---

## Frontend wiring plan (replace mock data)

### Core refactors (Day 2–3)

- Add API client:
  - `apiClient.ts` with token injection via `getAccessTokenSilently`
  - standardized error mapping → toast + retry
- Add query caching:
  - `react-query` for vendors, reels, posts, favorites, profile

### Replace mock sources

- `HomePage`
  - replace `mockVendors` with `GET /vendors`
  - implement veg toggle via filter param
  - implement map view with fetched vendors
- `VendorDetailPage`
  - replace `mockVendors.find` with `GET /vendors/:id`
- `SearchPage`
  - use `GET /vendors?query=...`
- `FavoritesPage`
  - use `GET /favorites`
  - add toggle favorite in vendor cards
- `CommunityPage`
  - use `GET /posts`
- `CreatePostPage`
  - real media upload + `POST /posts`
- `ReelsPage`
  - use `GET /reels`
- `CreateReelPage`
  - real video upload + `POST /reels`
- `MyReviewsPage`
  - use `GET /me` + `GET /reviews?user=me` OR store in UI from `/me` relationships
- `SavedAddressesPage`
  - use `GET /addresses` + CRUD
- `NotificationsPage`
  - use `GET /notifications`
- `VendorOnboardingPage`
  - submit to backend and enforce status logic
- `VendorDashboard`
  - use vendor endpoints for menu, photos, stats (initially basic)

Deliverable:
- No user-facing pages depend on `mockData.ts` anymore.

---

## Flows to complete (end-to-end)

### Flow 1: Auth → user provisioning → app entry

- Auth0 login/signup
- `AuthBootstrap` calls `/me` (creates user row)
- Conditional navigation:
  - regular user → `/home`
  - vendor with `status=submitted/approved` → vendor dashboard link enabled

### Flow 2: Vendor onboarding → vendor profile visible in discovery

- Vendor completes onboarding wizard
- Backend stores vendor profile, menu, photos, location
- Vendor appears in `/vendors` list

### Flow 3: Discovery → vendor detail → favorite → review

- Browse vendors (filters)
- Open vendor detail
- Favorite/unfavorite persists
- Create review persists and updates rating aggregates

### Flow 4: Community posts

- Create post with optional media + location
- Posts appear in feed
- Comments work

### Flow 5: Reels

- Vendor/user uploads reel video + thumbnail
- Reels appear in feed
- Comments work

### Flow 6: Addresses and notifications

- Addresses CRUD + default address
- Notifications from system events (MVP: DB-stored notifications)

---

## Quality, security, and production hardening

### Backend

- CORS allowlist (prod domains only)
- Rate limiting (basic)
- Helmet security headers
- Request validation on every input
- Centralized error handler
- Structured logging (pino) + request IDs
- Health checks + readiness checks

### Frontend

- Global error boundaries
- Loading and empty states everywhere
- Remove hard-coded placeholders (locations, counts, etc.)
- Ensure logout/login works across all routes

### Testing

- Backend:
  - unit tests for auth middleware (mock JWKS)
  - integration tests for key endpoints using test DB
- Frontend:
  - smoke tests for routing/auth guards

---

## Deployment plan (make it live)

### Environment strategy

- Frontend:
  - Vite env vars for Auth0 + API base URL
- Backend:
  - DATABASE_URL, Auth0 issuer/audience

### Suggested deployment (simple SaaS)

- Frontend: Vercel / Netlify
- Backend: Render / Fly.io / Railway
- DB: managed Postgres (Railway/Neon/Supabase)
- Media: Cloudinary (fastest to ship) or S3/R2

### Cutover checklist

- Enable Auth0 production callbacks/allowed origins
- Configure CORS allowlist
- Run migrations on production DB
- Seed minimal demo content (optional)
- Monitor logs and error rates

---

## Delivery sequencing (how I will implement)

1. Add migrations + request validation + logging
2. Implement the full schema
3. Build vendor APIs → wire Home/Search/VendorDetail first
4. Build favorites + reviews APIs → wire UI
5. Build posts APIs → wire UI
6. Add media upload flow (Cloudinary/S3) → wire create screens
7. Build reels APIs → wire UI
8. Addresses + notifications APIs → wire UI
9. Polish + tests + deploy docs

---

## Notes / Constraints in current repo

- Many screens are visually complete but run on `mockData.ts` and local state.
- Backend currently only supports `/api/me`; it will be expanded and versioned.
- Audience-based access tokens must be enabled in Auth0 for backend calls.

