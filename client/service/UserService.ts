import type { GraphQLClient } from 'graphql-request';
import {
  GetUserDocument,
  type GetUserQuery,
} from '@/graphql/generated/graphql';
import { createGraphQLClient } from './createGraphQLClient';

export type User = NonNullable<GetUserQuery['getUser']>;

/**
 * Frontend service for user queries against the GraphQL API.
 */
export class UserService {
  private readonly client: GraphQLClient;

  /**
   * @param client - Shared GraphQL HTTP client. Defaults to a new client from
   *   {@link createGraphQLClient}.
   */
  constructor(client: GraphQLClient = createGraphQLClient()) {
    this.client = client;
  }

  /**
   * Fetches a user by id, including that user's wins.
   *
   * @param id - User id.
   * @returns The user, or `null` when it does not exist.
   */
  async getUser(id: string): Promise<User | null> {
    const data = await this.client.request(GetUserDocument, { id });
    return data.getUser;
  }
}
