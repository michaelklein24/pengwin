import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { IConfigService } from './ConfigService.ts';
import AbstractService from './AbstractService.ts';

export interface IJwtService {
    /*
        throws an error if the token is invalid or expired
        returns void if the token is valid
    */
    validateToken(token: string): void;
    /*
        generates a new token
        returns the token as a string
    */
    generateToken(payload: JwtPayload): string;
    /*
        parses the token and returns the payload
        throws an error if the token is invalid or expired
        returns the payload as a JwtPayload
    */
    parseToken(token: string): JwtPayload;
}

export default class JwtService extends AbstractService implements IJwtService {

    constructor() {
        super();
    }

    /*
    @InheritDoc
    * Validates a JWT token, throws an error if the token is invalid or expired.  If the token is valid, returns void.
    * @param token - The token to validate
    * @returns void
    * @throws {JsonWebTokenError} if the token is invalid
    * @throws {TokenExpiredError} if the token is expired
    */
    public validateToken(token: string): void  {
        const jwtSecret = this.configService.getString('JWT_SECRET');
        jwt.verify(token, jwtSecret);
    }

    public generateToken(payload: JwtPayload): string {
        const jwtSecret = this.configService.getString('JWT_SECRET');
        return jwt.sign(payload, jwtSecret);
    }

    public parseToken(token: string): JwtPayload {
        this.validateToken(token);
        return jwt.decode(token) as JwtPayload;
    }
    
}
