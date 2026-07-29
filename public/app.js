// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createClient } from '@libsql/client';
import projectRoutes from './routes/projects.js';
import taskRoutes from './routes/tasks.js';
import userRoutes from './routes/users.js';
import { authenticate } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const TURSO_URL = process.env.TURSO_URL;
const TURSO_TOKEN = process.env.TURSO_TOKEN;

// Database client
const db = createClient({
    url: TURSO_URL,
    authToken: TURSO_TOKEN,
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multi-tenancy middleware (example: extract tenant ID from subdomain or header)
app.use((req, res, next) => {
    // Example: Extract tenant ID from a header 'X-Tenant-ID'
    // In a real app, this would be more sophisticated (subdomain, JWT claim, etc.)
    req.tenantId = req.headers['x-tenant-id'] || 'default_tenant';
    console.log(`Tenant ID: ${req.tenantId}`); // Log for debugging
    next();
});

// Authentication middleware (apply to routes that need protection)
app.use(authenticate);

// Routes
app.use('/api/projects', projectRoutes(db));
app.use('/api/tasks', taskRoutes(db));
app.use('/api/users', userRoutes(db));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', appName: 'Aplikasi Yang Menurut Kamu Lagi Hype Enterprise' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Terjadi kesalahan internal server.';
    res.status(statusCode).json({
        message: message,
        // Optionally include stack trace in development
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
    // Initialize DB schema if not exists
    db.execute(`
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            start_date DATE,
            end_date DATE,
            status TEXT CHECK(status IN ('Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled')),
            budget REAL,
            manager_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT NOT NULL,
            project_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            due_date DATE,
            assigned_to_id INTEGER,
            status TEXT CHECK(status IN ('To Do', 'In Progress', 'Blocked', 'Done')),
            priority TEXT CHECK(priority IN ('Low', 'Medium', 'High', 'Urgent')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tenant_id TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            role TEXT CHECK(role IN ('Project Manager', 'Developer', 'Designer', 'Stakeholder')),
            password_hash TEXT, -- Store hashed passwords
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Add indexes for performance
        CREATE INDEX IF NOT EXISTS idx_projects_tenant_id ON projects(tenant_id);
        CREATE INDEX IF NOT EXISTS idx_tasks_tenant_id ON tasks(tenant_id);
        CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
        CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

        -- Sample Data Insertion (only if tables are empty and for a specific tenant)
        -- In production, use migrations for data seeding.
        -- This is a simplified example.
        INSERT OR IGNORE INTO users (id, tenant_id, name, email, role, password_hash) VALUES (1, 'default_tenant', 'Alice Smith', 'alice@example.com', 'Project Manager', '$2b$10$...'); -- Replace with actual hash
        INSERT OR IGNORE INTO users (id, tenant_id, name, email, role, password_hash) VALUES (2, 'default_tenant', 'Bob Johnson', 'bob@example.com', 'Developer', '$2b$10$...');
        INSERT OR IGNORE INTO users (id, tenant_id, name, email, role, password_hash) VALUES (3, 'default_tenant', 'Carol White', 'carol@example.com', 'Designer', '$2b$10$...');

        INSERT OR IGNORE INTO projects (id, tenant_id, name, description, start_date, end_date, status, budget, manager_id) VALUES (1, 'default_tenant', 'Website Redesign', 'Overhaul company website with new branding and features.', '2023-01-15', '2023-06-30', 'In Progress', 50000, 1);
        INSERT OR IGNORE INTO projects (id, tenant_id, name, description, start_date, end_date, status, budget, manager_id) VALUES (2, 'default_tenant', 'New Product Launch', 'Launch new SaaS product for enterprise clients.', '2023-03-01', '2023-09-30', 'Planning', 150000, 1);

        INSERT OR IGNORE INTO tasks (id, tenant_id, project_id, name, description, due_date, assigned_to_id, status, priority) VALUES (101, 'default_tenant', 1, 'Design UI mockups', 'Create initial UI designs for key website pages.', '2023-02-10', 3, 'Done', 'High');
        INSERT OR IGNORE INTO tasks (id, tenant_id, project_id, name, description, due_date, assigned_to_id, status, priority) VALUES (102, 'default_tenant', 1, 'Develop backend API', 'Build core API services for website data.', '2023-04-01', 2, 'In Progress', 'High');
        INSERT OR IGNORE INTO tasks (id, tenant_id, project_id, name, description, due_date, assigned_to_id, status, priority) VALUES (103, 'default_tenant', 2, 'Market Research', 'Conduct market research for new product features.', '2023-03-15', 1, 'To Do', 'Medium');
    `).catch(err => console.error("Database initialization error:", err));
});

export default app;