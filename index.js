const express = require("express");
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: "Maeda Junya" },
  { id: 2, name: "Ito Ayase" },
  { id: 3, name: "Kubo Ritsu" },
  { id: 4, name: "Kubo Ritsu" },
  { id: 5, name: "Kubo Ritsu" },
  { id: 6, name: "Kubo Ritsu" },
  { id: 7, name: "Kubo Ritsu" },
  { id: 8, name: "Kubo Ritsu" },
  { id: 9, name: "Kubo Ritsu" },
  { id: 10, name: "Kubo Ritsu" },
  { id: 11, name: "Kubo Ritsu" },
  { id: 12, name: "Kubo Ritsu" },
  { id: 13, name: "Kubo Ritsu" },
];

//READ
app.get("/api/users", (req, res) => {
  res.send(users);
});

//個人のREAD
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  res.send(user);
});

//indexまでの個人のREAD
app.get("/api/users/portion/:index", (req, res) => {
  const index = parseInt(req.params.index);

  const usersByIndex = users.slice(0, index);
  if (index > users.length) return res.status(500).send("indexが大きすぎます");

  res.send(usersByIndex);
});

// CREATE
app.post("/api/users", (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
  };
  users.push(newUser);
  res.send(users);
});

// UPDATE
app.put("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(500).send("このユーザは存在しません");
  user.name = req.body.name;
  res.send(users);
});

// DELETE
app.delete("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(500).send("このユーザは存在しません");

  const index = users.indexOf(user);
  users.splice(index, 1);

  res.send(users);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
