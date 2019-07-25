const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Message = require('./resolvers/Message');
const Response = require('./resolvers/Response');
const Subscription = require('./resolvers/Subscription');

const resolvers = {
    Query,
    Mutation,
    Message,
    Response,
    Subscription
};

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: request => {
        return {
          ...request, prisma
        };
      }
});

server.start(() => console.log('http://localhost:4000'));