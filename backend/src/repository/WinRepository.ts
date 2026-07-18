import type { CreateWinInput, UpdateWinInput, WinModel } from '../models/win.ts';

export interface WinRepository {
  findAll(): Promise<WinModel[]>;
  findById(id: string): Promise<WinModel | null>;
  findByUserId(userId: string): Promise<WinModel[]>;
  create(input: CreateWinInput): Promise<WinModel>;
  update(id: string, input: UpdateWinInput): Promise<WinModel | null>;
  delete(id: string): Promise<boolean>;
}
