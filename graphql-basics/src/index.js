import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
type Query {
me: User!
post: Post!
}
type Post {
  id: ID!
  title: String!
  body: String!
  published: String!
}
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
}
`;

//Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: 1,
        name: "Cesar Gomez",
        email: "zootechdrumn",
        age: 4,
      };
    },
    post() {
      return {
        id: 1,
        title: "Hello",
        body: "Query",
        published: "7/7/70",
      };
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log("Server is up and running");
});
