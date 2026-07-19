import type { JwtPayload } from "jsonwebtoken";
import type { IJwtService } from "./JwtService.ts";
import AbstractService from "./AbstractService.ts";
import UserRegisteredEvent from "../events/UserRegisteredEvent.ts";
import UserModel from "../models/UserModel.ts";
import type { UserRepository } from "../repositories/UserRepository.ts";

export interface IAuthService {
    /*
    * Register a new user

    * @param name - The name of the user
    * @param email - The email of the user
    * @param password - The password of the user
    * @returns The user
    */
    register(name: string, email: string, password: string): Promise<string>;
    /*
    * Login a user

    * @param email - The email of the user
    * @param password - The password of the user
    * @returns The token
    */
    login(email: string, password: string): string;
}

export class AuthService extends AbstractService implements IAuthService {

    constructor(private readonly userRepository: UserRepository, private readonly jwtService: IJwtService) { super(); }

    public async register(name: string, email: string, password: string): Promise<string> {
        const jwtToken = this.jwtService.generateToken({ email });
        const user: UserModel = this.userRepository.create(new UserModel());
        await this.eventBus.publish(new UserRegisteredEvent(user));
        return jwtToken;
    }

    public login(email: string, password: string): string {
        return this.jwtService.generateToken({ email });
    }
}