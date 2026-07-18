import { MongoClient, type Db } from 'mongodb';
import { configService } from '../services/ConfigService.ts';
import type { DatabaseConnection } from './DatabaseConnection.ts';

export class MongoConnection implements DatabaseConnection {
  readonly name = 'mongodb';

  private client: MongoClient | null = null;
  private db: Db | null = null;

  async connect(): Promise<void> {
    if (this.client) {
      return;
    }

    const uri = configService.getString('MONGO_URI');
    const database = configService.getString('MONGO_DATABASE');

    this.client = new MongoClient(uri);
    await this.client.connect();
    this.db = this.client.db(database);
  }

  async disconnect(): Promise<void> {
    if (!this.client) {
      return;
    }

    await this.client.close();
    this.client = null;
    this.db = null;
  }

  isConnected(): boolean {
    return this.client !== null && this.db !== null;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.db) {
      return false;
    }

    await this.db.command({ ping: 1 });
    return true;
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('MongoDB connection has not been established. Call connect() first.');
    }

    return this.db;
  }

  getWinsCollectionName(): string {
    return configService.getString('MONGO_WINS_COLLECTION');
  }
}

export const mongoConnection = new MongoConnection();
