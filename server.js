const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Fake in-memory task "database"
const tasks = [];

// POST /tasks → create a new task
app.post("/tasks", (req, res) => {
  const { title, description, status, dueDate } = req.body;

  if (!title || !status || !dueDate) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description: description || "",
    status,
    dueDate,
  };

  tasks.push(newTask);

  res.status(201).json({
    message: "Task created successfully",
    task: newTask,
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
