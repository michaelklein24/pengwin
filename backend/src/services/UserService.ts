import type UserModel from "../models/UserModel.ts";
import type { UserRepository } from "../repositories/UserRepository.ts";
import AbstractService from "./AbstractService.ts";

export interface IUserService {
    createUser(user: UserModel): UserModel;
    getUserById(id: string): UserModel;
    updateUser(user: UserModel): UserModel;
    deleteUser(id: string): void;
    getAllUsers(): UserModel[];
}

export default class UserService extends AbstractService implements IUserService {

    constructor(private readonly userRepository: UserRepository) { super(); }

    public createUser(user: UserModel): UserModel {
        return this.userRepository.create(user);
    }

    public getAllUsers(): UserModel[] {
        return this.userRepository.findAll();
    }

    public getUserById(id: string): UserModel {
        return this.userRepository.findOne(id);
    }

    public updateUser(user: UserModel): UserModel {
        return this.userRepository.update(user);
    }

    public deleteUser(id: string): void {
        return this.userRepository.delete(id);
    }

    
}