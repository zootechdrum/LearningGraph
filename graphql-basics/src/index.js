import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
type Query {
    hello: String!
    name: String!
}`;

//Resolvers
const resolvers = {
  Query: {
    hello() {
      return "This is my first query";
    },
    name() {
      return "Cesar Gomez";
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log("Server is up and running");
});
