// config/database.js
const { createClient } = require('@libsql/client');

const tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL || 'libsql://your-db.turso.io',
    authToken: process.env.TURSO_AUTH_TOKEN || ''
});

async function initializeDatabase() {
    try {
        await tursoClient.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tenant_id TEXT DEFAULT 'default',
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                role TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await tursoClient.execute(`
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tenant_id TEXT DEFAULT 'default',
                name TEXT NOT NULL,
                description TEXT,
                start_date TEXT,
                end_date TEXT,
                status TEXT,
                budget REAL,
                manager_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (manager_id) REFERENCES users(id)
            )
        `);
        
        await tursoClient.execute(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tenant_id TEXT DEFAULT 'default',
                project_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                due_date TEXT,
                assigned_to_id INTEGER,
                status TEXT,
                priority TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id),
                FOREIGN KEY (assigned_to_id) REFERENCES users(id)
            )
        `);
        
        console.log('[DB] Tables ready');
    } catch(e) {
        console.error('DB Error:', e.message);
        // Exit process if critical DB error on startup
        process.exit(1); 
    }
}

module.exports = { tursoClient, initializeDatabase };