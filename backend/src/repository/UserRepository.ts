import type { CreateUserInput, UpdateUserInput, UserModel } from '../models/user.ts';

export interface UserRepository {
  findAll(): Promise<UserModel[]>;
  findById(id: string): Promise<UserModel | null>;
  create(input: CreateUserInput): Promise<UserModel>;
  update(id: string, input: UpdateUserInput): Promise<UserModel | null>;
  delete(id: string): Promise<boolean>;
}
