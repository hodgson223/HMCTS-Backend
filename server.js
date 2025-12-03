// backend/server.js
require("dotenv").config(); // load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Task Schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, required: true },
  dueDate: { type: Date, required: true },
});

const Task = mongoose.model("Task", TaskSchema);

// POST /tasks → create new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    // validation
    if (!title || !status || !dueDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newTask = new Task({ title, description, status, dueDate });
    const savedTask = await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Optional: GET /tasks to see all tasks (for testing)
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
