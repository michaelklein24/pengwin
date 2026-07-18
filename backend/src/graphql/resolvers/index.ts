import type { AppServices } from '../../bootstrap.ts';
import { createUserResolver } from './userResolver.ts';
import { createWinResolver } from './winResolver.ts';

export function createExecutableResolvers(services: AppServices) {
  const userResolver = createUserResolver(services.userService, services.winService);
  const winResolver = createWinResolver(services.userService, services.winService);

  return {
    ...userResolver.Query,
    ...winResolver.Query,
    ...winResolver.Mutation,
    User: userResolver.User,
    Win: winResolver.Win,
  };
}
