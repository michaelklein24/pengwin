import type { CreateWinInput } from '../../models/win.ts';
import type { UserService } from '../../services/UserService.ts';
import type { WinService } from '../../services/WinService.ts';

export function createWinResolver(userService: UserService, winService: WinService) {
  return {
    Query: {
      getWins: () => winService.getAllWins(),
      getWin: ({ id }: { id: string }) => winService.getWinById(id),
    },

    Mutation: {
      createWin: (input: CreateWinInput) => winService.createWin(input),
    },

    Win: {
      user: (parentWin: { userId: string }) => userService.getUserById(parentWin.userId),
    },
  };
}
