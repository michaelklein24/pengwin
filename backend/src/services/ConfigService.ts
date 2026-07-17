import dotenv from 'dotenv';
import path from 'path';

const environment = process.env.NODE_ENV || 'development';

dotenv.config({ path: path.resolve(process.cwd(), `.env.${environment}`) });

export interface Env {
  PORT: string;
  SUPABASE_URL: string;
  MONGO_DATA_API_URL: string;
}

export class ConfigService {
  private readonly env: NodeJS.ProcessEnv;

  constructor() {
    this.env = process.env;
    
    // Fail-fast validation check on server initialization loop
    this.validateRequiredKeys();
  }

  /**
   * Pulls a configuration value as a string. Throws an error if missing.
   */
  getString(key: keyof Env): string {
    const value = this.env[key];
    if (value === undefined || value === '') {
      throw new Error(`Configuration Error: Missing required string value for key "${key}"`);
    }
    return String(value);
  }

  /**
   * Pulls a value and safely converts it to a number.
   */
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

  /**
   * Pulls a value and evaluates it to a boolean.
   * Recognizes common strings like 'true', '1', and 'false'.
   */
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

  /**
   * Loops through critical operational keys to crash the application early
   * if variables are missing before routing any live web requests.
   */
  private validateRequiredKeys(): void {
    const criticalKeys: (keyof Env)[] = [
      'SUPABASE_URL', 
      'MONGO_DATA_API_URL'
    ];

    for (const key of criticalKeys) {
      this.getString(key);
    }
  }
}

// Global initialization singleton instance
export const configService = new ConfigService();