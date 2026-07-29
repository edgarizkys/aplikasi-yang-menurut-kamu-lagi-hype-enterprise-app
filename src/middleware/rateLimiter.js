// middleware/rateLimiter.js - Rate Limiting
const rateLimitMap = new Map();

module.exports = function rateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100;

    let record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        record = { count: 1, resetTime: now + windowMs };
    } else {
        record.count += 1;
    }

    rateLimitMap.set(ip, record);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000)); // Unix timestamp

    if (record.count > maxRequests) {
        return res.status(429).json({ error: 'Batas permintaan terlampaui. Coba lagi nanti.' });
    }

    next();
};