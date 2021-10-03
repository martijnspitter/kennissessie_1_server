import express from 'express';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import mongoose from 'mongoose';
import { ApolloServer, AuthenticationError } from 'apollo-server';

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL || '';

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

const server = new ApolloServer({
  cors: corsOptions,
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // const token = req.headers.authorization || '';
    const user = true
    if (!user) throw new AuthenticationError('you must be logged in');

    return { user };
  }
})

mongoose
  .connect(MONGO_URL)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, ({ url }) => {
      console.log(`Server is running on url ${url} and port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });
