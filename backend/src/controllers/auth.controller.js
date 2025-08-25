const db = require("../config/db.js");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const { jwt_secret } = require("../secret");

const signup = (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ১. Check if email already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        // Email already exists
        return res.status(400).json({ message: "Email is already registered" });
      }

      // ২. Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // ৩. Insert new user
      db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.status(201).json({ message: "User registered successfully" });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],

      async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0)
          return res.status(401).json({ message: "User not found" });

        const user = results[0];
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched)
          return res.status(401).json({ message: "Invalid credentials" });

        const accessToken = jsonwebtoken.sign({ id: user.id }, jwt_secret, {
          expiresIn: "1m",
        });
        const refreshToken = jsonwebtoken.sign({ id: user.id }, jwt_secret, {
          expiresIn: "30d",
        });

        res.cookie("token", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 3600000, // 1h
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.status(200).json({
          message: "Login successful",
          userId: user.id,
          username: user.username,
          email: user.email,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

const handleCheckAuth = (req, res) => {
  try {
    const accessToken = req.cookies.token;

    if (!accessToken) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jsonwebtoken.verify(accessToken, jwt_secret);

    db.query(
      "SELECT id, username, email FROM users WHERE id = ?",
      [decoded.id],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: "User not found" });
        }

        const user = results[0];
        res.json({ message: "Authenticated", user: user });
      }
    );
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({
      success: false,
      message: "No refresh token",
    });
  }

  jsonwebtoken.verify(refreshToken, jwt_secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // decoded এর ভেতর id আছে
    db.query(
      "SELECT id FROM users WHERE id = ?",
      [decoded.id],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
          return res.status(401).json({ message: "User not found" });
        }

        const user = results[0];

        const newAccessToken = jsonwebtoken.sign({ id: user.id }, jwt_secret, {
          expiresIn: "1h",
        });

        const newRefreshToken = jsonwebtoken.sign({ id: user.id }, jwt_secret, {
          expiresIn: "7d",
        });

        res.cookie("token", newAccessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 3600000, // 1 hour
        });

        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 দিন
        });

        return res.json({
          success: true,
          message: "Access token refreshed successfully",
          token: newAccessToken,
        });
      }
    );
  });
};

module.exports = {
  signup,
  signin,
  logout,
  handleCheckAuth,
  refreshToken,
};
