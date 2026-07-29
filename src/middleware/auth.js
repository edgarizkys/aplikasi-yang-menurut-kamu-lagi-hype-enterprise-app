// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        // Demo user for unauthenticated access
        req.user = { id: 1, role: 'Project Manager', name: 'Pengguna Demo', tenant_id: 1 }; // Add tenant_id for multi-tenancy
        return next();
    }
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'supersecretkey');
        req.user = { ...decoded, tenant_id: decoded.tenant_id || 1 }; // Ensure tenant_id is set, default to 1 for simplicity
        next();
    } catch(e) {
        console.error('Authentication error:', e.message);
        res.status(401).json({ error: 'Tidak Sah: Token tidak valid atau kadaluarsa.' });
    }
};