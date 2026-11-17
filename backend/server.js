import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';

const app = express();
const port = process.env.PORT || 5000;
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/applications', applicationRoutes);
app.use((error, req, res, next) => {
    console.error(error);
    const message = process.env.NODE_ENV === 'production'
        ? 'Something went wrong on the server'
        : error.message || 'Request failed';
    res.status(500).json({ message });
});

connectDB().then(() => app.listen(port, () => console.log(`JobConnect API running on port ${port}`))).catch((error) => { console.error('MongoDB connection failed:', error.message); process.exit(1); });
