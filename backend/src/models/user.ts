export interface UserModel {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export type UpdateUserInput = Partial<Omit<UserModel, 'id'>>;
