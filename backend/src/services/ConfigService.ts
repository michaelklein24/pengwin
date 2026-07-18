import dotenv from 'dotenv';
import path from 'path';

const environment = process.env.NODE_ENV || 'development';

dotenv.config({ path: path.resolve(process.cwd(), `.env.${environment}`) });

export interface Env {
  PORT: string;
  MONGO_URI: string;
  MONGO_DATABASE: string;
  MONGO_WINS_COLLECTION: string;
  POSTGRES_URI: string;
  USERS_TABLE: string;
}

export class ConfigService {
  private readonly env: NodeJS.ProcessEnv;

  constructor() {
    this.env = process.env;

    this.validateRequiredKeys();
  }

  getString(key: keyof Env): string {
    const value = this.env[key];
    if (value === undefined || value === '') {
      throw new Error(`Configuration Error: Missing required string value for key "${key}"`);
    }
    return String(value);
  }

  getNumber(key: keyof Env): number {
    const value = this.env[key];
    if (value === undefined || value === '') {
      throw new Error(`Configuration Error: Missing required number value for key "${key}"`);
    }

    const parsed = Number(value);
    if (isNaN(parsed)) {
      throw new Error(`Configuration Error: Value for key "${key}" cannot be parsed into a valid number`);
    }
    return parsed;
  }

  getBoolean(key: keyof Env): boolean {
    const value = this.env[key];
    if (value === undefined || value === '') {
      throw new Error(`Configuration Error: Missing required boolean value for key "${key}"`);
    }

    const normalized = String(value).toLowerCase().trim();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0') return false;

    throw new Error(`Configuration Error: Value for key "${key}" is not a recognizable boolean pattern`);
  }

  private validateRequiredKeys(): void {
    const criticalKeys: (keyof Env)[] = [
      'MONGO_URI',
      'MONGO_DATABASE',
      'MONGO_WINS_COLLECTION',
      'POSTGRES_URI',
      'USERS_TABLE',
    ];

    for (const key of criticalKeys) {
      this.getString(key);
    }
  }
}

export const configService = new ConfigService();
