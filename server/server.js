const express = require("express");
const { connectDB } = require("./models/index");
const { ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

async function startServer() {
  const db = await connectDB();
  const collection = db.collection("todos");

  // GET all
  app.get("/todos", async (req, res) => {
    try {
      const todos = await collection.find().toArray();
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch todos" });
    }
  });

  // POST
  app.post("/todos", async (req, res) => {
    try {
      const { _id, todo, status } = req.body;

      if (!todo) {
        return res.status(400).json({ error: "Todo is required" });
      }

      let newTodo = {
        todo,
        status: status ?? false,
        createdAt: new Date()
      };

      if (_id) {
        if (!ObjectId.isValid(_id)) {
          return res.status(400).json({ error: "Invalid ID format" });
        }
        newTodo._id = new ObjectId(_id);
      }

      const result = await collection.insertOne(newTodo);

      res.status(201).json({
        message: "Todo added successfully",
        id: result.insertedId
      });

    } catch (error) {
      res.status(500).json({ error: "Failed to add todo" });
    }
  });

  //  PUT update (FIXED VERSION)
  app.put("/todos/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const { todo, status } = req.body;

      // Build dynamic update object (prevents overwriting with undefined)
      const updateFields = {};

      if (todo !== undefined) updateFields.todo = todo;

      if (status !== undefined) {
        // convert string "true"/"false" to boolean
        updateFields.status =
          typeof status === "string"
            ? status.toLowerCase() === "true"
            : status;
      }

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Todo not found" });
      }

      //  EXACT RESPONSE FORMAT YOU REQUESTED
      res.status(200).json({
        acknowledged: result.acknowledged,
        modifiedCount: result.modifiedCount,
        upsertedId: result.upsertedId ?? null,
        upsertedCount: result.upsertedCount,
        matchedCount: result.matchedCount,
        message: "Todo updated successfully"
      });

    } catch (error) {
      res.status(500).json({ error: "Failed to update todo" });
    }
  });

  // ✅ DELETE (UPDATED FORMAT)
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json({
      Awknowledged: result.acknowledged,   // matches your requested format
      deletecount: result.deletedCount,
      message: "Todo deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

  app.listen(3000, () => {
    console.log("Server is listening on http://localhost:3000/todos");
  });
}

startServer();