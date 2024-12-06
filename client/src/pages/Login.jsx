import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { Button, Typography, Box, Alert, CircularProgress } from "@mui/material";
import './Login.css'; 

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // State to handle error messages
  const [loading, setLoading] = useState(false); // State to handle loading status
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async () => {
    // Reset error and set loading state
    setError(null);
    setLoading(true);

    // Check if username and password are provided
    if (!username || !password) {
      setLoading(false);
      setError("Please enter both username and password.");
      return;
    }

    const data = { userName: username, password: password };
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, data);
      
      // Reset form and stop loading
      setPassword("");
      setUsername("");
      setLoading(false);

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
      setLoading(false);
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

      {/* Pending message */}
      {loading && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography>Logging in...</Typography>
        </Box>
      )}
      
      {/* Username input */}
      <input
        type="text"
        className="textInput"
        placeholder="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        disabled={loading}
      />

      {/* Password input */}
      <input
        type="password"
        className="textInput"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={loading}
      />
      
      {/* Login button */}
      <Button
        variant="contained"
        color="primary"
        onClick={login}
        sx={{ mt: 2 }}
        fullWidth
        disabled={loading} // Disable button while loading
      >
        {loading ? "Processing..." : "Login"}
      </Button>
    </Box>
  );
}

export default Login;
