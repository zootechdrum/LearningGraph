import uuidv4 from "uuid/v4";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const ematilTaken = db.users.some((user) => {
      return user.email === args.data.email;
    });

    if (ematilTaken) {
      throw new Error("Email taken.");
    }

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(user);
    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => {
      return user.id === args.id;
    });

    if (userIndex === -1) {
      throw new Error("User not found");
    }
    const deletedUsers = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;

      if (match) {
        db.comments = db.comments.filter((comment) => {
          comment.postId !== post.id;
        });
      }

      return !match;
    });
    db.comments = db.comments.filter((comments) => comment.author !== args.id);
    return deletedUsers[0];
  },
  createPost(parent, args, { db }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);
    if (!userExist) {
      throw new Error("User not Found");
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };
    db.posts.push(post);
    return post;
  },
  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex((post) => {
      return post.id === args.id;
    });

    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    const deletedPost = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => {
      comment.postId !== args.id;
    });
    return deletedPost[0];
  },
  createComment(parent, args, ctx, info) {
    const userExist = db.users.some((user) => {
      return user.id === args.data.author;
    });
    const postExist = db.posts.some((post) => {
      return post.id === args.data.postId && post.published;
    });

    const comment = {
      ...args.data,
    };

    if (!userExist || !postExist) {
      throw new Error("User or Post could not Found");
    }

    db.comments.push(comment);
    return comment;
  },
  deleteComment(parent, { db }, ctx, info) {
    const commentIndex = db.comments.findIndex((comment) => {
      return comment.id === args.id;
    });

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const comment = db.comments.splice(commentIndex, 1);
    return comment[0];
  },
};

export { Mutation as default };
