import type { UserService } from '../../services/UserService.ts';
import type { WinService } from '../../services/WinService.ts';

export function createUserResolver(userService: UserService, winService: WinService) {
  return {
    Query: {
      getUser: ({ id }: { id: string }) => userService.getUserById(id),
    },

    User: {
      wins: (parentUser: { id: string }) => winService.getWinsByUserId(parentUser.id),
    },
  };
}
