const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Like or Unlike a post
router.post("/", validateToken, async (req, res) => {
  const { PostId } = req.body; // Post ID from request body
  const UserId = req.user.id; // User ID from token

  try {
    // Check if the like already exists
    const foundLike = await Likes.findOne({
      where: { postId: PostId, userId: UserId },
    });

    // If the like doesn't exist, create a new like
    if (!foundLike) {
      await Likes.create({ postId: PostId, userId: UserId });
      return res.json({ liked: true, message: "Post liked successfully." });
    } else {
      // If the like exists, delete it
      await Likes.destroy({
        where: { postId: PostId, userId: UserId },
      });
      return res.json({ liked: false, message: "Post unliked successfully." });
    }
  } catch (error) {
    console.error("Error processing like:", error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

module.exports = router;
