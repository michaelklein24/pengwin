import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  enum ImpactLevel {
    SMALL
    MEDIUM
    MAJOR
  }

  type Win {
    id: ID!
    title: String!
    description: String!
    impact: ImpactLevel!
    tags: [String!]!
    challenges: [String!]!
    skills: [String!]!
    startDate: String
    completionDate: String!
    collaborators: [String!]!
    evidence: String
    userId: ID!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    wins: [Win!]!
  }

  type Query {
    getWins: [Win!]!
    getWin(id: ID!): Win
    getUser(id: ID!): User
  }

  type Mutation {
    createWin(
      userId: ID!
      title: String!
      description: String
      impact: ImpactLevel!
      tags: [String!]!
      challenges: [String!]!
      skills: [String!]!
      startDate: String!
      completionDate: String!
      collaborators: [String!]!
      evidence: String
    ): Win!
  }
`);