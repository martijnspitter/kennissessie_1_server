import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Account {
    id: ID!
    email: String!
    profile: Profile!    
    identifier: String!
    channels: [Channel!]!
    messages: [Message!]!
    credential: [Credential!]!
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

  type Channel {
    id: ID!
    title: String!
    owner: Account!
    participants: [Account!]!
    messages: [Message!]!
    createdAt: Int!
    updatedAt: Int!
  }

  type Message {
    id: ID!
    channel: Channel!
    createdBy: Account!
    title: String!
    body: String!
    createdAt: Int!
    updatedAt: Int!
  }

  type Credential {
    title: String!,
    id: String!
  }

  input ChannelInput {
    owner: ID!
    title: String!
  }

  input AddParticipant {
    participant: ID!
    owner: ID!
    channel: ID!
  }

  input MessageInput {
    channel: ID!
    createdBy: ID!
    title: String!
    body: String!
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

  input PublishCertificate {
    publisherId: String!
    receiverId: String!
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

  input AllMyChannels {
    accountId: ID!
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
    allMyChannels(input: AllMyChannels): [Channel!]!
    channel(id: String!): Channel!
    allMessagesForChannel(id: String!): [Message!]!
    message(id: String): Message!
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
    
    "Publish a certificate"
    publishCertificate(input: PublishCertificate): String!

    createChannel(input: ChannelInput): Channel!
    addParticipant(input: AddParticipant): Channel!
    createMessage(input: MessageInput): Message!
  }

`;
