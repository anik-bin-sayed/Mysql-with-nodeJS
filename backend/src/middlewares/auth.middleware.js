const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../secret");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Token is required",
    });
  }

  jwt.verify(token, jwt_secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.userId = decoded.id;
    next();
  });
};

const isLoggedOut = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (token) {
      return res.status(401).json({
        success: false,
        message: "You are already logged in",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ message: "Token not found. Please login first" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authMiddleware, isLoggedOut, isLoggedIn };
