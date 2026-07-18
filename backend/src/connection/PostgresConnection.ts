import pg from 'pg';
import { configService } from '../services/ConfigService.ts';
import type { DatabaseConnection } from './DatabaseConnection.ts';

const { Pool } = pg;

export class PostgresConnection implements DatabaseConnection {
  readonly name = 'postgres';

  private pool: pg.Pool | null = null;

  async connect(): Promise<void> {
    if (this.pool) {
      return;
    }

    this.pool = new Pool({
      connectionString: configService.getString('POSTGRES_URI'),
    });

    await this.pool.query('SELECT 1');
  }

  async disconnect(): Promise<void> {
    if (!this.pool) {
      return;
    }

    await this.pool.end();
    this.pool = null;
  }

  isConnected(): boolean {
    return this.pool !== null;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.pool) {
      return false;
    }

    const table = configService.getString('USERS_TABLE');
    await this.pool.query(`SELECT id FROM ${quoteIdentifier(table)} LIMIT 1`);
    return true;
  }

  getPool(): pg.Pool {
    if (!this.pool) {
      throw new Error('PostgreSQL connection has not been established. Call connect() first.');
    }

    return this.pool;
  }

  getUsersTableName(): string {
    return configService.getString('USERS_TABLE');
  }
}

function quoteIdentifier(name: string): string {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Invalid SQL identifier: ${name}`);
  }

  return `"${name}"`;
}

export const postgresConnection = new PostgresConnection();
