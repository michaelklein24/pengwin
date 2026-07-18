import { ConnectionManager } from './connection/ConnectionManager.ts';
import { mongoConnection } from './connection/MongoConnection.ts';
import { postgresConnection } from './connection/PostgresConnection.ts';
import { MongoWinRepository } from './repository/mongo/MongoWinRepository.ts';
import { PostgresUserRepository } from './repository/postgres/PostgresUserRepository.ts';
import { UserService } from './services/UserService.ts';
import { WinService } from './services/WinService.ts';

export interface AppServices {
  userService: UserService;
  winService: WinService;
}

export const connectionManager = new ConnectionManager([
  mongoConnection,
  postgresConnection,
]);

export async function bootstrap(): Promise<AppServices> {
  await connectionManager.connectAll();

  return {
    userService: new UserService(new PostgresUserRepository(postgresConnection)),
    winService: new WinService(new MongoWinRepository(mongoConnection)),
  };
}

export async function shutdown(): Promise<void> {
  await connectionManager.disconnectAll();
}
