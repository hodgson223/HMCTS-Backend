require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/tasks", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ------------------------ TASK SCHEMA ------------------------
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, required: true },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", TaskSchema);

// ------------------------ ROUTES ------------------------

// GET /tasks → get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({ tasks }); // returns { tasks: [...] }
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Server error fetching tasks" });
  }
});

// POST /tasks → create new task
app.post("/tasks", async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  if (!title || !status || !dueDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newTask = new Task({ title, description, status, dueDate });
    const savedTask = await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      task: savedTask,
    });
  } catch (err) {
    console.error("Error saving task:", err);
    res.status(500).json({ error: "Server error saving task" });
  }
});

// ------------------------ START SERVER ------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
