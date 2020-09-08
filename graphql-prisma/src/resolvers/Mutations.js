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
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User was not found");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);
      if (emailTaken) {
        throw new Error("Email Taken");
      }
      user.email = data.email;
    }
    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age == data.age;
    }
    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);
    if (!userExist) {
      throw new Error("User not Found");
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };
    db.posts.push(post);
    if (args.data.published)
      pubsub.publish(`post`, {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    return post;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => {
      return post.id === args.id;
    });

    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    const [deletedPost] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => {
      comment.postId !== args.id;
    });
    if (deletedPost.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: deletedPost,
        },
      });
    }
    return deletedPost;
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
