import express, { Express } from 'express';

import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

import cors from "cors";
import { corsConfig } from './config/cors';

// Import database connection
import dbConnection from './config/db';
// Import routes
import authRouter from './routes/authRoutes';
import projectRouter from './routes/projectRoutes';


// Connect to the database
dbConnection();

const app: Express = express();

// Cors
app.use(cors(corsConfig));

// Enable JSON parsing for incoming requests
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);

export default app;