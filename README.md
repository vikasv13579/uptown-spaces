# Uptown Spaces - Lead Management System

A full-stack real estate CRM for managing buyer enquiries, property preferences, follow-up notes, and pipeline stages. The frontend uses React, TypeScript, and Vite. The backend uses Node.js, Express, Prisma, and PostgreSQL.

## Features

- Dashboard with lead and pipeline summaries.
- Lead directory with search, filters, sorting, and pagination.
- Table and Kanban board views.
- Lead details with property preferences and follow-up notes.
- Create, update, and delete lead records.
- Request validation with Zod.

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, React Hook Form, Zod, and Lucide React.

**Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, and Zod.

## Repository Structure

```text
Lead-Management-System/
├── backend/
│   ├── api/                 # Vercel serverless function entry point
│   ├── prisma/              # Prisma schema and migrations
│   └── src/                 # Express app, routes, controllers, and validation
├── frontend/
│   └── src/                 # React pages, components, and API client
├── presentation/            # Project presentation
└── README.md
```

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- PostgreSQL locally or through a hosted provider such as Neon

## Local Setup

### Backend

1. Open a terminal in `backend`:
   ```bash
   cd backend
   npm install
   ```
2. Copy `.env.example` to `.env` and set the database connection string:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://username:password@localhost:5432/lead_management_db?schema=public"
   CORS_ORIGIN="http://localhost:5173"
   ```
3. Generate Prisma Client and apply the development migration:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```
   The local API runs at `http://localhost:5000`.

### Frontend

1. Open a second terminal in `frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Copy `.env.example` to `.env`. For local development, set:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
   Vite serves the app at `http://localhost:5173`.

## Deployment

- **Frontend Vercel project dashboard:** https://vercel.com/vikasv13579s-projects/uptown-spaces-frontend
- **Backend API base URL:** `https://uptown-spaces-orcin.vercel.app/api/v1`
- **Example leads endpoint:** https://uptown-spaces-orcin.vercel.app/api/v1/leads?page=1&limit=10

The frontend URL above is the Vercel project dashboard, not the public website. To get the public website URL, open the Vercel project and copy its Production Domain. In the frontend Vercel project's environment variables, set `VITE_API_BASE_URL` to `https://uptown-spaces-orcin.vercel.app/api/v1`, then redeploy the frontend.

## API Endpoints

All API routes use the `/api/v1` prefix.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Check API health |
| `GET` | `/api/v1/leads` | List leads; supports search, filters, sorting, and pagination |
| `GET` | `/api/v1/leads/stats` | Get dashboard lead and pipeline statistics |
| `GET` | `/api/v1/leads/:id` | Get one lead |
| `POST` | `/api/v1/leads` | Create a lead |
| `PATCH` | `/api/v1/leads/:id` | Update a lead |
| `DELETE` | `/api/v1/leads/:id` | Delete a lead |
| `GET` | `/api/v1/leads/:id/notes` | List notes for a lead |
| `POST` | `/api/v1/leads/:id/notes` | Add a note to a lead |

## License

This project is maintained for Uptown Spaces CRM operations.
