import app from '../backend/src/app';
import { seedSampleDataIfEmpty } from '../backend/src/lib/seed';

// Run seed check without blocking the serverless handler
seedSampleDataIfEmpty().catch((err) => {
  console.error('[Vercel] Seed check failed:', err?.message || err);
});

export default app;
