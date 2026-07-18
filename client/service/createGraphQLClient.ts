import { GraphQLClient } from 'graphql-request';

/** Default GraphQL HTTP endpoint for local development. */
export const DEFAULT_GRAPHQL_ENDPOINT = 'http://localhost:6140/graphql';

/**
 * Resolves the GraphQL endpoint from the environment or the local default.
 *
 * @returns Absolute URL of the GraphQL HTTP endpoint.
 */
export function getGraphQLEndpoint(): string {
  return process.env.NEXT_PUBLIC_GRAPHQL_URL ?? DEFAULT_GRAPHQL_ENDPOINT;
}

/**
 * Creates a `graphql-request` client pointed at the Pengwin API.
 *
 * @param endpoint - Absolute GraphQL URL. Defaults to {@link getGraphQLEndpoint}.
 * @returns A configured {@link GraphQLClient}.
 */
export function createGraphQLClient(endpoint: string = getGraphQLEndpoint()): GraphQLClient {
  return new GraphQLClient(endpoint);
}
