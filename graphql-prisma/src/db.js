const users = [
  { id: "1", name: "cesar Gomrz", email: "zootechdrum@gmail.com", age: 27 },
  { id: "2", name: "lisa Gomez", email: "zootechdrum@gmail.com", age: 27 },
];

const posts = [
  {
    id: "1",
    title: "WOrld is backwards",
    body: "lorem ipsum hdfksjdhsk  dfksjhdfjsk",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "farts",
    body: "lorem ipsum hdfksjdhsk  dfksjhdfjsk",
    published: true,
    author: "2",
  },
  {
    id: "3",
    title: "Hells",
    body: "lorem ipsum hdfksjdhsk  dfksjhdfjsk",
    published: true,
    author: "2",
  },
];

const comments = [
  { id: "44", text: "hole", author: "1", postId: "1" },
  { id: "4", text: "shits", author: "2", postId: "2" },
  { id: "6", text: "I love this shit", author: "2", postId: "1" },
];

const db = {
  users,
  posts,
  comments,
};
export { db as default };
