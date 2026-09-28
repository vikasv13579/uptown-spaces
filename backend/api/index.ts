import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { prisma } from '../src/lib/prisma';
import leadRouter from '../src/routes/lead.route';
import healthRouter from '../src/routes/health.route';

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/health', healthRouter);
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/leads', leadRouter);
app.use('/leads', leadRouter);

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Error]', err?.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Graceful Prisma disconnect on serverless cold start cycles
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default app;
