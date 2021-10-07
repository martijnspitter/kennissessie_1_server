import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Account {
    id: ID!
    email: String!
    profile: Profile!    
    identifier: String
    createdAt: Int!
    updatedAt: Int!
  }

  type Profile {
    id: ID!
    firstname: String!
    lastname: String!
    account: Account!
    certificateRecipients: [Account!]!
    createdAt: Int!
    updatedAt: Int!
  }

  input AccountInput {
    email: String!
    identifier: String
  }

  input ProfileInput {
    firstname: String!
    lastname: String!
    account: ID!
    certificateRecipients: [ID]
  }

  # input of validate endpoint
  input ValidateCertificatie {
    certificate: String!
    publisherIdentity: String!
    publisherAccountId: ID!
  }

  # input of publish certificate endpoint
  input PublishCertificate {
    publisherIdentity: String!
    receiverIdentity: String!
    receiverAccountId: ID!
    publisherAccountId: ID!
  }

  input EditAccount {
    accountId: ID!
    email: String
  }

  input EditProfile {
    profileId: ID!
    firstname: String
    lastname: String
  }

  type Query {
    allAccounts: [Account!]!
    account(id: String!): Account
    allProfiles: [Profile!]!
    profile(id: String!): Profile
    certificateRecipients(id: String!): [Account]!

    # here is the validate endpoint with input and return: Boolean? 
    validate(input: ValidateCertificatie): Boolean!
  }

  type Mutation {
    createAccount(input: AccountInput): Account!
    editAccount(input: EditAccount): Account!
    createProfile(input: ProfileInput): Profile!
    editProfile(input: EditProfile): Profile!
    
    # publish certificate endpoint. Return type now string
    publishCertificate(input: PublishCertificate): String!
  }

`;
