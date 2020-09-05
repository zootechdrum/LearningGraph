import { Prisma, makePrismaBindingClass } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
});

const createPostForUser = async (authorId, data) => {
  const userExist = await prisma.exists.User({ id: authorId });

  if (!userExist) {
    throw new Error("User not found");
  }

  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    },
    `{author {id name email post {id title published}}}`
  );

  return post;
};

const updatePost = async (postId, data) => {
  const postExist = await prisma.exists.Post({ id: postId });

  if (!postExist) {
    throw new Error("Post not found");
  }
  const post = await prisma.mutation.updatePost(
    {
      data: {
        ...data,
      },
      where: {
        id: postId,
      },
    },
    `{ author { id name email post {id title published} }}`
  );

  return post;
};

// createPostForUser("ckekfq7g7047z0892c24o1v7m", {
//   title: "Great books to read",
//   body: "Good book",
//   published: true,
// })
//   .then((user) => {
//     console.log(JSON.stringify(user, undefined, 2));
//   })
//   .catch((err) => {
//     console.log(err);
//   });

updatePost(`ckekgp55e04b60892r06jgs3l`, {
  title: "I dont have time",
  published: true,
})
  .then((user) => {
    console.log(JSON.stringify(user, undefined, 2));
  })
  .catch((err) => console.log(err.mesage));

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "How to use GraphQl",
//         body: "You can find the new course here",
//         published: false,
//         author: {
//           connect: {
//             id: "ckeku0gvp04dg0892drlxt13m",
//           },
//         },
//       },
//     },
//     `{id title body published}`
//   )
//   .then((data) => {
//     console.log(data);
//     return prisma.query.users(null, `{id name}`).then((data) => {
//       console.log(JSON.stringify(data, undefined, 2));
//     });
//   });
