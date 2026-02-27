// index.js
require("dotenv").config();
const express = require("express");
const { connectToMongoDB } = require("./database");
const path = require('path');

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

// Import routes
const router = require("./routes"); // your routes.js
app.use("/api/todos", router); // <-- make sure the path matches fetch

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectToMongoDB();
  console.log("✅ Connected to MongoDB Atlas");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/api/todos`);
  });
};

startServer();