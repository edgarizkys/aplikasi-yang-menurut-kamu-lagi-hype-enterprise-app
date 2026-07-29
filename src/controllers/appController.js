const { tursoClient } = require('../config/database');

// --- Projects Controllers ---

exports.getAllProjects = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        
        const result = await tursoClient.execute({
            sql: 'SELECT * FROM projects WHERE tenant_id = ? LIMIT ? OFFSET ?',
            args: [tenantId, limit, offset]
        });
        
        const countResult = await tursoClient.execute({
            sql: 'SELECT COUNT(*) as total FROM projects WHERE tenant_id = ?',
            args: [tenantId]
        });
        
        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page,
                limit,
                total: countResult.rows[0].total,
                pages: Math.ceil(countResult.rows[0].total / limit)
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const { id } = req.params;
        
        const result = await tursoClient.execute({
            sql: 'SELECT * FROM projects WHERE id = ? AND tenant_id = ?',
            args: [id, tenantId]
        });
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Proyek tidak ditemukan.' });
        }
        
        res.json({ success: true, data: result.rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createProject = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const { name, description, start_date, end_date, status, budget, manager_id } = req.body;
        
        const result = await tursoClient.execute({
            sql: `INSERT INTO projects (tenant_id, name, description, start_date, end_date, status, budget, manager_id) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [tenantId, name, description, start_date, end_date, status, budget, manager_id]
        });
        
        res.status(201).json({
            success: true,
            data: { id: Number(result.lastInsertRowid), ...req.body }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const { id } = req.params;
        const { name, description, start_date, end_date, status, budget, manager_id } = req.body;
        
        const result = await tursoClient.execute({
            sql: `UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ?, status = ?, budget = ?, manager_id = ? 
                  WHERE id = ? AND tenant_id = ?`,
            args: [name, description, start_date, end_date, status, budget, manager_id, id, tenantId]
        });
        
        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Proyek tidak ditemukan atau tidak ada perubahan.' });
        }
        
        res.json({ success: true, data: { id: Number(id), ...req.body } });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const { id } = req.params;
        
        const result = await tursoClient.execute({
            sql: 'DELETE FROM projects WHERE id = ? AND tenant_id = ?',
            args: [id, tenantId]
        });
        
        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Proyek tidak ditemukan.' });
        }
        
        res.json({ success: true, message: 'Proyek berhasil dihapus.' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// --- Tasks Controllers ---

exports.getAllTasks = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        
        const result = await tursoClient.execute({
            sql: 'SELECT * FROM tasks WHERE tenant_id = ? LIMIT ? OFFSET ?',
            args: [tenantId, limit, offset]
        });
        
        const countResult = await tursoClient.execute({
            sql: 'SELECT COUNT(*) as total FROM tasks WHERE tenant_id = ?',
            args: [tenantId]
        });
        
        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page,
                limit,
                total: countResult.rows[0].total,
                pages: Math.ceil(countResult.rows[0].total / limit)
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const { id } = req.params;
        
        const result = await tursoClient.execute({
            sql: 'SELECT * FROM tasks WHERE id = ? AND tenant_id = ?',
            args: [id, tenantId]
        });
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan.' });
        }
        
        res.json({ success: true, data: result.rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const { project_id, name, description, due_date, assigned_to_id, status, priority } = req.body;
        
        const result = await tursoClient.execute({
            sql: `INSERT INTO tasks (tenant_id, project_id, name, description, due_date, assigned_to_id, status, priority) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [tenantId, project_id, name, description, due_date, assigned_to_id, status, priority]
        });
        
        res.status(201).json({
            success: true,
            data: { id: Number(result.lastInsertRowid), ...req.body }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const { id } = req.params;
        const { project_id, name, description, due_date, assigned_to_id, status, priority } = req.body;
        
        const result = await tursoClient.execute({
            sql: `UPDATE tasks SET project_id = ?, name = ?, description = ?, due_date = ?, assigned_to_id = ?, status = ?, priority = ? 
                  WHERE id = ? AND tenant_id = ?`,
            args: [project_id, name, description, due_date, assigned_to_id, status, priority, id, tenantId]
        });
        
        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan atau tidak ada perubahan.' });
        }
        
        res.json({ success: true, data: { id: Number(id), ...req.body } });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const { id } = req.params;
        
        const result = await tursoClient.execute({
            sql: 'DELETE FROM tasks WHERE id = ? AND tenant_id = ?',
            args: [id, tenantId]
        });
        
        if (result.rowsAffected === 0) {
            return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan.' });
        }
        
        res.json({ success: true, message: 'Tugas berhasil dihapus.' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// --- Users Controllers ---

exports.getAllUsers = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        
        const result = await tursoClient.execute({
            sql: 'SELECT * FROM users WHERE tenant_id = ? LIMIT ? OFFSET ?',
            args: [tenantId, limit, offset]
        });
        
        const countResult = await tursoClient.execute({
            sql: 'SELECT COUNT(*) as total FROM users WHERE tenant_id = ?',
            args: [tenantId]
        });
        
        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page,
                limit,
                total: countResult.rows[0].total,
                pages: Math.ceil(countResult.rows[0].total / limit)
            }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const { id } = req.params;
        
        const result = await tursoClient.execute({
            sql: 'SELECT * FROM users WHERE id = ? AND tenant_id = ?',
            args: [id, tenantId]
        });
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
        }
        
        res.json({ success: true, data: result.rows[0] });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const { name, email, role } = req.body;
        
        const result = await tursoClient.execute({
            sql: `INSERT INTO users (tenant_id, name, email, role) 
                  VALUES (?, ?, ?, ?)`,
            args: [tenantId, name, email, role]
        });
        
        res.status(201).json({
            success: true,
            data: { id: Number(result.lastInsertRowid), ...req.body }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
        const { id } = req.params;
        const { name, email, role } = req.body;
        
        const result