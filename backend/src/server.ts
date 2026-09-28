import app from './app.js';
import { config } from './config/index.js';
import { seedSampleDataIfEmpty } from './lib/seed.js';

app.listen(config.port, async () => {
  console.log(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
  await seedSampleDataIfEmpty();
});

