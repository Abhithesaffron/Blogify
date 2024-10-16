const express = require("express");
const router = express.Router();
const { Posts, Likes, Users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

// Fetch all posts along with their likes and usernames
router.get("/", validateToken, async (req, res) => {
  try {
    const listOfPosts = await Posts.findAll({
      include: [
        {
          model: Likes,
          required: false, // Include likes even if there are none
        },
        {
          model: Users,
          as: 'user', // Use the alias defined in the association
          attributes: ['username'], // Include username in the response
        },
      ],
    });

    const likedPosts = await Likes.findAll({
      where: { userId: req.user.id },
      attributes: ['postId'], // Only get the postId for the liked posts
    });

    res.json({
      listOfPosts,
      likedPosts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "An error occurred while retrieving posts." });
  }
});

// Fetch a single post by its ID, including the username
router.get("/byId/:id", validateToken, async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Posts.findOne({
      where: { postId: postId },
      include: [
        {
          model: Users,
          as: 'user', // Use the alias defined in the association
          attributes: ['username'], // Include username
        },
      ],
    });

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "No post found with this ID." });
    }
  } catch (error) {
    console.error("Error retrieving post:", error);
    res.status(500).json({ error: "An error occurred while retrieving the post." });
  }
});

// Fetch posts by user ID, including the username
router.get("/byuserId/:id", validateToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const listOfPosts = await Posts.findAll({
      where: { userId: userId },
      include: [
        {
          model: Users,
          as: 'user', // Use the alias defined in the association
          attributes: ['username'], // Include username
        },
        {
          model: Likes,
          attributes: ['postId', 'userId'], // Include relevant attributes from Likes
          required: false, // Include likes even if there are none
        },
      ],
    });

    res.json(listOfPosts);
  } catch (error) {
    console.error("Error fetching posts by user ID:", error);
    res.status(500).json({ error: "An error occurred while retrieving the posts." });
  }
});


// Create a new post
router.post("/", validateToken, async (req, res) => {
  const postData = {
    ...req.body,
    userId: req.user.id, // Automatically set userId from the token
  };

  try {
    const newPost = await Posts.create(postData);
    res.status(201).json(newPost); // Return the created post with 201 status
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "An error occurred while creating the post." });
  }
});

// Update the title of a post
router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;

  try {
    const updatedPost = await Posts.update(
      { title: newTitle },
      { where: { postId: id } }
    );

    if (updatedPost[0] === 0) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.json({ message: "Title updated successfully.", newTitle });
  } catch (error) {
    console.error("Error updating title:", error);
    res.status(500).json({ error: "An error occurred while updating the title." });
  }
});

// Update the text of a post
router.put("/postText", validateToken, async (req, res) => {
  const { newText, id } = req.body;

  try {
    const updatedPost = await Posts.update(
      { postText: newText },
      { where: { postId: id } }
    );

    if (updatedPost[0] === 0) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.json({ message: "Post text updated successfully.", newText });
  } catch (error) {
    console.error("Error updating post text:", error);
    res.status(500).json({ error: "An error occurred while updating the post text." });
  }
});

// Delete a post by ID
router.delete("/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  
  try {
    const deletedPost = await Posts.destroy({
      where: { postId: postId },
    });
    console.log(deletedPost);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "An error occurred while deleting the post." });
  }
});

module.exports = router;
