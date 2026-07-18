import type { UserRepository } from '../repository/UserRepository.ts';
import type { CreateUserInput, UpdateUserInput, UserModel } from '../models/user.ts';

export class UserService {
  private readonly repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  getAllUsers(): Promise<UserModel[]> {
    return this.repository.findAll();
  }

  getUserById(id: string): Promise<UserModel | null> {
    return this.repository.findById(id);
  }

  createUser(input: CreateUserInput): Promise<UserModel> {
    return this.repository.create(input);
  }

  updateUser(id: string, input: UpdateUserInput): Promise<UserModel | null> {
    return this.repository.update(id, input);
  }

  deleteUser(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
