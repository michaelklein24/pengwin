import JwtService from "./JwtService.ts";
import type { IConfigService } from "./ConfigService.ts";
import jwt, { JsonWebTokenError, TokenExpiredError, type JwtPayload } from 'jsonwebtoken';
import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';

type GetStringFn = (key: string) => string;

describe("JwtService", () => {
    let jwtService: JwtService;
    let mockConfigService: IConfigService;

    const JWT_SECRET_CONFIG_KEY: 'JWT_SECRET' = 'JWT_SECRET';
    const JWT_SECRET_CONFIG_VALUE: string = 'this-is-a-test-secret-for-jwt-signing';
    const JWT_PAYLOAD: JwtPayload = { sub: '12345' };
    const VALID_TOKEN: string = jwt.sign(JWT_PAYLOAD, JWT_SECRET_CONFIG_VALUE);
    const EXPIRED_TOKEN: string = jwt.sign(
        { ...JWT_PAYLOAD, exp: Math.floor(Date.now() / 1000) - 60 },
        JWT_SECRET_CONFIG_VALUE,
    );
    const INVALID_TOKEN: string = `${VALID_TOKEN}invalid`;

    beforeEach(() => {
        mockConfigService = {
            getString: jest.fn<GetStringFn>().mockReturnValue(JWT_SECRET_CONFIG_VALUE),
            getNumber: jest.fn(),
            getBoolean: jest.fn(),
        } as IConfigService;
        jwtService = new JwtService(mockConfigService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("JwtService Unit Tests", () => {
        beforeEach(() => {
            jest.spyOn(jwt, 'sign').mockImplementation(() => VALID_TOKEN);
            jest.spyOn(jwt, 'verify').mockImplementation(() => JWT_PAYLOAD);
            jest.spyOn(jwt, 'decode').mockImplementation(() => JWT_PAYLOAD);
        });

        test('JwtService.generateToken should use the JWT_SECRET config as the secret for jwt.sign', () => {
            // Act
            jwtService.generateToken(JWT_PAYLOAD);

            // Assert
            expect(mockConfigService.getString).toHaveBeenCalledWith(JWT_SECRET_CONFIG_KEY);
        });

        test('JwtService.generateToken should invoke jwt.sign', () => {
            // Arrange
            const signSpy: jest.SpiedFunction<typeof jwt.sign> = jest.spyOn(jwt, 'sign');

            // Act
            jwtService.generateToken(JWT_PAYLOAD);

            // Assert — use mock.calls to avoid jsonwebtoken's 4-arg callback overload typing
            expect(signSpy.mock.calls[0]).toEqual([JWT_PAYLOAD, JWT_SECRET_CONFIG_VALUE]);
        });

        test('JwtService.generateToken should return the token from jwt.sign', () => {
            // Act
            const token: string = jwtService.generateToken(JWT_PAYLOAD);

            // Assert
            expect(token).toBe(VALID_TOKEN);
        });

        test('JwtService.validateToken should use the JWT_SECRET config as the secret for jwt.verify', () => {
            // Act
            jwtService.validateToken(VALID_TOKEN);

            // Assert
            expect(mockConfigService.getString).toHaveBeenCalledWith(JWT_SECRET_CONFIG_KEY);
        });

        test('JwtService.validateToken should invoke jwt.verify', () => {
            // Arrange
            const verifySpy: jest.SpiedFunction<typeof jwt.verify> = jest.spyOn(jwt, 'verify');

            // Act
            jwtService.validateToken(VALID_TOKEN);

            // Assert
            expect(verifySpy).toHaveBeenCalledWith(VALID_TOKEN, JWT_SECRET_CONFIG_VALUE);
        });

        test('JwtService.parseToken should invoke JwtService.validateToken', () => {
            // Arrange
            const validateTokenSpy: jest.SpiedFunction<typeof jwtService.validateToken> = jest.spyOn(
                jwtService,
                'validateToken',
            );
            validateTokenSpy.mockImplementation(() => {
                return;
            });

            // Act
            jwtService.parseToken(VALID_TOKEN);

            // Assert
            expect(validateTokenSpy).toHaveBeenCalledWith(VALID_TOKEN);
        });

        test('JwtService.parseToken should invoke jwt.decode', () => {
            // Arrange
            const decodeSpy: jest.SpiedFunction<typeof jwt.decode> = jest.spyOn(jwt, 'decode');

            // Act
            jwtService.parseToken(VALID_TOKEN);

            // Assert
            expect(decodeSpy).toHaveBeenCalledWith(VALID_TOKEN);
        });

        test('JwtService.parseToken should return the payload from jwt.decode', () => {
            // Act
            const payload: JwtPayload = jwtService.parseToken(VALID_TOKEN);

            // Assert
            expect(payload).toEqual(JWT_PAYLOAD);
        });
    });

    describe("JwtService Integration Tests", () => {
        test('JwtService.generateToken should generate and return a JWT token', () => {
            // Act
            const token: string = jwtService.generateToken(JWT_PAYLOAD);

            // Assert
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
            expect(jwt.verify(token, JWT_SECRET_CONFIG_VALUE)).toMatchObject(JWT_PAYLOAD);
        });

        test('JwtService.validateToken should not return anything if the token is valid', () => {
            // Act
            const result: void = jwtService.validateToken(VALID_TOKEN);

            // Assert
            expect(result).toBeUndefined();
        });

        test('JwtService.validateToken should throw JsonWebTokenError if the token is invalid', () => {
            // Act & Assert
            expect(() => {
                jwtService.validateToken(INVALID_TOKEN);
            }).toThrow(JsonWebTokenError);
        });

        test('JwtService.validateToken should throw TokenExpiredError if the token is expired', () => {
            // Act & Assert
            expect(() => {
                jwtService.validateToken(EXPIRED_TOKEN);
            }).toThrow(TokenExpiredError);
        });

        test('JwtService.parseToken should return the payload from the token if the token is valid', () => {
            // Act
            const payload: JwtPayload = jwtService.parseToken(VALID_TOKEN);

            // Assert
            expect(payload).toMatchObject(JWT_PAYLOAD);
        });
    });
});
