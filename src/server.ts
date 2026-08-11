import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';

// Import your route files
import gameRoutes from './routes/mainroutes';
// Make sure this path matches exactly where your auth routes are saved!
// If your file is named differently (e.g., authRoutes.ts), update the name here.
import authRoutes from './routes/auth'; 

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// MOUNT ROUTES
// 1. Game routes (/api/games, /upload, /download, etc.)
app.use(gameRoutes);

// 2. Authentication routes (/api/auth/register, /api/auth/login)
app.use('/api/auth', authRoutes); 

// Use Render's dynamic port or default to 5000 locally
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Gitpage server running live on port ${PORT}`);
});
