import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import initDatabase from './config/database';
import smartRouter from './routes/smart';
import { sendSuccess, sendError } from './utils/responseHelper';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/smart', smartRouter);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  sendSuccess(
    res,
    {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    'Server is running',
  );
});

// 404 Handler
app.use((req: Request, res: Response) => {
  sendError(res, 404, 'The requested resource could not be found.');
});

// Global error handler (must have 4 params!)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);
  sendError(res, 500, 'Internal server error.');
});

// Start the server
async function startServer() {
  try {
    await initDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Database: ${process.env.DB_NAME}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}

startServer();
