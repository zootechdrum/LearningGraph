const Comment = {
  author(parent, args, { db }, info) {
    return db.users.find((user) => {
      return user.id === parent.author;
    });
  },
  post(parent, args, { db }, info) {
    return db.posts.filter((post) => {
      return post.id === parent.postId;
    });
  },
};

export { Comment as default };
