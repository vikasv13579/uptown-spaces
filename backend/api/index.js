const app = require('../dist/app').default;
const { seedSampleDataIfEmpty } = require('../dist/lib/seed');

seedSampleDataIfEmpty().catch((err) => {
  console.error('[Vercel] Seed check failed:', err?.message || err);
});

module.exports = app;
