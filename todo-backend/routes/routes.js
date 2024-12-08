const express = require("express");
const Todo = require("../models/Todo");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Get all todos for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new todo
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const todo = new Todo({
      text,
      userId: req.user.id
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error("Error creating todo:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a todo
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.id });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (text !== undefined) todo.text = text;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle todo completion status
router.patch("/:id/toggle", authenticateToken, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.id });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error("Error toggling todo:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a todo
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error("Error deleting todo:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
