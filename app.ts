import express from 'express';
import { typeDefs } from './graphql/schema';
const resolvers = require('./graphql/resolvers')
import mongoose from 'mongoose';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';

require('dotenv').config();

const MONGO_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/kennissessie';

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // const token = req.headers.authorization || '';
      const user = true
      if (!user) throw new AuthenticationError('you must be logged in');

      return { user, welkom: 'Welcome at TheGuild!' };
    }
  });

  await server.start();

  server.applyMiddleware({ app });

  app.use((req, res) => {
    res.send('Hello World!');
  });

  await mongoose.connect(MONGO_URL);

  app.listen(4000, () => console.log('Server is running on port 4000'))
}

startServer();
