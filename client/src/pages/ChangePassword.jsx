import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, Typography, Box, Alert, CircularProgress } from "@mui/material";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for async request
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(null); // Success state

  const validatePasswords = () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!oldPassword || !newPassword) {
      setError("Both old and new passwords are required.");
      return false;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const changePassword = async () => {
    if (!validatePasswords()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.put(
        `${apiBaseUrl}/auth/changepassword`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setSuccess("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
      }
    } catch (err) {
      setError("An error occurred while changing your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, padding: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Change Your Password
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <TextField
        label="Old Password"
        type="password"
        fullWidth
        value={oldPassword}
        onChange={(event) => setOldPassword(event.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="New Password"
        type="password"
        fullWidth
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={changePassword}
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={24} /> : "Save Changes"}
      </Button>
    </Box>
  );
}

export default ChangePassword;
