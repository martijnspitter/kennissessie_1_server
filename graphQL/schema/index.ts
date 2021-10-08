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
    "All accounts in an array"
    allAccounts: [Account!]!
    "Single account object"
    account(id: String!): Account
    "All profiles in an array"
    allProfiles: [Profile!]!
    "Single profile"
    profile(id: String!): Profile
    "Recipients of a certificate"
    certificateRecipients(id: String!): [Account]!

    # here is the validate endpoint with input and return: Boolean? 
    "Validate a certificate"
    validate(input: ValidateCertificatie): Boolean!
  }

  type Mutation {
    "Create an account"
    createAccount(input: AccountInput): Account!
    "Edit account"
    editAccount(input: EditAccount): Account!
    "Create a profile"
    createProfile(input: ProfileInput): Profile!
    "Edit profile"
    editProfile(input: EditProfile): Profile!
    
    # publish certificate endpoint. Return type now string
    "Publish a certificate"
    publishCertificate(input: PublishCertificate): String!
  }

`;
