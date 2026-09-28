import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import healthRouter from './routes/health.route.js';
import leadRouter from './routes/lead.route.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// API Routes
app.use(config.apiPrefix, healthRouter);
app.use(`${config.apiPrefix}/leads`, leadRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    errors: [],
  });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: err.toString(),
    stack: err.stack,
  });
});

export default app;

