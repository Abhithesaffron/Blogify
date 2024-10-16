import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CircularProgress,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import { AuthContext } from "../helpers/AuthContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userInfoResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/auth/basicinfo/${id}`
        );
        setUsername(userInfoResponse.data.username);

        const postsResponse = await axios.get(
         `${import.meta.env.VITE_API_BASE_URL}/posts/byuserId/${id}`,
          {
            headers: { accessToken: localStorage.getItem("accessToken") },
          }
        );
        setListOfPosts(postsResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    setTimeout(() => {
      fetchProfile();
    }, 1000);
  }, [id]);

  const handlePasswordChange = () => {
    navigate("/changepassword");
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
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="profilePageContainer" sx={{ padding: "30px" }}>
      {/* Basic User Info */}
      <Box mb={4} display="flex" justifyContent="center">
        <Paper
          elevation={3}
          sx={{
            padding: "50px",
            textAlign: "center",
            width: { xs: "100%", sm: "80%", md: "70%" },
            maxWidth: "800px", // Set maximum width for larger screens
            backgroundColor: "#f5f5f5",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Avatar sx={{ bgcolor: "dodgerblue", width: 120, height: 120 }}>
            <AccountCircleIcon sx={{ fontSize: 100 }} />
          </Avatar>
          <Typography variant="h4">{username}</Typography>
          {authState.username === username && (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePasswordChange}
              sx={{
                width: "80%", // Increase button width
                padding: "20px", // Increase padding for larger size
                fontSize: "16px", // Decrease font size for better fit
                marginTop: "20px",
              }}
            >
              Change My Password
            </Button>
          )}
        </Paper>
      </Box>

      {/* List of Posts */}
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h5" gutterBottom>
          {username}'s Posts
        </Typography>
        <Divider sx={{ width: "80%", marginBottom: "20px" }} />
        {listOfPosts.length > 0 ? (
          listOfPosts.map((post, key) => (
            <Paper
              key={key}
              elevation={2}
              sx={{
                width: { xs: "100%", sm: "80%", md: "70%" },
                maxWidth: "800px", // Set maximum width to match profile box
                marginBottom: "20px",
                borderRadius: "10px",
                transition: "box-shadow 0.3s ease-in-out",
                "&:hover": {
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                },
                cursor: "pointer",
                backgroundColor: "#fafafa",
              }}
              onClick={() => navigate(`/post/${post.postId}`)}
            >
              {/* Post Title with different background color */}
              <Box
                sx={{
                  backgroundColor: "dodgerblue", // Title color
                  padding: "15px",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                  color: "white",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
              </Box>

              {/* Post Body */}
              <Box
                sx={{
                  padding: "20px",
                  color: "#555", // Body text color
                }}
              >
                <Typography variant="body1">{post.postText}</Typography>
              </Box>

              {/* Post Footer with different color */}
              <Box
                sx={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "lightgray", // Footer color
                  borderBottomLeftRadius: "10px",
                  borderBottomRightRadius: "10px",
                }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  Posted by: {username}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Likes: {post.Likes.length}
                </Typography>
              </Box>
            </Paper>
          ))
        ) : (
          <Typography>No posts found for this user.</Typography>
        )}
      </Box>
    </Box>
  );
}

export default Profile;
