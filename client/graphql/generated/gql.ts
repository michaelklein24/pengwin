/* eslint-disable */
import * as types from './graphql';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "query GetUser($id: ID!) {\n  getUser(id: $id) {\n    id\n    name\n    email\n    wins {\n      id\n      title\n      description\n      impact\n      tags\n      challenges\n      skills\n      startDate\n      completionDate\n      collaborators\n      evidence\n      userId\n    }\n  }\n}": typeof types.GetUserDocument,
    "query GetWins {\n  getWins {\n    id\n    title\n    description\n    impact\n    tags\n    challenges\n    skills\n    startDate\n    completionDate\n    collaborators\n    evidence\n    userId\n  }\n}\n\nquery GetWin($id: ID!) {\n  getWin(id: $id) {\n    id\n    title\n    description\n    impact\n    tags\n    challenges\n    skills\n    startDate\n    completionDate\n    collaborators\n    evidence\n    userId\n    user {\n      id\n      name\n      email\n    }\n  }\n}\n\nmutation CreateWin($userId: ID!, $title: String!, $description: String, $impact: ImpactLevel!, $tags: [String!]!, $challenges: [String!]!, $skills: [String!]!, $startDate: String!, $completionDate: String!, $collaborators: [String!]!, $evidence: String) {\n  createWin(\n    userId: $userId\n    title: $title\n    description: $description\n    impact: $impact\n    tags: $tags\n    challenges: $challenges\n    skills: $skills\n    startDate: $startDate\n    completionDate: $completionDate\n    collaborators: $collaborators\n    evidence: $evidence\n  ) {\n    id\n    title\n    description\n    impact\n    tags\n    challenges\n    skills\n    startDate\n    completionDate\n    collaborators\n    evidence\n    userId\n  }\n}": typeof types.GetWinsDocument,
};
const documents: Documents = {
    "query GetUser($id: ID!) {\n  getUser(id: $id) {\n    id\n    name\n    email\n    wins {\n      id\n      title\n      description\n      impact\n      tags\n      challenges\n      skills\n      startDate\n      completionDate\n      collaborators\n      evidence\n      userId\n    }\n  }\n}": types.GetUserDocument,
    "query GetWins {\n  getWins {\n    id\n    title\n    description\n    impact\n    tags\n    challenges\n    skills\n    startDate\n    completionDate\n    collaborators\n    evidence\n    userId\n  }\n}\n\nquery GetWin($id: ID!) {\n  getWin(id: $id) {\n    id\n    title\n    description\n    impact\n    tags\n    challenges\n    skills\n    startDate\n    completionDate\n    collaborators\n    evidence\n    userId\n    user {\n      id\n      name\n      email\n    }\n  }\n}\n\nmutation CreateWin($userId: ID!, $title: String!, $description: String, $impact: ImpactLevel!, $tags: [String!]!, $challenges: [String!]!, $skills: [String!]!, $startDate: String!, $completionDate: String!, $collaborators: [String!]!, $evidence: String) {\n  createWin(\n    userId: $userId\n    title: $title\n    description: $description\n    impact: $impact\n    tags: $tags\n    challenges: $challenges\n    skills: $skills\n    startDate: $startDate\n    completionDate: $completionDate\n    collaborators: $collaborators\n    evidence: $evidence\n  ) {\n    id\n    title\n    description\n    impact\n    tags\n    challenges\n    skills\n    startDate\n    completionDate\n    collaborators\n    evidence\n    userId\n  }\n}": types.GetWinsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetUser($id: ID!) {\n  getUser(id: $id) {\n    id\n    name\n    email\n    wins {\n      id\n      title\n      description\n      impact\n      tags\n      challenges\n      skills\n      startDate\n      completionDate\n      collaborators\n      evidence\n      userId\n    }\n  }\n}"): typeof import('./graphql').GetUserDocument;
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetWins {\n  getWins {\n    id\n    title\n    description\n    impact\n    tags\n    challenges\n    skills\n    startDate\n    completionDate\n    collaborators\n    evidence\n    userId\n  }\n}\n\nquery GetWin($id: ID!) {\n  getWin(id: $id) {\n    id\n    title\n    description\n    impact\n    tags\n    challenges\n    skills\n    startDate\n    completionDate\n    collaborators\n    evidence\n    userId\n    user {\n      id\n      name\n      email\n    }\n  }\n}\n\nmutation CreateWin($userId: ID!, $title: String!, $description: String, $impact: ImpactLevel!, $tags: [String!]!, $challenges: [String!]!, $skills: [String!]!, $startDate: String!, $completionDate: String!, $collaborators: [String!]!, $evidence: String) {\n  createWin(\n    userId: $userId\n    title: $title\n    description: $description\n    impact: $impact\n    tags: $tags\n    challenges: $challenges\n    skills: $skills\n    startDate: $startDate\n    completionDate: $completionDate\n    collaborators: $collaborators\n    evidence: $evidence\n  ) {\n    id\n    title\n    description\n    impact\n    tags\n    challenges\n    skills\n    startDate\n    completionDate\n    collaborators\n    evidence\n    userId\n  }\n}"): typeof import('./graphql').GetWinsDocument;


export function gql(source: string) {
  return (documents as any)[source] ?? {};
}
