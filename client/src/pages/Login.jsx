import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { Button, Typography, Box, Alert } from "@mui/material";
import './Login.css'; 

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State to handle error messages
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async () => {
    // Reset error before new login attempt
    setError(null);

    // Check if username and password are provided
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    const data = { userName: username, password: password };
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, data);
      
      // If there's an error message in the response, show it in the UI
      setPassword("");

      setUsername("");
      if (response.data.error) {
        setError(response.data.error);
        return;
      } else {
        // Store the token and update auth state
        localStorage.setItem("accessToken", response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        
        navigate("/"); // Redirect to homepage
      }
    } catch (err) {
      // Handle any errors during the request
      console.error("Login error:", err);
      setError("Failed to log in. Please try again later.");
    }
    
  };

  return (
    <Box className="loginContainer" sx={{ maxWidth: 400, height: 'auto', mx: "auto", mt: 5, padding: 2, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      
      {/* Display any error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Username input */}
      <input
        type="text"
        className="textInput"
        placeholder="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      {/* Password input */}
      <input
        type="password"
        className="textInput"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      
      {/* Login button */}
      <Button
        variant="contained"
        color="primary"
        onClick={login}
        sx={{ mt: 2 }}
        fullWidth
      >
        Login
      </Button>
    </Box>
  );
}

export default Login;
