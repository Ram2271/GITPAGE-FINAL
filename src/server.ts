import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db';
import gameRoutes from './routes/mainroutes';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// FIXED: Mount routes at the root so /api/games, /upload, and /download work correctly
app.use(gameRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Gitpage server running live on port ${PORT}`);
});