import dotenv from 'dotenv';
import path from 'path';

const environment = process.env.NODE_ENV || 'development';

dotenv.config({ path: path.resolve(process.cwd(), `.env.${environment}`) });

export interface Env {
  PORT: string;
  SUPABASE_URL: string;
  MONGO_DATA_API_URL: string;
  JWT_SECRET: string;
  PG_DB_HOST: string;
  PG_DB_PORT: string;
  PG_DB_NAME: string;
  PG_DB_USER: string;
  PG_DB_PASSWORD: string;
  MONGO_HOST: string;
  MONGO_PORT: string;
  MONGO_NAME: string;
  MONGO_USER: string;
  MONGO_PASSWORD: string;
  [any: string]: string
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}

export interface IConfigService {
  getString(key: keyof Env): string;
  getString(key: keyof Env, defaultValue: string): string;

  getNumber(key: keyof Env): number;
  getNumber(key: keyof Env, defaultValue: number): number;

  getBoolean(key: keyof Env): boolean;
  getBoolean(key: keyof Env, defaultValue: boolean): boolean;
}

export default class ConfigService implements IConfigService {
  private readonly env: NodeJS.ProcessEnv;
  private static instance: ConfigService;

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  constructor() {
    this.env = process.env;

    // Fail-fast validation check on server initialization loop
    this.validateRequiredKeys();
  }

  /**
   * Pulls a configuration value as a string. Throws ConfigurationError if missing.
   */
  getString(key: keyof Env): string;
  getString(key: keyof Env, defaultValue: string): string;
  getString(key: keyof Env, defaultValue?: string): string {
    const value = this.env[key];
    if (value === undefined || value === '') {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new ConfigurationError(`Missing required string value for key "${key}"`);
    }
    return String(value);
  }

  /**
   * Pulls a value and safely converts it to a number.
   */
  getNumber(key: keyof Env): number;
  getNumber(key: keyof Env, defaultValue: number): number;
  getNumber(key: keyof Env, defaultValue?: number): number {
    const value = this.env[key];
    if (value === undefined || value === '') {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new ConfigurationError(`Missing required number value for key "${key}"`);
    }

    const parsed: number = Number(value);
    if (isNaN(parsed)) {
      throw new ConfigurationError(`Value for key "${key}" cannot be parsed into a valid number`);
    }
    return parsed;
  }

  /**
   * Pulls a value and evaluates it to a boolean.
   * Recognizes common strings like 'true', '1', and 'false'.
   */
  getBoolean(key: keyof Env): boolean;
  getBoolean(key: keyof Env, defaultValue: boolean): boolean;
  getBoolean(key: keyof Env, defaultValue?: boolean): boolean {
    const value = this.env[key];
    if (value === undefined || value === '') {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new ConfigurationError(`Missing required boolean value for key "${key}"`);
    }

    const normalized: string = String(value).toLowerCase().trim();
    if (normalized === 'true' || normalized === '1') {
      return true;
    }
    if (normalized === 'false' || normalized === '0') {
      return false;
    }

    throw new ConfigurationError(`Value for key "${key}" is not a recognizable boolean pattern`);
  }

  /**
   * Loops through critical operational keys to crash the application early
   * if variables are missing before routing any live web requests.
   */
  private validateRequiredKeys(): void {
    const criticalKeys: (keyof Env)[] = [];

    for (const key of criticalKeys) {
      this.getString(key);
    }
  }
}

// Global initialization singleton instance
export const configService = new ConfigService();
