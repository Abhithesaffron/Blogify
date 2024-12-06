import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, CircularProgress, Typography, Box } from '@mui/material';

function Registration() {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [usernameExists, setUsernameExists] = useState(false); // State to track if username exists
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Username too short")
      .max(15, "Username too long")
      .required("Username is required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .max(20, "Password is too long")
      .required("Password is required"),
  });

  // Function to check if the username exists
  const checkUsername = async (username) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/check-username`, { username });
      setUsernameExists(response.data.exists);
    } catch (error) {
      console.error("Error checking username", error);
    }
  };

  const onSubmit = (data, { resetForm }) => {
    setIsLoading(true);
    setRegistrationStatus(""); // Reset status message
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth`, data)
      .then((response) => {
        setIsLoading(false);
        setRegistrationStatus("Registration successful! Redirecting to login...");
        resetForm();
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        setIsLoading(false);
        setRegistrationStatus("Registration failed. Please try again.");
      });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      
      {/* Display Registration Status */}
      {registrationStatus && (
        <Typography variant="subtitle1" color={registrationStatus.includes("successful") ? "green" : "red"}>
          {registrationStatus}
        </Typography>
      )}

      {/* Display Loading Message */}
      {isLoading && (
        <Box display="flex" alignItems="center" justifyContent="center" mt={2} mb={2}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Processing your registration...</Typography>
        </Box>
      )}

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched, handleChange }) => (
          <Form>
            <Box mb={3}>
              <Field
                as={TextField}
                name="username"
                label="Username"
                variant="outlined"
                fullWidth
                error={(errors.username && touched.username) || usernameExists}
                helperText={(usernameExists && "Username is already taken") || <ErrorMessage name="username" />}
                onChange={(e) => {
                  handleChange(e);
                  checkUsername(e.target.value); // Check username existence on change
                }}
                value={values.username}
              />
            </Box>
            <Box mb={3}>
              <Field
                as={TextField}
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                error={errors.password && touched.password}
                helperText={<ErrorMessage name="password" />}
              />
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading || usernameExists} // Disable submit if loading or username exists
              >
                {isLoading ? <CircularProgress size={24} /> : "Register"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}

export default Registration;
