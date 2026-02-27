const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Replace with your deployed frontend URL
const FRONTEND_URL = "https://your-frontend-url.onrender.com";

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// MongoDB setup
const MONGO_URI ="mongodb+srv://jrevdelarosa:Delarosa@cluster0.l33ooxq.mongodb.net/MyNewDatabase?retryWrites=true&w=majority"; // <-- full MongoDB URI here
let db;

async function startServer() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db("MyNewDatabase");
    console.log("Connected to MongoDB");

    // ===== Routes =====

    // GET all todos
    app.get("/api/todos", async (req, res) => {
      try {
        const todos = await db.collection("todos").find().toArray();
        res.json(todos);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch todos" });
      }
    });

    // POST new todo
    app.post("/api/todos", async (req, res) => {
      try {
        const { todo } = req.body;
        if (!todo || todo.trim().length === 0)
          return res.status(400).json({ error: "Todo cannot be empty" });

        const newTodo = { todo, Status: false, createdAt: new Date() };
        const result = await db.collection("todos").insertOne(newTodo);
        res.status(201).json({ ...newTodo, _id: result.insertedId });
      } catch (err) {
        res.status(500).json({ error: "Failed to create todo" });
      }
    });

    // PUT update todo by ID
    app.put("/api/todos/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { todo, Status } = req.body;
        const updated = await db.collection("todos").findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { todo, Status } },
          { returnDocument: "after" }
        );
        res.json(updated.value);
      } catch (err) {
        res.status(500).json({ error: "Failed to update todo" });
      }
    });

    // DELETE todo by ID
    app.delete("/api/todos/:id", async (req, res) => {
      try {
        const { id } = req.params;
        await db.collection("todos").deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "Todo deleted successfully" });
      } catch (err) {
        res.status(500).json({ error: "Failed to delete todo" });
      }
    });

    // Start server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

startServer();