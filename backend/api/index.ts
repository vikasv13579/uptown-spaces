import app from '../src/app';
import { seedSampleDataIfEmpty } from '../src/lib/seed';

seedSampleDataIfEmpty().catch((err) => {
  console.error('[Vercel] Seed check failed:', err?.message || err);
});

export default app;
