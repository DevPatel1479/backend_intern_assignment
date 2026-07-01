import { app } from './app.js';
import { env } from './config/env.js';
import { prisma } from './db/prisma.js';

async function main() {
  await prisma.$connect();

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`Swagger docs on http://localhost:${env.PORT}/api-docs`);
  });
}

main().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
