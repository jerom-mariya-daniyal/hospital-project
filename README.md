# Vet-Hub — Hospital Monorepo

A monorepo containing all three components of the Vet-Hub platform for Thanjavur Veterinary Circle.

## Project Structure

```
/hospital
├── backend/       → Express API (Node.js + TypeScript)
├── dashboard/     → Admin dashboard (React + Vite)
└── portal/        → Public portal (Next.js)
```

---

## Getting Started

### 1. Backend — Express API

```bash
cd backend
npm install
npm start          # production
npm run dev        # development (watch mode)
```

> Requires a `.env` file in `backend/` with `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `EMAIL_*` etc.

**Deployment target:** [Render](https://render.com) / [Railway](https://railway.app)

---

### 2. Dashboard — React (Vite)

```bash
cd dashboard
npm install
npm run dev        # development (http://localhost:5173)
npm run build      # production build → dist/
```

**Deployment target:** [Vercel](https://vercel.com)

> Set `VITE_API_URL` in Vercel environment variables to point to your deployed backend.

---

### 3. Portal — Next.js (Public Portal)

```bash
cd portal
npm install
npm run dev        # development (http://localhost:3000)
npm run build      # production build
npm start          # production server
```

**Deployment target:** [Vercel](https://vercel.com)

> Requires a `.env.local` file in `portal/` with:
> - `MONGODB_URI`
> - `NEXTAUTH_SECRET`
> - `NEXTAUTH_URL`

---

## Deployment

| App        | Platform       | Root Directory |
|------------|----------------|----------------|
| `portal`   | Vercel         | `portal/`      |
| `dashboard`| Vercel         | `dashboard/`   |
| `backend`  | Render/Railway | `backend/`     |

When deploying to Vercel, set the **Root Directory** to either `portal` or `dashboard` in the Vercel project settings.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Backend   | Node.js, Express, TypeScript, MongoDB   |
| Dashboard | React 19, Vite, Tailwind CSS v4         |
| Portal    | Next.js 16, NextAuth, Tailwind CSS v4   |
| Database  | MongoDB Atlas                           |
| Storage   | Cloudinary                              |
