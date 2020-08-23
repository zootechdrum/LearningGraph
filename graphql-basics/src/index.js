import { GraphQLServer } from "graphql-yoga";

const users = [
  { id: "1", name: "cesar Gomrz", email: "zootechdrum@gmail.com", age: 27 },
  { id: "2", name: "lisa Gomez", email: "zootechdrum@gmail.com", age: 27 },
];

const posts = [
  {
    id: "1",
    title: "cesar Gomrz",
    body: "lorem ipsum hdfksjdhsk  dfksjhdfjsk",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "farts",
    body: "lorem ipsum hdfksjdhsk  dfksjhdfjsk",
    published: false,
    author: "2",
  },
];

const comments = [
  { id: "44", text: "hole" },
  { id: "4", text: "shits" },
  { id: "6", text: "shits" },
];

const typeDefs = `
type Query {
  users (query: String): [User]
  posts (query: String): [Post]
  comments: [!Comment]!
    me: User! 
    post: Post!
}
type Post {
  id: ID!
  title: String!
  body: String!
  published: Boolean
  author: User!
}
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  posts: [Post!]!
}

type Comment {
  id: ID!
  text: String!
}
`;

//Resolvers
const resolvers = {
  Query: {
    comments(parent, args, ctx, info) {
      if (!args.query) {
        return comments;
      }
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        return post.title.toLowerCase().includes(args.title.toLowerCase());
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
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log("Server is up and running");
});
