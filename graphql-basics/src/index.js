import { GraphQLServer } from "graphql-yoga";

const users = [
  { id: "1", name: "cesar Gomrz", email: "zootechdrum@gmail.com", age: 27 },
  { id: "2", name: "lisa Gomez", email: "zootechdrum@gmail.com", age: 27 },
];

const typeDefs = `
type Query {
  users (query: String): [User]
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
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
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
