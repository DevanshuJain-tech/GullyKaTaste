## Gully Ka Taste — Application Specification (Living Doc)

This document is the single source of truth for **what the app is**, **what exists today**, **what is incomplete**, and **the exact steps to finish it** so every feature works end-to-end.

### Status labeling rules used in this doc

- **`{complete}`**: module/feature is complete in both **frontend + backend**, including persistence and API wiring.
- **`complete - frontend`**: UI/UX and client behavior exists, but backend/API/persistence is not implemented.
- **`complete - backend`**: backend capability exists, but frontend does not consume it (rare in this repo today).
- **No label**: partially implemented / placeholder / mock / not started.

---

## Product overview

**Gully Ka Taste** is a street-food discovery app with:

- Vendor discovery (grid + map)
- Vendor detail and menus
- Reels (short-form vendor content)
- Community posts
- User profile + settings
- Vendor onboarding + vendor dashboard
- Authentication via **Auth0** (Google / Universal Login)

**Current reality:** most “app features” exist as UI screens backed by `mockData.ts` and local component state. Backend exists but only supports user bootstrap (`/api/me`) and requires Auth0 API audience configuration.

---

## Architecture overview

### Frontend

- **Stack**: React (Vite) + React Router + Tailwind + Radix UI primitives.
- **Auth**: Auth0 via `@auth0/auth0-react` (Universal Login redirect flow).
- **State**:
  - Global contexts: `LanguageContext`, `ThemeContext`
  - Feature state: local component state (e.g., favorites list, addresses list)
  - Content data: `src/app/data/mockData.ts`

### Backend

- **Stack**: Node.js (Express) + PostgreSQL (`pg`) + Auth0 JWT verification (`jose` + remote JWKS).
- **Current endpoints**:
  - `GET /api/health`
  - `GET /api/me` (requires Auth; upserts a row in `users`)

### Database

- PostgreSQL table: `users`
  - `auth0_sub` unique identity link to Auth0
  - `email`, `full_name`, `picture`
  - `role` (default `user`)
  - timestamps

---

## Authentication, user creation & registration flows

### Auth0 configuration (frontend)

- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID`
- Optional `VITE_AUTH0_AUDIENCE` (needed only when calling backend with access tokens)

### Login flow (Auth0 redirect) — complete - frontend

- Entry points:
  - `OnboardingPage` → Login button
  - `LoginPage` → “Continue with Google”
  - `HamburgerMenu` → Login
- Behavior:
  - redirects to Auth0 Universal Login
  - on return, `ProtectedRoute` gates authenticated routes

### Signup flow (Auth0 redirect + signup hint) — complete - frontend

- Entry points:
  - `OnboardingPage` → Signup
  - `SignupPage` → calls `loginWithRedirect({ screen_hint: "signup" })`

### User bootstrap / provisioning flow — complete - backend (and wired frontend, but depends on Auth0 API config)

- Frontend: `AuthBootstrap` runs after auth and attempts to call backend bootstrap.
- Backend: `GET /api/me` verifies token and upserts a `users` record.

**Important dependency:** This becomes `{complete}` only after you create an Auth0 API (Identifier / Audience) and enable audience usage again.

### Logout flow — complete - frontend

- Implemented via Auth0 `logout({ logoutParams: { returnTo } })` in:
  - `SettingsPage`
  - `ProfileView`
  - `HamburgerMenu`

---

## Route map (React Router)

Defined in `src/app/routes.tsx`:

- Public:
  - `/` (Onboarding)
  - `/login`
  - `/signup`
  - `/help`
  - `/about`
  - `/privacy`
  - `/terms`
  - `*` Not Found
- Protected:
  - `/home`
  - `/vendor/:id`
  - `/reels`, `/reels/create`
  - `/community`, `/community/create`
  - `/profile`, `/profile/edit`, `/profile/addresses`, `/profile/favorites`, `/profile/reviews`
  - `/settings`
  - `/search`
  - `/favorites`
  - `/notifications`
  - `/vendor-dashboard`
  - `/vendor-onboarding`

`ProtectedRoute` uses Auth0 `isAuthenticated`.

---

## Frontend modules (pages)

### Onboarding

- `OnboardingPage` — complete - frontend
  - language selection
  - onboarding slides
  - login/signup CTAs
  - redirects to `/home` if already authenticated

### Auth screens

- `LoginPage` — complete - frontend
- `SignupPage` — complete - frontend

### Home / Discovery

- `HomePage` — complete - frontend
  - vendor discovery grid view
  - map view
  - location permission modal (UI)
  - promotions modal (UI)
  - hamburger menu, navbar, footer, FAB, bottom nav
  - **data source**: `mockVendors` (not API)

### Vendor detail

- `VendorDetailPage` — complete - frontend
  - opens `VendorDetailModal` for vendor
  - **data source**: `mockVendors`

### Reels

- `ReelsPage` — complete - frontend
  - **data source**: `mockReels`
- `CreateReelPage` — complete - frontend
  - uploads local video file (blob URL), generates thumbnail locally
  - “Post” shows alert, no persistence

### Community

- `CommunityPage` — complete - frontend
  - **data source**: `mockCommunityPosts`
- `CreatePostPage` — complete - frontend
  - text + images (blob URLs) + optional geolocation
  - “Post” shows alert, no persistence

### Profile / Account

- `ProfilePage` — complete - frontend (container around `ProfileView`)
- `EditProfilePage` — complete - frontend
  - pre-fills from Auth0 profile
  - **not persisted** to DB
- `SettingsPage` — complete - frontend
  - language toggle, navigation to notifications/help/about/privacy
  - logout

### Favorites / Saved vendors

- `FavoritesPage` — complete - frontend
  - **data source**: mock slice of vendors
- `FavoriteVendorsPage` — (present in routes; verify behavior) — complete - frontend (UI list page expected)

### Notifications

- `NotificationsPage` — complete - frontend
  - mock notifications array

### Saved addresses

- `SavedAddressesPage` — complete - frontend
  - local state addresses list, delete, placeholders for add/edit

### Reviews

- `MyReviewsPage` — complete - frontend
  - local state reviews, placeholder edit

### Search

- `SearchPage` — complete - frontend
  - local search filtering over `mockVendors`

### Vendor onboarding and dashboard

- `VendorOnboardingPage` — complete - frontend
  - 5-step onboarding wizard: basic info, food types, location, photos, menu items
  - currently logs to console; no persistence
- `VendorDashboardPage` — complete - frontend (wrapper)
  - renders `VendorDashboard` component

---

## Frontend modules (components)

### Navigation / Layout components — complete - frontend

- `RootLayout` (providers + outlet + auth bootstrap)
- `Navbar`
- `BottomNav`
- `HamburgerMenu`
- `Footer`

### Auth-related — complete - frontend / complete - backend dependency

- `ProtectedRoute` — complete - frontend
- `AuthBootstrap` — complete - frontend (but becomes fully useful once Auth0 API audience is configured and backend is running)

### Discovery / Vendor — complete - frontend

- `VendorCard`
- `VendorDetailModal`
- `VendorDetailView`
- `MapView` (map-based view; implementation details depend on Google Maps loader usage)
- `FilterBar`
- `LocationPermissionModal`
- `PromotionModal`
- `FloatingActionButton`

### Reels / Community — complete - frontend

- `ReelsView`
- `CommunityView`
- `CommentModal`
- `WriteReview`

### Vendor tools — complete - frontend

- `VendorDashboard`

### UI kit primitives (`src/app/components/ui/*`) — {complete}

These are UI primitives (Radix/shadcn-style). They are self-contained and do not require backend wiring:

- buttons, inputs, dialogs, navigation, menus, etc.

---

## Backend modules

### Server bootstrap — {complete}

- `backend/src/index.js`
  - starts Express server
  - mounts `/api`
  - ensures schema on startup

### Config — {complete}

- `backend/src/config.js`
  - validates required env vars

### Database — {complete}

- `backend/src/db.js`
  - connection pool
  - creates `users` table
  - upserts user on `/api/me`

### Auth middleware — {complete}

- `backend/src/middleware/requireAuth.js`
  - verifies JWT using Auth0 JWKS
  - validates `issuer` and `audience`

### Routes — complete - backend

- `backend/src/routes/user.js`
  - `GET /api/health`
  - `GET /api/me`

---

## Feature-by-feature completeness summary

### Authentication

- Auth0 login/signup/logout: **complete - frontend**
- Backend-protected API access token flow: **complete - backend** (frontend wiring exists but disabled until Auth0 API audience is configured)

### User profile

- View profile UI: **complete - frontend**
- Edit profile UI: **complete - frontend**
- Persist profile to DB: **missing**

### Discovery (vendors)

- Discovery UI + map UI: **complete - frontend**
- Vendor detail UI: **complete - frontend**
- Vendor CRUD + search API: **missing**

### Favorites / saved vendors

- Favorites UI: **complete - frontend**
- Persist favorites per user: **missing**

### Reels

- Reels feed UI: **complete - frontend**
- Upload/create reel UI: **complete - frontend**
- Storage + feed API + moderation: **missing**

### Community posts

- Feed UI: **complete - frontend**
- Create post UI: **complete - frontend**
- Post persistence + media + comments: **missing**

### Reviews

- Review UI pieces: **complete - frontend**
- Persist reviews + aggregate ratings: **missing**

### Notifications

- Notifications UI: **complete - frontend**
- Notification generation/delivery: **missing**

### Addresses

- Addresses UI: **complete - frontend**
- Persist addresses + default address behavior: **missing**

### Vendor onboarding + dashboard

- Onboarding wizard UI: **complete - frontend**
- Dashboard UI shell: **complete - frontend**
- Persist vendor profile, menu, hours, photos; vendor approval states: **missing**

---

## What to do now (completion map)

This is the recommended order to finish the application with minimal rework and maximum stability.

### Phase 0 — unblock the backend auth loop (1 hour)

- Create Auth0 API with Identifier (Audience):
  - `https://gully-ka-taste-api`
- Re-enable audience in frontend `.env`:
  - `VITE_AUTH0_AUDIENCE=https://gully-ka-taste-api`
- Confirm:
  - frontend can call `GET /api/me`
  - DB row is created/updated for the user

### Phase 1 — define the domain model (schema first) (0.5–1 day)

Add tables (minimum viable):

- `vendors`
- `vendor_locations`
- `vendor_photos`
- `vendor_menu_items`
- `favorites` (user ↔ vendor)
- `reels` (+ reel media reference)
- `posts` (+ post media reference)
- `comments` (for posts/reels)
- `reviews` (user ↔ vendor, rating, comment)
- `addresses`
- `notifications` (optional; can be derived initially)

Also add “state” columns:

- vendor onboarding status: `draft|submitted|approved|rejected`
- role/permissions: `user|vendor|admin`

### Phase 2 — backend API surface (1–2 days)

Implement REST endpoints (minimal set first):

- **Users**
  - `GET /api/me` (already)
  - `PATCH /api/me` (update name/phone/preferences)
- **Vendors**
  - `GET /api/vendors` (with filters, pagination)
  - `GET /api/vendors/:id`
  - `POST /api/vendor/onboarding` (submit onboarding payload)
  - `GET /api/vendor/me` (current vendor profile)
- **Favorites**
  - `GET /api/favorites`
  - `POST /api/favorites/:vendorId`
  - `DELETE /api/favorites/:vendorId`

Then second wave:

- **Posts**: create/list
- **Reels**: create/list
- **Reviews**: create/list + aggregate rating updates
- **Addresses**: CRUD

### Phase 3 — frontend wiring (replace mock data) (2–4 days)

Core changes:

- Replace `mockData.ts` usage with API calls for:
  - Home discovery vendors
  - Vendor detail
  - Search
  - Favorites
  - Community feed
  - Reels feed
- Convert create flows to real POST calls:
  - Create post
  - Create reel
  - Write review
  - Vendor onboarding submit
- Persist profile edits:
  - Edit profile page should `PATCH /api/me`

### Phase 4 — media storage strategy (1–2 days)

Decide and implement:

- Option A: store media in S3/R2 and keep URLs in Postgres
- Option B: use a managed service (Cloudinary)

Add:

- signed upload URLs
- server-side validation (file type/size)

### Phase 5 — access control & roles (0.5–1 day)

- Add role enforcement in backend:
  - vendor-only endpoints require vendor role or approved status
- Set role either via:
  - DB role + server authorization (recommended)
  - Auth0 roles/permissions (optional)

### Phase 6 — polish, stability, and “production readiness” (1–3 days)

- Proper error UI for all API calls
- Loading skeletons and empty states
- Pagination for feeds
- Basic rate limiting on backend
- Logging and request IDs
- Minimal tests for auth + core endpoints

---

## Operational notes

### Required running services (local)

- PostgreSQL running on localhost
- Backend: `npm run dev:backend`
- Frontend: `npm run dev`

### Known current limitations

- Most features are UI-only; they do not persist across sessions.
- Auth0 access tokens for backend are disabled until you configure the Auth0 API audience.
- Map and vendor discovery currently use mock locations and mock vendors.

