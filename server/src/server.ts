import app from './app';
import { env } from './config/env';
import { connectDatabase } from './database/connection';
import http from 'http';
import { initializeSocket } from './socket';

const server = http.createServer(app);

const bootstrap = async (): Promise<void> => {
  await connectDatabase();

  initializeSocket(server);

  server.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
    console.log(`Health check: http://localhost:${env.PORT}/api/health`);
  });
};

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
