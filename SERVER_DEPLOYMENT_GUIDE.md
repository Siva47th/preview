# Complete Guide: Hosting Freewheel on a Server with PostgreSQL

This guide explains how to host Freewheel on a server (VPS, Render, Railway, DigitalOcean, Supabase, or AWS) with a **PostgreSQL Database**.

---

## 1. Hosting Architecture Overview

When hosting on a server, your system consists of 3 components:

```
┌─────────────────────────┐       HTTP / REST API       ┌───────────────────────────────┐       TCP / Port 5432       ┌────────────────────────────┐
│   Frontend (React/Vite) │  ─────────────────────────► │  Backend API Server (Node.js) │  ─────────────────────────► │ PostgreSQL Database Server │
│   Static Web Hosting    │  ◄───────────────────────── │  Runs on Port 4000            │  ◄───────────────────────── │ Stores Projects, Tasks...  │
└─────────────────────────┘                             └───────────────────────────────┘                             └────────────────────────────┘
```

1. **Frontend (Vite / React App)**:
   - Hosted on Vercel, Netlify, Cloudflare Pages, or Nginx on your VPS.
2. **Backend API (Node.js + Express)**:
   - Located in the [`server/`](file:///c:/Users/sivas/Downloads/freewheel/server) folder.
   - Runs on your server (port 4000 or custom port).
3. **Database (PostgreSQL)**:
   - Hosted on Supabase, Neon, Railway, or installed directly on your Ubuntu VPS (`apt install postgresql`).

---

## 2. Option A: Free Serverless Deployment (Easiest & Recommended)

### Step 1: Set up PostgreSQL Database on Supabase / Neon
1. Create a free PostgreSQL database at [supabase.com](https://supabase.com) or [neon.tech](https://neon.tech).
2. Open the SQL Editor in Supabase / Neon and run the contents of [`database/schema.sql`](file:///c:/Users/sivas/Downloads/freewheel/database/schema.sql).
3. Copy your PostgreSQL Connection String (`DATABASE_URL`):
   ```
   postgres://postgres:yourpassword@db.xyz.supabase.co:5432/postgres
   ```

### Step 2: Deploy Backend API to Render / Railway
1. Push your repository to GitHub.
2. Connect your repo to [Render.com](https://render.com) or [Railway.app](https://railway.app).
3. Set Root Directory to `server/`.
4. Add Environment Variable:
   - `DATABASE_URL`: Your PostgreSQL connection string.
5. Deploy! Your backend will be live at `https://your-api.onrender.com/api/v1`.

### Step 3: Connect Frontend UI
1. Open the Freewheel app in browser.
2. Click **"Storage & Cloud"** in the top header.
3. Select **"REST API Backend (Express)"** or **"Supabase Serverless DB"**.
4. Enter your backend URL (`https://your-api.onrender.com/api/v1`) or Supabase URL & Key.
5. Click **"Test DB Connection"** to verify connection!

---

## 3. Option B: Hosting on Ubuntu VPS (DigitalOcean / AWS / Linode)

### Step 1: Install PostgreSQL on Ubuntu
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
```

### Step 2: Create PostgreSQL Database & User
```sql
sudo -u postgres psql

CREATE DATABASE freewheel_db;
CREATE USER freewheel_user WITH ENCRYPTED PASSWORD 'SecurePassword123';
GRANT ALL PRIVILEGES ON DATABASE freewheel_db TO freewheel_user;
\q
```

### Step 3: Run SQL Schema
```bash
psql -U freewheel_user -d freewheel_db -f database/schema.sql
```

### Step 4: Start Node Backend Server with PM2
```bash
cd server
npm install
export DATABASE_URL="postgres://freewheel_user:SecurePassword123@localhost:5432/freewheel_db"
npm run start
```
To keep it running continuously on server reboot, use `pm2`:
```bash
sudo npm install -g pm2
pm2 start server.js --name freewheel-backend
pm2 save
pm2 startup
```

---

## 4. Database Schema Summary

The [`database/schema.sql`](file:///c:/Users/sivas/Downloads/freewheel/database/schema.sql) file automatically sets up all required tables:

| Table Name | Description | Key Columns |
| :--- | :--- | :--- |
| `users` | Dev Team & Admin User accounts | `id`, `name`, `email`, `role`, `sub_role`, `hourly_rate` |
| `projects` | Agency Client Projects | `id`, `title`, `client`, `service`, `status`, `budget`, `spent` |
| `tasks` | Hierarchical Kanban Tasks | `id`, `project_id`, `service_id`, `layer`, `title`, `assigned_to` |
| `time_logs` | Hourly Billable Timelogs | `id`, `task_id`, `user_id`, `hours`, `rate`, `date`, `billable` |
| `invoices` | Client Invoices & Billing | `id`, `invoice_number`, `client`, `amount`, `status`, `due_date` |
| `showcase_projects` | Project History & Audit Archive | `id`, `title`, `client`, `revenue`, `deliverables` |
| `task_timers` | Per-Task Stopwatches | `task_id`, `is_running`, `elapsed_seconds` |

---

## 5. Verification & Testing

Once hosted, you can verify your PostgreSQL server database by calling the health endpoint:
```
GET http://your-server-ip:4000/api/v1/health
```
Response:
```json
{
  "status": "online",
  "system": "Freewheel Production Agency Server",
  "version": "1.0.0",
  "databaseDriver": "PostgreSQL",
  "databaseStatus": "Connected to PostgreSQL Database"
}
```
