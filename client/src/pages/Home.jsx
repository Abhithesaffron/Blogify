import './home.css';
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";
import { CircularProgress, Box, Typography, Alert } from "@mui/material";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!localStorage.getItem("accessToken")) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        });

        setListOfPosts(response.data.listOfPosts);
        setLikedPosts(response.data.likedPosts.map((like) => like.postId));
      } catch (err) {
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  const likeAPost = async (postId, e) => {
    e.stopPropagation(); // Prevents the post body click event from triggering when liking a post

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/likes`,
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );

      setListOfPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.postId === postId) {
            return {
              ...post,
              Likes: response.data.liked
                ? [...post.Likes, 0]
                : post.Likes.slice(0, -1),
            };
          }
          return post;
        })
      );

      setLikedPosts((prevLikes) =>
        prevLikes.includes(postId)
          ? prevLikes.filter((id) => id !== postId)
          : [...prevLikes, postId]
      );
    } catch (err) {
      setError("Failed to like the post. Please try again later.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={{ padding: '20px' }}>
      {listOfPosts.map((value) => (
        <div
          key={value.postId}
          className="post"
          onClick={() => navigate(`/post/${value.postId}`)} // This will trigger the post navigation
          style={{ cursor: "pointer" }} // Ensures that the whole post looks clickable
        >
          <div className="title">{value.title}</div>
          <div className="body">{value.postText}</div>
          <div className="footer">
            <div className="username">
              <Link
                to={`/profile/${value.userId}`}
                onClick={(e) => e.stopPropagation()} // Prevents post navigation when clicking the username
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {value.user.username}
              </Link>
            </div>
            <div className="buttons">
              <ThumbUpAltIcon
                onClick={(e) => likeAPost(value.postId, e)} // Pass the event object to prevent propagation
                className={
                  likedPosts.includes(value.postId) ? "unlikeBttn" : "likeBttn"
                }
              />
              <label>{value.Likes.length}</label>
            </div>
          </div>
        </div>
      ))}
    </Box>
  );
}

export default Home;
