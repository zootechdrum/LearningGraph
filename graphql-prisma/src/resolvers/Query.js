import getUserId from "../utils/getUserId";

const Query = {
  comments(parent, args, { prisma }, info) {
    const opArgs = {
      after: args.after,
      first: args.first,
      skip: args.skip,
    };
    return prisma.query.comments(opArgs, info);
  },
  async users(parent, args, { prisma }, info) {
    const opArgs = {
      after: args.after,
      first: args.first,
      skip: args.skip,
    };

    if (args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query,
          },
        ],
      };
    }

    return await prisma.query.users(opArgs, info);
  },

  async myPosts(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const opArgs = {
      after: args.after,
      first: args.first,
      skip: args.skip,
      where: {
        author: {
          id: userId,
        },
      },
    };
    if (args.query) {
      opArgs.where.OR = [
        {
          title_containes: args.query,
        },
        {
          body_contains: args.query,
        },
      ];
    }
    return prisma.query.posts(opArgs, info);
  },

  async posts(parent, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      where: {
        published: true,
      },
    };

    if (args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query,
        },
        {
          body_contains: args.query,
        },
      ];
    }

    return await prisma.query.posts(opArgs, info);
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.user({
      where: {
        id: userId,
      },
    });
  },
  async post(post, args, { prisma, request }, info) {
    const getUserId = getUserId(request, false);

    const posts = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [
            {
              published: true,
            },
            {
              author: {
                id: userId,
              },
            },
          ],
        },
      },
      info
    );

    if (posts.length === 0) {
      throw new Error("Post not found");
    }
    return post[0];
  },
};

export { Query as default };
