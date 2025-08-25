const db = require("../config/db");

const createTodo = (req, res) => {
  const { title } = req.body;
  db.query(
    "INSERT INTO todos (user_id, title) VALUES (?, ?)",
    [req.userId, title],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Todo added Successfully" });
    }
  );
};

const getTodos = (req, res) => {
  db.query(
    "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC ",
    [req.userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No todos added yet!",
        });
      }

      res.status(201).json({
        success: true,
        message: "Todos get success fully",
        todos: results,
      });
    }
  );
};

const updateTodo = (req, res) => {
  const { completed } = req.body;
  const todoId = req.params.id;
  db.query(
    "UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?",
    [completed, todoId, req.userId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Todo updated Successfully" });
    }
  );
};

const deleteTodo = (req, res) => {
  const todoId = req.params.id;
  const user_id = req.userId;
  db.query(
    "DELETE FROM todos WHERE id = ? AND user_id = ?",
    [todoId, user_id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Todo deleted successfully" });
    }
  );
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
};
