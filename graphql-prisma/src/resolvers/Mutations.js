import bcrypt from "bcryptjs";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8) {
      throw new Error("Password must be 8 charechters or longer");
    }
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error("Email Taken");
    }

    const password = await bcrypt.hash(args.data.password, 10);

    return prisma.mutation.createUser(
      {
        data: {
          ...args.data,
          password: password,
        },
      },
      info
    );
  },

  async deleteUser(parent, args, { prisma }, info) {
    const user = await prisma.exists.User({ id: args.id });

    if (!user) {
      throw new Error("Could not find user");
    }

    return prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },
  updateUser(parent, args, { prisma }, info) {
    return prisma.mutationn.updateUser(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },
  createPost(parent, args, { prisma }, info) {
    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: args.data.author,
            },
          },
        },
      },
      info
    );
  },

  deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id: args.id } }, info);
  },
  updatePost(parent, args, { prisma }, info) {
    console.log(args.data);

    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },

  createComment(parent, args, { prisma }, info) {
    console.log(args.data);
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: args.data.author,
            },
          },
          post: {
            connect: {
              id: args.data.postId,
            },
          },
        },
      },
      info
    );
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  updateComment(parent, args, { prisma }, info) {
    return prisma.mutation.updateComment(
      {
        where: {
          id: args.id,
        },
        data: args.data,
      },
      info
    );
  },
};

export { Mutation as default };
