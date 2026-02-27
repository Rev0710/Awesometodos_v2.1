const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Replace with your deployed frontend URL
const FRONTEND_URL = "https://awesometodos-frontend.onrender.com";

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
const MONGO_URI =
  "mongodb+srv://jrevdelarosa:Delarosa@cluster0.l33ooxq.mongodb.net/MyNewDatabase?retryWrites=true&w=majority";

let db;

async function startServer() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db("MyNewDatabase");
    console.log("✅ Connected to MongoDB");

    const todosCollection = db.collection("todos");

    // ===== Routes =====

    // GET all todos
    app.get("/api/todos", async (req, res) => {
      try {
        const todos = await todosCollection.find().toArray();
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
        const result = await todosCollection.insertOne(newTodo);
        res.status(201).json({ ...newTodo, _id: result.insertedId });
      } catch (err) {
        res.status(500).json({ error: "Failed to create todo" });
      }
    });

    // PUT update todo by ID
    app.put("/api/todos/:id", async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id))
          return res.status(400).json({ error: "Invalid ID format" });

        const { todo, Status } = req.body;

        const updateFields = {};
        if (todo !== undefined) updateFields.todo = todo;
        if (Status !== undefined) updateFields.Status = Status;

        if (Object.keys(updateFields).length === 0)
          return res.status(400).json({ error: "No fields to update" });

        const updated = await todosCollection.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updateFields },
          { returnDocument: "after" }
        );

        if (!updated.value)
          return res.status(404).json({ error: "Todo not found" });

        res.json(updated.value);
      } catch (err) {
        res.status(500).json({ error: "Failed to update todo" });
      }
    });

    // DELETE todo by ID
    app.delete("/api/todos/:id", async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id))
          return res.status(400).json({ error: "Invalid ID format" });

        const result = await todosCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0)
          return res.status(404).json({ error: "Todo not found" });

        res.json({ acknowledged: true, deletedCount: result.deletedCount });
      } catch (err) {
        res.status(500).json({ error: "Failed to delete todo" });
      }
    });

    // Start server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
  }
}

startServer();