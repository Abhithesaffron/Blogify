import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { CircularProgress, Box, Typography, Alert, Button } from "@mui/material"; // For UI improvement

function CreatePost() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { authState } = useContext(AuthContext);
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error handling

  const navigate = useNavigate();

  const initialValues = {
    title: "",
    postText: "",
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, [navigate]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().min(3, "Title must be at least 3 characters").required("Title is required!"),
    postText: Yup.string().min(10, "Post text must be at least 10 characters").required("Post text is required!"),
  });

  const onSubmit = async (data, { setSubmitting, resetForm }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${apiBaseUrl}/posts`, data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      });
      setSubmitting(false);
      resetForm();
      navigate("/");
    } catch (err) {
      setError("Failed to create the post. Please try again.");
      setSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createPostPage">
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 3, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create a New Post
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
        >
          {({ isSubmitting }) => (
            <Form className="formContainer">
              <label htmlFor="inputCreatePostTitle">Title:</label>
              <ErrorMessage name="title" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePostTitle"
                name="title"
                placeholder="(Ex. Title...)"
              />

              <label htmlFor="inputCreatePostText">Post:</label>
              <ErrorMessage name="postText" component="span" />
              <Field
                autoComplete="off"
                id="inputCreatePostText"
                name="postText"
                placeholder="(Ex. Post...)"
                as="textarea" // Render as textarea for better post writing experience
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={isSubmitting || loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : "Create Post"}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </div>
  );
}

export default CreatePost;
