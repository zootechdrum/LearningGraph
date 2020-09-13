const Query = {
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
  async users(parent, args, { prisma }, info) {
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

    return await prisma.query.users(opArgs, info);
  },
  async posts(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            title_contains: args.query,
          },
          {
            body_contains: args.query,
          },
        ],
      };
    }

    return await prisma.query.posts(opArgs, info);
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
