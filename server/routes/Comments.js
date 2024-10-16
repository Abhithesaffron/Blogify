const express = require("express");
const router = express.Router();
const { Comments, Users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Get comments for a specific post, including the associated username
router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;

  try {
    // Fetch comments along with the associated username
    const comments = await Comments.findAll({
      where: { postId: postId },
      include: [
        {
          model: Users,
          as: 'user', // Specify the alias used in the association
          attributes: ["username"], // Include username in the response
        },
      ],
    });
    
    return res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "An error occurred while fetching comments." });
  }
});

// Create a new comment
router.post("/", validateToken, async (req, res) => {
  const { commentBody, postId } = req.body; // Destructure comment body and post ID from request body
  const userId = req.user.id;

  try {
    // Create the comment with associated userId and postId
    const newComment = await Comments.create({
      commentBody,
      postId,
      userId,
    });
    
    // Fetch the newly created comment with username included
    const commentWithUser = await Comments.findOne({
      where: { commentId: newComment.commentId },
      include: [
        {
          model: Users,
          as: 'user', // Specify the alias used in the association
          attributes: ["username"], // Include username in the response
        },
      ],
    });

    return res.status(201).json(commentWithUser); // Return newly created comment with status 201
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ error: "An error occurred while creating the comment." });
  }
});

// Delete a comment
router.delete("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;
  // console.log(commentId);
  try {
    // Check if the comment exists before attempting to delete
    const deleted = await Comments.destroy({
      where: { commentId: commentId },

    });

    if (deleted) {
      return res.json({ message: "Comment deleted successfully." });
    } else {
      return res.status(404).json({ error: "Comment not found." });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ error: "An error occurred while deleting the comment." });
  }
});

module.exports = router;
