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

        const token = jsonwebtoken.sign({ id: user.id }, jwt_secret, {
          expiresIn: "1h",
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 3600000,
        });

        res.status(200).json({
          message: "Login successful",
          token,
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
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

const handleCheckAuth = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jsonwebtoken.verify(token, jwt_secret);

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

module.exports = {
  signup,
  signin,
  logout,
  handleCheckAuth,
};
