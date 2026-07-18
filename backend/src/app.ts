import express, { type Express } from 'express';
import { bootstrap, shutdown } from './bootstrap.ts';
import { createHandler } from 'graphql-http/lib/use/express';
import { createExecutableResolvers } from './graphql/resolvers/index.ts';
import { schema } from './graphql/schema.ts';
import { configService } from './services/ConfigService.ts';

export const app: Express = express();

async function main(): Promise<void> {
  const services = await bootstrap();
  const resolvers = createExecutableResolvers(services);
  const port = configService.getNumber('PORT');

  app.all(
    '/graphql',
    createHandler({
      schema,
      rootValue: resolvers,
    }),
  );

  const server = app.listen(port, () => {
    console.log(`Backend is running on http://localhost:${port}/graphql`);
  });

  const gracefulShutdown = async (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await shutdown();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => {
    void gracefulShutdown('SIGINT');
  });

  process.on('SIGTERM', () => {
    void gracefulShutdown('SIGTERM');
  });
}

main().catch((error: unknown) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
