import { afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.mock('dotenv', () => ({
    __esModule: true,
    default: {
        config: (): { parsed: undefined } => ({ parsed: undefined }),
    },
}));

describe('ConfigService', () => {
    let ConfigService: typeof import('./ConfigService.ts').default;
    let ConfigurationError: typeof import('./ConfigService.ts').ConfigurationError;
    let configService: InstanceType<typeof ConfigService>;
    const originalEnv: NodeJS.ProcessEnv = { ...process.env };

    const SUPABASE_URL_VALUE: string = 'https://test.supabase.co';
    const MONGO_DATA_API_URL_VALUE: string = 'https://test.mongo.api';
    const PORT_VALUE: string = '3000';
    const JWT_SECRET_VALUE: string = 'test-jwt-secret';
    const DEFAULT_STRING_VALUE: string = 'fallback';
    const DEFAULT_NUMBER_VALUE: number = 1000;
    const DEFAULT_BOOLEAN_VALUE: boolean = false;

    function seedValidEnv(): void {
        process.env.SUPABASE_URL = SUPABASE_URL_VALUE;
        process.env.MONGO_DATA_API_URL = MONGO_DATA_API_URL_VALUE;
        process.env.PORT = PORT_VALUE;
        process.env.JWT_SECRET = JWT_SECRET_VALUE;
    }

    function restoreEnv(): void {
        for (const key of Object.keys(process.env)) {
            if (!(key in originalEnv)) {
                delete process.env[key];
            }
        }
        for (const [key, value] of Object.entries(originalEnv)) {
            if (value === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = value;
            }
        }
    }

    beforeAll(async () => {
        process.env.SUPABASE_URL = SUPABASE_URL_VALUE;
        process.env.MONGO_DATA_API_URL = MONGO_DATA_API_URL_VALUE;
        const mod: typeof import('./ConfigService.ts') = await import('./ConfigService.ts');
        ConfigService = mod.default;
        ConfigurationError = mod.ConfigurationError;
    });

    beforeEach(() => {
        seedValidEnv();
        configService = new ConfigService();
    });

    afterEach(() => {
        restoreEnv();
        jest.restoreAllMocks();
    });

    describe('ConfigService Unit Tests', () => {
        test('ConfigService.getString should return the string value when the key is set', () => {
            // Act
            const value: string = configService.getString('JWT_SECRET');

            // Assert
            expect(value).toBe(JWT_SECRET_VALUE);
        });

        test('ConfigService.getString should throw ConfigurationError when the key is undefined', () => {
            // Arrange
            delete process.env.JWT_SECRET;

            // Act & Assert
            expect(() => {
                configService.getString('JWT_SECRET');
            }).toThrow(ConfigurationError);
            expect(() => {
                configService.getString('JWT_SECRET');
            }).toThrow('Missing required string value for key "JWT_SECRET"');
        });

        test('ConfigService.getString should throw ConfigurationError when the key is an empty string', () => {
            // Arrange
            process.env.JWT_SECRET = '';

            // Act & Assert
            expect(() => {
                configService.getString('JWT_SECRET');
            }).toThrow(ConfigurationError);
            expect(() => {
                configService.getString('JWT_SECRET');
            }).toThrow('Missing required string value for key "JWT_SECRET"');
        });

        test('ConfigService.getString should return the default value when the key is undefined', () => {
            // Arrange
            delete process.env.JWT_SECRET;

            // Act
            const value: string = configService.getString('JWT_SECRET', DEFAULT_STRING_VALUE);

            // Assert
            expect(value).toBe(DEFAULT_STRING_VALUE);
        });

        test('ConfigService.getString should return the default value when the key is an empty string', () => {
            // Arrange
            process.env.JWT_SECRET = '';

            // Act
            const value: string = configService.getString('JWT_SECRET', DEFAULT_STRING_VALUE);

            // Assert
            expect(value).toBe(DEFAULT_STRING_VALUE);
        });

        test('ConfigService.getString should return the env value when the key is set even if a default is provided', () => {
            // Act
            const value: string = configService.getString('JWT_SECRET', DEFAULT_STRING_VALUE);

            // Assert
            expect(value).toBe(JWT_SECRET_VALUE);
        });

        test('ConfigService.getNumber should return the parsed number when the value is a valid numeric string', () => {
            // Act
            const value: number = configService.getNumber('PORT');

            // Assert
            expect(value).toBe(3000);
        });

        test('ConfigService.getNumber should throw ConfigurationError when the key is undefined', () => {
            // Arrange
            delete process.env.PORT;

            // Act & Assert
            expect(() => {
                configService.getNumber('PORT');
            }).toThrow(ConfigurationError);
            expect(() => {
                configService.getNumber('PORT');
            }).toThrow('Missing required number value for key "PORT"');
        });

        test('ConfigService.getNumber should throw ConfigurationError when the key is an empty string', () => {
            // Arrange
            process.env.PORT = '';

            // Act & Assert
            expect(() => {
                configService.getNumber('PORT');
            }).toThrow(ConfigurationError);
            expect(() => {
                configService.getNumber('PORT');
            }).toThrow('Missing required number value for key "PORT"');
        });

        test('ConfigService.getNumber should throw ConfigurationError when the value cannot be parsed into a valid number', () => {
            // Arrange
            process.env.PORT = 'not-a-number';

            // Act & Assert
            expect(() => {
                configService.getNumber('PORT');
            }).toThrow(ConfigurationError);
            expect(() => {
                configService.getNumber('PORT');
            }).toThrow('Value for key "PORT" cannot be parsed into a valid number');
        });

        test('ConfigService.getNumber should return the default value when the key is undefined', () => {
            // Arrange
            delete process.env.PORT;

            // Act
            const value: number = configService.getNumber('PORT', DEFAULT_NUMBER_VALUE);

            // Assert
            expect(value).toBe(DEFAULT_NUMBER_VALUE);
        });

        test('ConfigService.getNumber should return the default value when the key is an empty string', () => {
            // Arrange
            process.env.PORT = '';

            // Act
            const value: number = configService.getNumber('PORT', DEFAULT_NUMBER_VALUE);

            // Assert
            expect(value).toBe(DEFAULT_NUMBER_VALUE);
        });

        test('ConfigService.getNumber should return the parsed env value when the key is set even if a default is provided', () => {
            // Arrange
            process.env.PORT = '8080';

            // Act
            const value: number = configService.getNumber('PORT', DEFAULT_NUMBER_VALUE);

            // Assert
            expect(value).toBe(8080);
        });

        test('ConfigService.getNumber should throw ConfigurationError when the value is invalid even if a default is provided', () => {
            // Arrange
            process.env.PORT = 'not-a-number';

            // Act & Assert
            expect(() => {
                configService.getNumber('PORT', DEFAULT_NUMBER_VALUE);
            }).toThrow(ConfigurationError);
            expect(() => {
                configService.getNumber('PORT', DEFAULT_NUMBER_VALUE);
            }).toThrow('Value for key "PORT" cannot be parsed into a valid number');
        });

        test('ConfigService.getBoolean should return true when the value is "true"', () => {
            // Arrange
            process.env.JWT_SECRET = 'true';

            // Act
            const value: boolean = configService.getBoolean('JWT_SECRET');

            // Assert
            expect(value).toBe(true);
        });

        test('ConfigService.getBoolean should return true when the value is "1"', () => {
            // Arrange
            process.env.JWT_SECRET = '1';

            // Act
            const value: boolean = configService.getBoolean('JWT_SECRET');

            // Assert
            expect(value).toBe(true);
        });

        test('ConfigService.getBoolean should return false when the value is "false"', () => {
            // Arrange
            process.env.JWT_SECRET = 'false';

            // Act
            const value: boolean = configService.getBoolean('JWT_SECRET');

            // Assert
            expect(value).toBe(false);
        });

        test('ConfigService.getBoolean should return false when the value is "0"', () => {
            // Arrange
            process.env.JWT_SECRET = '0';

            // Act
            const value: boolean = configService.getBoolean('JWT_SECRET');

            // Assert
            expect(value).toBe(false);
        });

        test('ConfigService.getBoolean should normalize case and surrounding whitespace', () => {
            // Arrange
            process.env.JWT_SECRET = '  TRUE  ';

            // Act
            const value: boolean = configService.getBoolean('JWT_SECRET');

            // Assert
            expect(value).toBe(true);
        });

        test('ConfigService.getBoolean should throw ConfigurationError when the key is undefined', () => {
            // Arrange
            delete process.env.JWT_SECRET;

            // Act & Assert
            expect(() => {
                configService.getBoolean('JWT_SECRET');
            }).toThrow(ConfigurationError);
            expect(() => {
                configService.getBoolean('JWT_SECRET');
            }).toThrow('Missing required boolean value for key "JWT_SECRET"');
        });

        test('ConfigService.getBoolean should throw ConfigurationError when the key is an empty string', () => {
            // Arrange
            process.env.JWT_SECRET = '';

            // Act & Assert
            expect(() => {
                configService.getBoolean('JWT_SECRET');
            }).toThrow(ConfigurationError);
            expect(() => {
                configService.getBoolean('JWT_SECRET');
            }).toThrow('Missing required boolean value for key "JWT_SECRET"');
        });

        test('ConfigService.getBoolean should throw ConfigurationError when the value is not a recognizable boolean pattern', () => {
            // Arrange
            process.env.JWT_SECRET = 'yes';

            // Act & Assert
            expect(() => {
                configService.getBoolean('JWT_SECRET');
            }).toThrow(ConfigurationError);
            expect(() => {
                configService.getBoolean('JWT_SECRET');
            }).toThrow('Value for key "JWT_SECRET" is not a recognizable boolean pattern');
        });

        test('ConfigService.getBoolean should return the default value when the key is undefined', () => {
            // Arrange
            delete process.env.JWT_SECRET;

            // Act
            const value: boolean = configService.getBoolean('JWT_SECRET', DEFAULT_BOOLEAN_VALUE);

            // Assert
            expect(value).toBe(DEFAULT_BOOLEAN_VALUE);
        });

        test('ConfigService.getBoolean should return the default value when the key is an empty string', () => {
            // Arrange
            process.env.JWT_SECRET = '';

            // Act
            const value: boolean = configService.getBoolean('JWT_SECRET', DEFAULT_BOOLEAN_VALUE);

            // Assert
            expect(value).toBe(DEFAULT_BOOLEAN_VALUE);
        });

        test('ConfigService.getBoolean should return the parsed env value when the key is set even if a default is provided', () => {
            // Arrange
            process.env.JWT_SECRET = 'true';

            // Act
            const value: boolean = configService.getBoolean('JWT_SECRET', DEFAULT_BOOLEAN_VALUE);

            // Assert
            expect(value).toBe(true);
        });

        test('ConfigService.getBoolean should throw ConfigurationError when the value is invalid even if a default is provided', () => {
            // Arrange
            process.env.JWT_SECRET = 'yes';

            // Act & Assert
            expect(() => {
                configService.getBoolean('JWT_SECRET', DEFAULT_BOOLEAN_VALUE);
            }).toThrow(ConfigurationError);
            expect(() => {
                configService.getBoolean('JWT_SECRET', DEFAULT_BOOLEAN_VALUE);
            }).toThrow('Value for key "JWT_SECRET" is not a recognizable boolean pattern');
        });
    });

    describe('ConfigService Integration Tests', () => {
        test('ConfigService should read multiple env types from the same instance', () => {
            // Arrange
            process.env.JWT_SECRET = 'false';
            configService = new ConfigService();

            // Act
            const stringValue: string = configService.getString('JWT_SECRET');
            const numberValue: number = configService.getNumber('PORT');
            const booleanValue: boolean = configService.getBoolean('JWT_SECRET');
            delete process.env.PORT;
            const defaultNumberValue: number = configService.getNumber('PORT', DEFAULT_NUMBER_VALUE);

            // Assert
            expect(stringValue).toBe('false');
            expect(numberValue).toBe(3000);
            expect(booleanValue).toBe(false);
            expect(defaultNumberValue).toBe(DEFAULT_NUMBER_VALUE);
        });
    });
});
