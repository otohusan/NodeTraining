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

con.connect(function (err) {
  if (err) return res.status(500).send("データベースに接続できません");
});

// 変更を確認するための関数
function returnUsers(res) {
  const sql = "SELECT * FROM users";
  con.query(sql, function (err, result, fields) {
    if (err) return res.status(500).send("データを取得できません");
    res.send(result);
  });
}

function returnFollowers(res) {
  const sql = "SELECT * FROM followers";
  con.query(sql, function (err, result, fields) {
    if (err) return res.status(500).send("データを取得できません");
    res.send(result);
  });
}

//READ
app.get("/api/users", (req, res) => {
  const sql = "select * from users";
  con.query(sql, function (err, result, fields) {
    if (err) return res.status(500).send("データを取得できません");
    res.send(result);
  });
});

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
app.get("/api/users/:id/followers", (req, res) => {
  const userId = parseInt(req.params.id);

  // followers テーブルと users テーブルを結合してフォロワー情報を取得
  const sql = `
    SELECT users.* 
    FROM users 
    INNER JOIN followers ON users.id = followers.follower_id 
    WHERE followers.following_id = ?
  `;

  con.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).send("データを取得できません");
    }
    res.send(result);
  });
});

// followを可能にするAPI
app.post("/api/users/:id/follow", (req, res) => {
  const follower_id = parseInt(req.params.id);
  const following_id = parseInt(req.body.following_id);

  if (!following_id) {
    return res.status(400).send("following_idが存在しません");
  }

  const sql = "INSERT INTO followers (follower_id, following_id) VALUES (?, ?)";
  con.query(sql, [follower_id, following_id], (err, result) => {
    if (err) {
      return res.status(500).send("フォロー中にエラーが起きました");
    }
    returnFollowers(res);
  });
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
