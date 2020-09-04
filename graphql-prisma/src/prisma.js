import { Prisma, makePrismaBindingClass } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
});

// prisma.query.users(null, `{id name}`).then((data) => {
//   console.log(data);
// });

// prisma.query.comments(null, `{id text author {id name}}`).then((data) => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

//prisma.query.posts(null, `{id title}`).then((data) => console.log(data));

const updatePost = async (postId, data) => {
  const post = await prisma.mutation.updatePost(
    {
      data: {
        ...data,
      },
      where: {
        id: postId,
      },
    },
    `{id title body published author { id }}`
  );
  let author = post.author.id;

  const user = await prisma.query.user(
    {
      where: { id: author },
    },
    `{id name email post { id title published} }`
  );

  return user;
};

updatePost(`ckekgp55e04b60892r06jgs3l`, {
  title: "I dont have time",
  published: true,
}).then((user) => {
  console.log(JSON.stringify(user, undefined, 2));
});

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
