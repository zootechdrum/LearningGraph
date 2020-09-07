const Query = {
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  users(parent, args, { db, prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query,
          },
          {
            email_contains: args.query,
          },
        ],
      };
    }

    return prisma.query.users(null, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};
    return prisma.query.posts(null, info);
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
};

export { Query as default };
