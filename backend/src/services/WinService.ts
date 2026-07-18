import type { WinRepository } from '../repository/WinRepository.ts';
import type { CreateWinInput, UpdateWinInput, WinModel } from '../models/win.ts';

export class WinService {
  private readonly repository: WinRepository;

  constructor(repository: WinRepository) {
    this.repository = repository;
  }

  getAllWins(): Promise<WinModel[]> {
    return this.repository.findAll();
  }

  getWinById(id: string): Promise<WinModel | null> {
    return this.repository.findById(id);
  }

  getWinsByUserId(userId: string): Promise<WinModel[]> {
    return this.repository.findByUserId(userId);
  }

  createWin(input: CreateWinInput): Promise<WinModel> {
    return this.repository.create(input);
  }

  updateWin(id: string, input: UpdateWinInput): Promise<WinModel | null> {
    return this.repository.update(id, input);
  }

  deleteWin(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
