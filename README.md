# snip.ly — Production SaaS URL Shortener

A full-stack, production-ready URL shortener SaaS built on **Next.js 14** (App Router) + **Vercel Serverless Functions**, backed by **Neon PostgreSQL** via **Drizzle ORM**.

---

## Project Structure

```
14URL/
├── backend/                  # Serverless API (deploy to Vercel)
│   ├── api/
│   │   ├── users/
│   │   │   ├── signup.js     # POST /api/users/signup
│   │   │   └── login.js      # POST /api/users/login
│   │   ├── shorten.js        # POST /api/shorten
│   │   ├── codes.js          # GET  /api/codes
│   │   ├── [id].js           # DELETE /api/:id
│   │   └── [shortCode].js    # GET /api/:shortCode  (redirect)
│   ├── middleware/
│   ├── models/
│   ├── services/
│   ├── utils/
│   ├── validation/
│   ├── lib/
│   ├── package.json
│   └── vercel.json
│
├── frontend/                 # Next.js 14 App (deploy to Vercel)
│   ├── app/
│   │   ├── page.tsx          # Landing / hero
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── analytics/page.tsx
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts            # API client
│   │   └── utils.ts
│   ├── types/
│   ├── .env.local            # Local dev env
│   └── vercel.json
│
└── (original Express source — kept for reference)
    ├── routes/
    ├── services/
    ├── model/
    ├── middleware/
    └── index.js
```

---

## API Routes (unchanged from original)

| Method | Path | Auth required | Description |
|--------|------|---------------|-------------|
| POST | `/api/users/signup` | No | Register a new user |
| POST | `/api/users/login` | No | Login → returns JWT |
| POST | `/api/shorten` | Yes | Create a short URL |
| GET | `/api/codes` | Yes | List all user's URLs |
| DELETE | `/api/:id` | Yes | Delete URL by UUID |
| GET | `/api/:shortCode` | No | Redirect to target URL |

---

## Local Development

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) Postgres database

### 1. Run the Backend Locally

The backend serverless functions can be run locally via the **Vercel CLI**:

```bash
cd backend
npm install

# Install Vercel CLI globally (once)
npm install -g vercel

# Run locally (simulates serverless environment)
vercel dev --port 3001
```

Or keep using the original Express server for local dev:

```bash
# In the root 14URL folder
pnpm dev        # starts Express on port 8000
```

### 2. Run the Frontend Locally

```bash
cd frontend
npm install

# Make sure .env.local points to your backend
# NEXT_PUBLIC_API_URL=http://localhost:8000

npm run dev     # starts Next.js on port 3000
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

### Backend (`backend/.env` or Vercel dashboard)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `FRONTEND_URL` | Frontend URL for CORS (e.g. `https://your-app.vercel.app`) |

### Frontend (`frontend/.env.local` or Vercel dashboard)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend URL (e.g. `https://your-backend.vercel.app`) |

---

## Deployment to Vercel

### Step 1 — Deploy the Backend

```bash
cd backend
vercel --prod
```

In the Vercel dashboard → Settings → Environment Variables, add:
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL` (your frontend Vercel URL)

### Step 2 — Deploy the Frontend

```bash
cd frontend
vercel --prod
```

In Vercel dashboard, add:
- `NEXT_PUBLIC_API_URL` → your backend Vercel URL (e.g. `https://snip-backend.vercel.app`)

### Step 3 — Update CORS

Go back to backend Vercel settings → set `FRONTEND_URL` to your frontend Vercel URL (e.g. `https://snip-ly.vercel.app`).

---

## Database Setup

The database schema is already pushed to Neon. To regenerate migrations:

```bash
cd backend
npm run db:push     # pushes schema to Neon (using Drizzle)
npm run db:studio   # opens Drizzle Studio in browser
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |
| Backend runtime | Vercel Serverless Functions (Node.js) |
| ORM | Drizzle ORM |
| Database | Neon PostgreSQL (serverless) |
| Auth | JWT (jsonwebtoken) |
| Password hashing | Node.js crypto (HMAC-SHA256) |
