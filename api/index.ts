import app from '../backend/src/app.js';
import { seedSampleDataIfEmpty } from '../backend/src/lib/seed.js';

// Lazy database seed check on Vercel serverless cold-start
seedSampleDataIfEmpty().catch((err) => {
  console.error('[Vercel Serverless] Seed check error:', err);
});

export default app;
