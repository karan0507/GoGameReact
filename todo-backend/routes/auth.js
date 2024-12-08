const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// Input validation middleware
const validateInput = (req, res, next) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({
      message: "All fields are required",
      errors: {
        username: !username ? "Username is required" : null,
        password: !password ? "Password is required" : null
      }
    });
  }

  // Username validation
  if (username.length < 3) {
    return res.status(400).json({
      message: "Invalid username format",
      errors: {
        username: "Username must be at least 3 characters long"
      }
    });
  }

  if (username.length > 20) {
    return res.status(400).json({
      message: "Invalid username format",
      errors: {
        username: "Username cannot exceed 20 characters"
      }
    });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(400).json({
      message: "Invalid password format",
      errors: {
        password: "Password must be at least 6 characters long"
      }
    });
  }

  if (password.length > 50) {
    return res.status(400).json({
      message: "Invalid password format",
      errors: {
        password: "Password cannot exceed 50 characters"
      }
    });
  }

  next();
};

// Register
router.post("/register", validateInput, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Registration failed",
        errors: {
          username: "Username is already taken"
        }
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: "Registration successful! Welcome aboard! ",
      user: { id: user._id, username: user.username },
      token
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed",
      errors: {
        server: "An unexpected error occurred. Please try again later."
      }
    });
  }
});

// Login
router.post("/login", validateInput, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Login failed",
        errors: {
          auth: "Invalid username or password"
        }
      });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        message: "Login failed",
        errors: {
          auth: "Invalid username or password"
        }
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: "Welcome back! ",
      user: { id: user._id, username: user.username },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      errors: {
        server: "An unexpected error occurred. Please try again later."
      }
    });
  }
});

// Verify token and return user data
router.get("/verify", async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user data (excluding password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    console.error("Error in verify endpoint:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
