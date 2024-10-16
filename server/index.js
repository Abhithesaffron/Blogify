const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./models"); // Import your models

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

// Routers
const postRouter = require("./routes/Posts");
const commentsRouter = require("./routes/Comments");
const usersRouter = require("./routes/Users");
const likesRouter = require("./routes/Likes");

app.use("/posts", postRouter);
app.use("/comments", commentsRouter);
app.use("/auth", usersRouter);
app.use("/likes", likesRouter);

// Sync database and start the server
const startServer = async () => {
  try {
    await db.sequelize.sync();
    const PORT = process.env.PORT || 3001; // Use PORT from environment or default to 3001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
