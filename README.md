# Uptown Spaces - Lead Management System

A full-stack Real Estate CRM application for tracking buyers, properties, follow-up logs, and pipeline conversion stages. Built with React (TypeScript + Vite + Tailwind CSS) on the frontend and Node.js (Express + Prisma + PostgreSQL) on the backend.

---

## Features

- **Dashboard Overview**: Key indicators including total active leads, total pipeline valuation (in Lakh / Cr), closed conversions, and win percentage.
- **Lead Directory & Board**: View leads in a structured data table or interactive pipeline Kanban board.
- **Filter & Search**: Search by name, phone, email, or property location. Filter by Lead Status, Lead Source, and Property Type.
- **Activity & Notes**: Log follow-up notes for each property buyer with full timestamp tracking.
- **Data Validation**: Strict runtime schema validation using Zod for requests and responses.

---

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite (TypeScript)
- **Styling**: Tailwind CSS + Custom Human Design System
- **State & Data Fetching**: TanStack React Query
- **Icons & UI**: Lucide React
- **Forms & Validation**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js + Express (TypeScript)
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Validation**: Zod schema validation middleware

---

## Repository Structure

```text
Lead-Management-System/
├── backend/                # Express REST API & Prisma schema
│   ├── prisma/             # Schema definitions and database migrations
│   ├── src/                # Controllers, routes, validators, middleware
│   └── .env.example        # Environment variables template
├── frontend/               # React Vite web client
│   ├── src/                # Layouts, pages, components, API client
│   └── .env.example        # Frontend environment configuration
└── README.md
```

---

## Prerequisites

Before starting, ensure you have installed:
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher
- **PostgreSQL**: Local PostgreSQL instance or a hosted database service (e.g. Neon DB)

---

## Local Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/vikasv13579/uptown-spaces.git
cd Lead-Management-System
```

---

### 2. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your database connection string and port settings:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://username:password@localhost:5432/lead_management_db?schema=public"
   CORS_ORIGIN="http://localhost:5173"
   ```

4. **Database Migrations & Prisma Setup**:
   Generate the Prisma Client and run migrations to create the database schema:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the Backend Server**:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

---

### 3. Frontend Setup

1. **Open a new terminal window** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Verify the environment setting in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application UI will run on `http://localhost:5173`.

---

## API Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/leads` | Query leads with search, filter, and pagination |
| `GET` | `/api/leads/stats` | Retrieve dashboard KPI counts and pipeline breakdown |
| `GET` | `/api/leads/:id` | Get details for a single lead |
| `POST` | `/api/leads` | Register a new client lead |
| `PATCH` | `/api/leads/:id` | Update lead status or contact information |
| `DELETE` | `/api/leads/:id` | Remove a lead from the CRM |
| `GET` | `/api/leads/:id/notes` | Fetch notes for a lead |
| `POST` | `/api/leads/:id/notes` | Create a new follow-up note |

---

## License

This project is maintained for Uptown Spaces CRM operations.
