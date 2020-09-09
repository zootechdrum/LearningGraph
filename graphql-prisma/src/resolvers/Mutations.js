import uuidv4 from "uuid/v4";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error("Email Taken");
    }

    return prisma.mutation.createUser({ data: args.data }, info);
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
    const { title, body, published, author } = args.data;

    return prisma.mutation.createPost({
      data: {
        title,
        body,
        published,
        author: { connect: { id: author } },
      },
      info,
    });
  },

  deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id: args.id } }, info);
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw Error("Post does not exist");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        //Deleted
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      }
    } else if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some((user) => {
      return user.id === args.data.author;
    });
    const postExist = db.posts.some((post) => {
      return post.id === args.data.postId && post.published;
    });

    if (!userExist || !postExist) {
      throw new Error("User or Post could not Found");
    }
    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(comment);
    pubsub.publish(`comment ${args.data.postId}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });
    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex((comment) => {
      return comment.id === args.id;
    });

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const [comment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${comment.postId}`, {
      comment: {
        mutation: "DELETED",
        data: comment,
      },
    });
    return comment;
  },
  updateComment(parent, args, { db, pubsub }, info) {
    console.log(args);
    const { id, data } = args;

    const comment = db.comments.find((comment) => {
      return comment.id === id;
    });

    if (!comment) {
      throw new Error("Comment does not exist");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.postId}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },
};

export { Mutation as default };
