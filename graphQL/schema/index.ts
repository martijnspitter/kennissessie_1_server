import { gql } from 'apollo-server';

export const typeDefs = gql`
    type Account {
    _id: ID!
    email: String!
    username: String!
    firstname: String!
    lastname: String!
    myChannels: [Channel]
    createdAt: Int!
    updatedAt: Int!
  }

  type Channel {
    _id: ID!
    title: String!
    description: String
    twilioId: String!
    creator: Account!
    members: [Account]
    createdAt: Int!
    updatedAt: Int!
  }

  input AccountInput {
    _id: ID
    email: String!
    username: String!
    password: String!
    firstname: String!
    lastname: String!
    token: String!
    tokenExpiration: Int!
  }

  input ChannelInput {
    _id: ID
    title: String!
    description: String
    virgilId: String!
    creator: Account!
    members: [Account]
  }
  
  input AddChannelMember {
    members: Account!
  }

  input UpdateMyChannels {
    myChannels: Channel!
  }

  input EditChannel {
    channelId: ID!
    title: String!
    description: String!
  }

  enum Order {
    ASC
    DESC
  }
  
  input SortBy {
    field: String!
    order: Order!
  }

  type RootQuery {
    allAccounts(): [Account!]
    account(id: String!): Account
    allChannels(): [Channel!]
    channel(id: String!): Channel
    myChannels(id: String!): [Channel!]
  }

  type RootMutation {
    createAccount(input: AccountInput): Account!
    createChannel(input: ChannelInput): Channel!
    editAccount(input: ): Account!
    editChannel(input: EditChannel): Channel!
    addChannelMember(input: AddChannelMember): Channel!
    updateMyChannels(input: UpdateMyChannels): Account!
  }

  type RootSubstription {
    newChannels: [Channel!]
  }

  schema {
    query: RootQuery
    mutation: RootMutation
    subscription: RootSubstription
  }
`;
