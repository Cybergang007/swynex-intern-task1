const db = require("../db/database");

const getAllTasks = (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks ORDER BY id DESC").all();
  res.status(200).json({ success: true, count: tasks.length, data: tasks });
};

const getTaskById = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Task ID must be a positive integer." });
  }
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  if (!task) return res.status(404).json({ success: false, message: "Task not found." });
  return res.status(200).json({ success: true, data: task });
};

const createTask = (req, res) => {
  const { title, description = "", completed = false } = req.body || {};
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ success: false, message: "Title is required and must be a non-empty string." });
  }
  if (title.trim().length > 120) {
    return res.status(400).json({ success: false, message: "Title must be 120 characters or fewer." });
  }
  if (typeof description !== "string") {
    return res.status(400).json({ success: false, message: "Description must be a string." });
  }
  if (description.length > 1000) {
    return res.status(400).json({ success: false, message: "Description must be 1000 characters or fewer." });
  }
  if (typeof completed !== "boolean") {
    return res.status(400).json({ success: false, message: "Completed must be a boolean." });
  }

  const result = db.prepare(
    "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)"
  ).run(title.trim(), description.trim(), completed ? 1 : 0);
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(result.lastInsertRowid);
  return res.status(201).json({ success: true, message: "Task created.", data: task });
};

const updateTask = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Task ID must be a positive integer." });
  }
  const existing = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ success: false, message: "Task not found." });

  const body = req.body || {};
  const title = body.title === undefined ? existing.title : body.title;
  const description = body.description === undefined ? existing.description : body.description;
  const completed = body.completed === undefined ? Boolean(existing.completed) : body.completed;

  if (typeof title !== "string" || !title.trim() || title.trim().length > 120) {
    return res.status(400).json({ success: false, message: "Title must be a non-empty string of at most 120 characters." });
  }
  if (typeof description !== "string" || description.length > 1000) {
    return res.status(400).json({ success: false, message: "Description must be a string of at most 1000 characters." });
  }
  if (typeof completed !== "boolean") {
    return res.status(400).json({ success: false, message: "Completed must be a boolean." });
  }

  db.prepare(
    "UPDATE tasks SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).run(title.trim(), description.trim(), completed ? 1 : 0, id);
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  return res.status(200).json({ success: true, message: "Task updated.", data: task });
};

const deleteTask = (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: "Task ID must be a positive integer." });
  }
  const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  if (!result.changes) return res.status(404).json({ success: false, message: "Task not found." });
  return res.status(200).json({ success: true, message: "Task deleted." });
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
