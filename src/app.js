import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import db from './db.js'; // Database connection
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();

// --- Middleware ---

// Security headers
app.use(helmet());

// CORS policy
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Adjust for production frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
}));

// Request logging
app.use(morgan('dev'));

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Multi-tenant middleware (Placeholder)
// In a real app, tenantId would come from authentication (e.g., JWT payload)
// For this example, we'll use a header or a default.
app.use((req, res, next) => {
    // For demonstration, use a fixed tenant ID or one from a header
    // In production, this would be derived from the authenticated user's context.
    req.tenantId = req.headers['x-tenant-id'] || process.env.DEFAULT_TENANT_ID || '1';
    if (!req.tenantId) {
        return res.status(400).json({ message: 'Tenant ID missing.' });
    }
    next();
});

// --- API Routes ---
app.get('/', (req, res) => {
    res.send('API Aplikasi Yang Menurut Kamu Lagi Hype Enterprise Project Management berjalan!');
});

app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);

// --- Error Handling Middleware ---
app.use(notFound); // Handle 404 Not Found
app.use(errorHandler); // General error handler

// --- Server Start ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
    console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});