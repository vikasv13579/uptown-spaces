import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { getHealth } from './controllers/health.controller.js';
import healthRouter from './routes/health.route.js';
import leadRouter from './routes/lead.route.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health route at /health (for direct serverless access)
app.get('/', getHealth);
app.use('/health', healthRouter);

// API Routes with /api/v1 prefix
app.use(`${config.apiPrefix}/health`, healthRouter);
app.use(`${config.apiPrefix}/leads`, leadRouter);

// Also mount under /leads for when Vercel strips /api prefix
app.use('/leads', leadRouter);

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
  });
});

export default app;
