const express = require("express");
const app = express();

const courses = [
  { id: 1, name: "computer science" },
  { id: 2, name: "information technology" },
  { id: 3, name: "business intelligence" },
];

//get
app.get("/api/courses", (req, res) => {
  res.send(courses);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
