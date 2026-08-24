-- ====================================================================
-- Freewheel Production Database Schema (PostgreSQL / Supabase Ready)
-- ====================================================================

-- 1. USERS & DEV TEAM TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'developer', -- 'admin', 'developer', 'client'
    sub_role VARCHAR(100), -- 'Frontend Lead', 'Backend Specialist', 'Database Architect', 'QA Engineer'
    avatar TEXT,
    password_hash VARCHAR(255) DEFAULT 'admin123',
    hourly_rate DECIMAL(10, 2) DEFAULT 85.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    client VARCHAR(150) NOT NULL,
    service VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'In Progress', -- 'In Progress', 'Under Audit', 'Completed', 'Archived'
    budget DECIMAL(12, 2) DEFAULT 0.00,
    spent DECIMAL(12, 2) DEFAULT 0.00,
    deadline DATE,
    lead_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    dev_team JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TASKS TABLE (Hierarchical: Service -> Layer -> Task)
CREATE TABLE IF NOT EXISTS tasks (
    id VARCHAR(50) PRIMARY KEY,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE CASCADE,
    service_id VARCHAR(100) NOT NULL,
    layer VARCHAR(100) NOT NULL, -- 'Frontend', 'Backend API', 'Database', 'QA & Testing'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL,
    assigned_sub_role VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Todo', -- 'Todo', 'In Progress', 'In Review', 'Done'
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    requested_progress INTEGER DEFAULT 0,
    progress_status VARCHAR(50) DEFAULT 'approved', -- 'approved', 'pending_approval'
    estimated_hours DECIMAL(6, 2) DEFAULT 10.0,
    logged_hours DECIMAL(6, 2) DEFAULT 0.0,
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TIME LOGS TABLE
CREATE TABLE IF NOT EXISTS time_logs (
    id VARCHAR(50) PRIMARY KEY,
    task_id VARCHAR(50) REFERENCES tasks(id) ON DELETE CASCADE,
    user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    hours DECIMAL(6, 2) NOT NULL,
    rate DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    billable BOOLEAN DEFAULT TRUE,
    invoiced BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(50) PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    project_id VARCHAR(50) REFERENCES projects(id) ON DELETE SET NULL,
    client VARCHAR(150) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft', -- 'Draft', 'Sent', 'Paid', 'Overdue'
    due_date DATE NOT NULL,
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PROJECT HISTORY & SHOWCASE TABLE
CREATE TABLE IF NOT EXISTS showcase_projects (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    client VARCHAR(150) NOT NULL,
    completed_date DATE,
    revenue DECIMAL(12, 2) DEFAULT 0.00,
    deliverables JSONB DEFAULT '[]'::jsonb,
    team_members JSONB DEFAULT '[]'::jsonb,
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. INDIVIDUAL TASK STOPWATCH TIMERS
CREATE TABLE IF NOT EXISTS task_timers (
    task_id VARCHAR(50) PRIMARY KEY REFERENCES tasks(id) ON DELETE CASCADE,
    is_running BOOLEAN DEFAULT FALSE,
    elapsed_seconds INTEGER DEFAULT 0,
    start_time BIGINT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR HIGH-PERFORMANCE QUERYING
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_time_logs_task ON time_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_time_logs_user ON time_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project ON invoices(project_id);

-- SEED INITIAL DEV TEAM USERS & AUTH CREDENTIALS
INSERT INTO users (id, name, email, role, sub_role, avatar, password_hash, hourly_rate)
VALUES
('usr_1', 'Krishna Hari I', 'ikrishnaharipro@gmail.com', 'admin', 'Manager', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250', 'admin123', 12500.00),
('usr_2', 'Keshavraj C', 'keshavrajc2006@gmail.com', 'developer', 'Frontend', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', 'dev123', 10500.00),
('usr_3', 'Meenatchisundaram S', 'meenatchisundaram0309@gmail.com', 'developer', 'Database', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250', 'dev123', 11500.00),
('usr_4', 'Mohamed Asif A N', 'mohamedasifan06@gmail.com', 'developer', 'UI/UX Design', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250', 'dev123', 9800.00),
('usr_5', 'Hariprasanth M', 'hariprasanthM60@gmail.com', 'developer', 'Backend', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250', 'dev123', 10900.00),
('usr_6', 'Mukilan P', 'mukil3826@gmail.com', 'developer', 'Backend', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=250', 'dev123', 10800.00),
('usr_7', 'Gunabalan P', 'gunag4659@gmail.com', 'developer', 'DevOps/Deployment', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250', 'dev123', 11200.00),
('usr_8', 'Lakshmana Narayanan S', 'narayananlakshmana5@gmail.com', 'developer', 'Frontend', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250', 'dev123', 10200.00),
('usr_9', 'Sivasankaran E', 'sivasankaranelu2006@gmail.com', 'developer', 'Testing', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250', 'dev123', 9500.00)
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, sub_role = EXCLUDED.sub_role, role = EXCLUDED.role, hourly_rate = EXCLUDED.hourly_rate;
