import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import { CircularProgress, Box, Typography, Button, Alert, Paper } from "@mui/material";
import './post.css'; // Import the CSS file for the Post component

function Post() {
  const { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch post and comments
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts/byId/${id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        });
        setPostObject(postResponse.data);
        
        const commentsResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/comments/${id}`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        });
        // console.log(commentsResponse);
        setComments(commentsResponse.data);
      } catch (err) {
        setError("Failed to load post or comments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  // console.log(postObject);

  const addComment = async () => {
    try {
      const response = await axios.post(
       `${import.meta.env.VITE_API_BASE_URL}/comments`,
        { commentBody: newComment, postId: id },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );
  
      // Add the new comment to the comments list
      if (response.data.error) {
         setError(response.data.error);
      } else {
        // console.log(response.data);
        setComments((prevComments) => [...prevComments, response.data]); 
        setNewComment(""); // Clear the input field after success
      }
    } catch (err) {
      setError("Failed to add comment. Please try again.");
    }
  };
  

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      });

      setComments(comments.filter((val) => val.commentId !== commentId));
    } catch (err) {
      setError("Failed to delete comment. Please try again.");
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      });

      navigate("/"); // Navigate back to homepage after deletion
    } catch (err) {
      setError("Failed to delete post. Please try again.");
    }
  };

  const editPost = async (option) => {
    if (option === "title") {
      const newTitle = prompt("Enter New Title:");
      if (newTitle) {
        await axios.put(
         `${import.meta.env.VITE_API_BASE_URL}/posts/title`,
          { newTitle, id },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        );
        setPostObject({ ...postObject, title: newTitle });
      }
    } else {
      const newPostText = prompt("Enter New Text:");
      if (newPostText) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/posts/postText`,
          { newText: newPostText, id },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        );
        setPostObject({ ...postObject, postText: newPostText });
      }
    }
  };

  // Display loading spinner while fetching data
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Display error message if any errors occur
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="postPage" display="flex" justifyContent="space-between" p={3}>
      {/* Left Side: Post Content */}
      <Box className="leftSide" flex={1} mr={2}>
        <Paper className="post" id="individual" sx={{ padding: 3 }}>
          <Typography
            variant="h4"
            className="title"
            onClick={() => {
              if (authState.id === postObject.userId) {
                editPost("title");
              }
            }}
          >
            {postObject.title}
          </Typography>
          <Typography
            variant="body1"
            className="body"
            onClick={() => {
              if (authState.id === postObject.userId) {
                editPost("body");
              }
            }}
          >
            {postObject.postText}
          </Typography>
          <Box className="footer" display="flex" justifyContent="space-between" mt={3}>
            <Typography variant="subtitle2" onClick={() => navigate(`/profile/${postObject.userId}`)}>Posted by: {postObject.user.username}</Typography>
            {authState.id === postObject.userId && (
              <Button
                variant="contained"
                color="error"
                onClick={() => deletePost(postObject.postId)}
              >
                Delete Post
              </Button>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Right Side: Comments Section */}
      <Box className="rightSide" flex={1} ml={2}>
        <Box className="addCommentContainer" mb={2}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            className="commentInput"
          />
          <button className="addCommentButton" onClick={addComment}>
            Add Comment
          </button>
        </Box>
        <Box className="listOfComments">
          {comments.map((comment, key) => (
            
            <Paper key={key} className="comment" sx={{ mb: 2, p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography>{comment.commentBody}</Typography>
                {authState.id === comment.userId && (
                  <button
                    className="deleteCommentButton"
                    onClick={() => deleteComment(comment.commentId)}
                  >
                    Delete
                  </button>
                )}
              </Box>
              <Typography variant="subtitle2">User: {comment.user.username}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Post;
