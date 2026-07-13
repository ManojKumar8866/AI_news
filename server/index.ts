// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";

// dotenv.config();
// const app = express();

// // Connect DB
// connectDB();

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API running 🚀");
// });

// app.listen(5000, () => console.log("Server running on port 5000"));
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
