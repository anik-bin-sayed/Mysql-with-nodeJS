const express = require("express");
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require("../controllers/todo.controller");
const {
  authMiddleware,
  isLoggedIn,
  isLoggedOut,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", isLoggedIn, authMiddleware, createTodo);

router.get("/", isLoggedIn, authMiddleware, getTodos);

router.put("/:id", isLoggedIn, authMiddleware, updateTodo);

router.delete("/:id", isLoggedIn, authMiddleware, deleteTodo);

module.exports = router;
