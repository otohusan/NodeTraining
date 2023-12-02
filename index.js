require("dotenv").config();
const express = require("express");
const app = express();
const mysql = require("mysql");

app.use(express.json());

// 接続するMySQLの情報
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASS,
  database: "NodeTraining",
});

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

const followers = [
  { userId: 1, followerId: 2 },
  { userId: 1, followerId: 4 },
  { userId: 1, followerId: 7 },
  { userId: 2, followerId: 1 },
  { userId: 3, followerId: 5 },
  { userId: 4, followerId: 8 },
  { userId: 5, followerId: 4 },
  { userId: 6, followerId: 1 },
  { userId: 7, followerId: 8 },
  { userId: 8, followerId: 9 },
  { userId: 9, followerId: 3 },
  { userId: 10, followerId: 11 },
  { userId: 12, followerId: 3 },
  { userId: 13, followerId: 8 },
  { userId: 4, followerId: 1 },
  { userId: 6, followerId: 7 },
  { userId: 5, followerId: 7 },
  { userId: 2, followerId: 9 },
  { userId: 8, followerId: 5 },
  { userId: 9, followerId: 4 },
  { userId: 10, followerId: 2 },
];

//READ
app.get("/api/users", (req, res) => {
  con.connect(function (err) {
    if (err) return res.status(500).send("データベースに接続できません");
    const sql = "select * from users";
    con.query(sql, function (err, result, fields) {
      if (err) return res.status(500).send("データを取得できません");
      res.send(result);
    });
  });
});

// 試すとこ
app.get("/api/users/type", (req, res) => {
  const type = typeof [2, 3, 4];
  if (!type) res.status(500).send("errorだね");

  res.send(type);
});

//個人のREAD
app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  res.send(user);
});

// 指定したidのfollower情報を取得のREAD
app.get("/api/users/:id/follower", (req, res) => {
  const userFollowers = followers.filter(
    (f) => f.userId === parseInt(req.params.id)
  );
  const followerList = userFollowers.map((f) => {
    const user = users.find((u) => u.id === f.followerId);
    return user ? user : null;
  });

  res.send(followerList);
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

// 存在しないエンドポイントにアクセスしたとき
app.use((req, res, next) => {
  res.status(404).send("404 - Not Found");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
