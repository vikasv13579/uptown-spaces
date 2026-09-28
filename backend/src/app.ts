import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import healthRouter from './routes/health.route.js';
import leadRouter from './routes/lead.route.js';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// API Sub-Router
const apiRouter = express.Router();
apiRouter.use('/health', healthRouter);
apiRouter.use('/leads', leadRouter);

// Mount on path prefixes for serverless resilience
app.use(config.apiPrefix, apiRouter);
app.use('/api', apiRouter);
app.use('/', apiRouter);

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

