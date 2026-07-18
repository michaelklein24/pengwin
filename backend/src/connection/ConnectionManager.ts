import type { DatabaseConnection } from './DatabaseConnection.ts';

export class ConnectionManager {
  private readonly connections: DatabaseConnection[];

  constructor(connections: DatabaseConnection[]) {
    this.connections = connections;
  }

  async connectAll(): Promise<void> {
    for (const connection of this.connections) {
      await connection.connect();
      const healthy = await connection.healthCheck();

      if (!healthy) {
        throw new Error(`Failed health check for ${connection.name} connection`);
      }
    }
  }

  async disconnectAll(): Promise<void> {
    for (const connection of [...this.connections].reverse()) {
      await connection.disconnect();
    }
  }

  getConnections(): DatabaseConnection[] {
    return [...this.connections];
  }
}
