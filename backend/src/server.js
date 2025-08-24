const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth.routes");
const todo_Router = require("./routes/todo.route.js");

const { server_port } = require("./secret");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/todos", todo_Router);

app.listen(server_port, () => {
  console.log(`Server is running on http://localhost:${server_port}`);
});
