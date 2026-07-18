/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type ImpactLevel =
  | 'MAJOR'
  | 'MEDIUM'
  | 'SMALL';

export type GetUserQueryVariables = Exact<{
  id: string | number;
}>;


export type GetUserQuery = { getUser: { id: string, name: string, email: string, wins: Array<{ id: string, title: string, description: string | null, impact: ImpactLevel, tags: Array<string>, challenges: Array<string>, skills: Array<string>, startDate: string, completionDate: string, collaborators: Array<string>, evidence: string | null, userId: string }> } | null };

export type GetWinsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWinsQuery = { getWins: Array<{ id: string, title: string, description: string | null, impact: ImpactLevel, tags: Array<string>, challenges: Array<string>, skills: Array<string>, startDate: string, completionDate: string, collaborators: Array<string>, evidence: string | null, userId: string }> };

export type GetWinQueryVariables = Exact<{
  id: string | number;
}>;


export type GetWinQuery = { getWin: { id: string, title: string, description: string | null, impact: ImpactLevel, tags: Array<string>, challenges: Array<string>, skills: Array<string>, startDate: string, completionDate: string, collaborators: Array<string>, evidence: string | null, userId: string, user: { id: string, name: string, email: string } | null } | null };

export type CreateWinMutationVariables = Exact<{
  userId: string | number;
  title: string;
  description?: string | null | undefined;
  impact: ImpactLevel;
  tags: Array<string> | string;
  challenges: Array<string> | string;
  skills: Array<string> | string;
  startDate: string;
  completionDate: string;
  collaborators: Array<string> | string;
  evidence?: string | null | undefined;
}>;


export type CreateWinMutation = { createWin: { id: string, title: string, description: string | null, impact: ImpactLevel, tags: Array<string>, challenges: Array<string>, skills: Array<string>, startDate: string, completionDate: string, collaborators: Array<string>, evidence: string | null, userId: string } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const GetUserDocument = new TypedDocumentString(`
    query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    email
    wins {
      id
      title
      description
      impact
      tags
      challenges
      skills
      startDate
      completionDate
      collaborators
      evidence
      userId
    }
  }
}
    `) as unknown as TypedDocumentString<GetUserQuery, GetUserQueryVariables>;
export const GetWinsDocument = new TypedDocumentString(`
    query GetWins {
  getWins {
    id
    title
    description
    impact
    tags
    challenges
    skills
    startDate
    completionDate
    collaborators
    evidence
    userId
  }
}
    `) as unknown as TypedDocumentString<GetWinsQuery, GetWinsQueryVariables>;
export const GetWinDocument = new TypedDocumentString(`
    query GetWin($id: ID!) {
  getWin(id: $id) {
    id
    title
    description
    impact
    tags
    challenges
    skills
    startDate
    completionDate
    collaborators
    evidence
    userId
    user {
      id
      name
      email
    }
  }
}
    `) as unknown as TypedDocumentString<GetWinQuery, GetWinQueryVariables>;
export const CreateWinDocument = new TypedDocumentString(`
    mutation CreateWin($userId: ID!, $title: String!, $description: String, $impact: ImpactLevel!, $tags: [String!]!, $challenges: [String!]!, $skills: [String!]!, $startDate: String!, $completionDate: String!, $collaborators: [String!]!, $evidence: String) {
  createWin(
    userId: $userId
    title: $title
    description: $description
    impact: $impact
    tags: $tags
    challenges: $challenges
    skills: $skills
    startDate: $startDate
    completionDate: $completionDate
    collaborators: $collaborators
    evidence: $evidence
  ) {
    id
    title
    description
    impact
    tags
    challenges
    skills
    startDate
    completionDate
    collaborators
    evidence
    userId
  }
}
    `) as unknown as TypedDocumentString<CreateWinMutation, CreateWinMutationVariables>;