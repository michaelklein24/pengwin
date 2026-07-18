import type { GraphQLClient } from 'graphql-request';
import { createGraphQLClient } from './createGraphQLClient';
import { UserService } from './UserService';
import { WinService } from './WinService';

export type AppServices = {
  userService: UserService;
  winService: WinService;
};

/**
 * Wires frontend GraphQL services onto a shared HTTP client.
 *
 * @param client - Shared GraphQL client. Defaults to {@link createGraphQLClient}.
 * @returns Constructed user and win services.
 */
export function createAppServices(
  client: GraphQLClient = createGraphQLClient(),
): AppServices {
  return {
    userService: new UserService(client),
    winService: new WinService(client),
  };
}
