const Query = {
  comments(parent, args, { db }, info) {
    return db.comments;
  },
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
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
};

export { Query as default };
