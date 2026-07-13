const express = require("express");
const app = express();

app.use(express.json());

let students = [];

// GET
app.get("/students", (req, res) => {
  res.json(students);
});

// POST
app.post("/students", (req, res) => {
  students.push(req.body);
  res.json({ message: "Student added" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});