const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { sign } = require("jsonwebtoken");

// User Registration
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." }); // 400 for bad request
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Users.create({ username, password: hashedPassword });
    return res.status(201).json({ message: "User registered successfully!" }); // 201 for created
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "An error occurred during registration." });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { userName, password } = req.body;

  try {
    // Find the user by username
    const user = await Users.findOne({ where: { username: userName } });

    if (!user) {
      return res.status(401).json({ error: "User not found" }); // 401 for unauthorized
    }

    // Compare the password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Wrong username or password combination." }); // 401 for invalid credentials
    }

    // Generate an access token
    const accessToken = sign(
      { username: user.username, id: user.userId },
      process.env.JWT_SECRET || "importantsecret", // Use environment variable for secret
      { expiresIn: '1d' } // Token expiration time set to 1 day
    );

    return res.json({ token: accessToken, username: user.username, id: user.userId });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "An error occurred during login. Please try again later." });
  }
});

// Authentication Check
router.get("/auth", validateToken, (req, res) => {
  res.json(req.user); // Send user data if token is valid
});

// Get Basic Info by User ID
router.get("/basicinfo/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const basicInfo = await Users.findByPk(id, {
      attributes: { exclude: ["password"] }, // Exclude password from response
    });

    if (!basicInfo) {
      return res.status(404).json({ error: "User not found." }); // 404 for not found
    }

    return res.json(basicInfo);
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).json({ error: "An error occurred while fetching user info." });
  }
});

// Check Username Availability
router.post("/check-username", async (req, res) => {
  const { username } = req.body;

  try {
    const user = await Users.findOne({ where: { username } });
    return res.json({ exists: !!user }); // Return true or false for existence
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({ error: "An error occurred while checking username." });
  }
});

// Change Password
router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await Users.findOne({ where: { username: req.user.username } });

    if (!user) {
      return res.status(404).json({ error: "User not found." }); // 404 for not found
    }

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      return res.status(403).json({ error: "Wrong password entered!" }); // 403 for forbidden
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Users.update({ password: hashedPassword }, { where: { username: req.user.username } });

    return res.json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: "An error occurred while changing the password." });
  }
});

module.exports = router;
