const express = require("express");
const {
  signup,
  signin,
  logout,
  handleCheckAuth,
  refreshToken,
} = require("../controllers/auth.controller");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth.middleware");
const route = express.Router();

route.post("/signup", signup);
route.post("/signin", isLoggedOut, signin);
route.post("/logout", isLoggedIn, logout);

route.get("/check-auth", isLoggedIn, handleCheckAuth);

route.post("/refresh-token", refreshToken);

module.exports = route;
