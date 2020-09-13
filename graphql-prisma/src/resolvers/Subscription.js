const Subscription = {
  comment: {
    subscribe(parent, { postId }, { prisma }, info) {
      return prisma.subscription.comment(null, info);
    },
  },
  post: {
    subscribe(parent, { published }, { db, pubsub }, info) {
      return pubsub.asyncIterator("post");
    },
  },
};

export { Subscription as default };
