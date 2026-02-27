// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const router = require("./routes"); // your routes.js
const { connectToMongoDB } = require("./database");

const app = express();
app.use(express.json());

// ✅ CORS setup - allow frontend to access backend
app.use(cors({
  origin: "https://your-frontend-url.onrender.com", // replace with your deployed frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Serve static files if backend serves frontend (optional)
app.use(express.static(path.join(__dirname, 'build')));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

// Use your routes
app.use("/api/todos", router);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectToMongoDB();
  console.log("✅ Connected to MongoDB Atlas");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/api/todos`);
  });
};

startServer();