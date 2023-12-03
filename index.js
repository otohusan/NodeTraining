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
  database: process.env.DB_NAME,
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

con.connect(function (err) {
  if (err) return res.status(500).send("データベースに接続できません");
});

//READ
app.get("/api/users", (req, res) => {
  const sql = "select * from users";
  con.query(sql, function (err, result, fields) {
    if (err) return res.status(500).send("データを取得できません");
    res.send(result);
  });
});

// 変更を確認するための関数
function returnUsers(res) {
  const sql = "SELECT * FROM users";
  con.query(sql, function (err, result, fields) {
    if (err) return res.status(500).send("データを取得できません");
    res.send(result);
  });
}

//個人のREAD
app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const sql = "SELECT * FROM users WHERE id = (?)";

  con.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).send("データを取得できません");
    }
    if (result.length > 0) {
      res.send(result[0]); // ユーザーデータを送信
    } else {
      res.status(404).send("ユーザーが見つかりません"); // ユーザーが見つからない場合
    }
  });
});

// CREATE
app.post("/api/users", (req, res) => {
  const userName = req.body.name;
  if (!userName) {
    return res.status(400).send("名前を入力してください");
  }

  const sql = "INSERT INTO users (name) VALUES (?)";
  con.query(sql, [userName], (err, result) => {
    if (err) return res.status(500).send("データを追加できません");
    returnUsers(res); // 新しいユーザーが追加された後にユーザーリストを返す
  });
});

// UPDATE
app.put("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userName = req.body.name;

  // 入力値の検証
  if (!userName) {
    return res.status(400).send("ユーザー名が指定されていません");
  }

  const sql = "UPDATE users SET name = ? WHERE id = ?";
  con.query(sql, [userName, userId], (err, result) => {
    if (err) {
      return res.status(500).send("ユーザーの更新中にエラーが発生しました");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("このユーザは存在しません");
    }
    returnUsers(res);
  });
});

// DELETE
app.delete("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  const sql = "DELETE FROM users WHERE id = ?";
  con.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).send("ユーザーの削除中にエラーが発生しました");
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("このユーザは存在しません");
    }
    returnUsers(res);
  });
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

  const sql = "SELECT * FROM users WHERE id <= ?";
  con.query(sql, [index], (err, result) => {
    if (err) {
      return res.status(500).send("ユーザーの取得中にエラーが起きました");
    }
    res.send(result);
  });
});

// 存在しないエンドポイントにアクセスしたとき
app.use((req, res, next) => {
  res.status(404).send("404 - Not Found");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
