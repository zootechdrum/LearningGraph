import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

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
  { id: "44", text: "hole", author: "1", postId: "1" },
  { id: "4", text: "shits", author: "2", postId: "2" },
  { id: "6", text: "I love this shit", author: "2", postId: "1" },
];

const typeDefs = `
type Query {
  users (query: String): [User]
  posts (query: String): [Post]
  comments: [Comment!]!
    me: User! 
    post: Post!
}

type Mutation {
  createUser(name: String!, email: String!, age: Int): User
  createPost(title: String!, body: String!, published: Boolean!, author: ID! ): Post!
  createComment(text: String!, author: ID!, postId: ID!): Comment!
}

type Post {
  id: ID!
  title: String!
  body: String!
  published: Boolean
  author: User!
  comments: [Comment]
}
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  posts: [Post!]!
  comments: [Comment]
}

type Comment {
  id: ID!
  text: String!
  author: User!
  post: [Post]
}
`;

//Resolvers
const resolvers = {
  Query: {
    comments(parent, args, ctx, info) {
      return comments;
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const ematilTaken = users.some((user) => {
        return user.email === args.email;
      });

      if (ematilTaken) {
        throw new Error("Email taken.");
      }
      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age,
      };

      users.push(user);
      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExist = users.some((user) => user.id === args.author);
      if (!userExist) {
        throw new Error("User not Found");
      }

      const post = {
        id: uuidv4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author,
      };
      posts.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      console.log(args);
      const userExist = users.some((user) => {
        return user.id === args.author;
      });
      const postExist = posts.some((post) => {
        return post.id === args.postId;
      });

      const comment = {
        id: args.id,
        text: args.text,
        author: args.author,
        postId: args.postId,
      };

      if (!userExist || !postExist) {
        throw new Error("User or Post could not Found");
      }

      comments.push(comment);
      return comment;
    },
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.find((comment) => {
        return comment.postId === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.id === parent.postId;
      });
    },
  },
};
const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log("Server is up and running");
});
