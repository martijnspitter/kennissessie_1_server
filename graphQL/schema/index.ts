import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Account {
    id: ID!
    email: String!
    profile: Profile    
    identifier: String
    createdAt: Int!
    updatedAt: Int!
  }

  input AccountInput {
    email: String!
    identifier: String
  }

  input EditAccount {
    accountId: ID!
    email: String
  }

  type Query {
    allAccounts: [Account!]!
    account(id: String!): Account
  }

  type Mutation {
    createAccount(input: AccountInput): Account!
    editAccount(input: EditAccount): Account!
  }

`;
