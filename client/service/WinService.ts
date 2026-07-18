import type { GraphQLClient } from 'graphql-request';
import {
  CreateWinDocument,
  GetWinDocument,
  GetWinsDocument,
  type CreateWinMutation,
  type CreateWinMutationVariables,
  type GetWinQuery,
  type GetWinsQuery,
} from '@/graphql/generated/graphql';
import { createGraphQLClient } from './createGraphQLClient';

export type CreateWinInput = CreateWinMutationVariables;
export type Win = GetWinsQuery['getWins'][number];
export type WinWithUser = NonNullable<GetWinQuery['getWin']>;

/**
 * Frontend service for win queries and mutations against the GraphQL API.
 */
export class WinService {
  private readonly client: GraphQLClient;

  /**
   * @param client - Shared GraphQL HTTP client. Defaults to a new client from
   *   {@link createGraphQLClient}.
   */
  constructor(client: GraphQLClient = createGraphQLClient()) {
    this.client = client;
  }

  /**
   * Fetches every win.
   *
   * @returns All wins returned by `getWins`.
   */
  async getWins(): Promise<Win[]> {
    const data = await this.client.request(GetWinsDocument);
    return data.getWins;
  }

  /**
   * Fetches a single win by id, including its owning user when present.
   *
   * @param id - Win id.
   * @returns The win, or `null` when it does not exist.
   */
  async getWin(id: string): Promise<WinWithUser | null> {
    const data = await this.client.request(GetWinDocument, { id });
    return data.getWin;
  }

  /**
   * Creates a win for the given user.
   *
   * @param input - Mutation variables matching `createWin`.
   * @returns The newly created win.
   */
  async createWin(input: CreateWinInput): Promise<CreateWinMutation['createWin']> {
    const data = await this.client.request(CreateWinDocument, input);
    return data.createWin;
  }
}
