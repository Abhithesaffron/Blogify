import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Registration from "./pages/registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/pagesNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import Navbar from "./pages/Navbar";

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";


function App() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  // console.log(apiBaseUrl)
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  // Set a loading state for the authentication process
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log(apiBaseUrl)
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false); // End loading if no token is found
      return;
    }

    axios
      .get(`${apiBaseUrl}/auth/auth`, {
        headers: {
          accessToken: token,
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ username: "", id: 0, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        setAuthState({ username: "", id: 0, status: false });
      })
      .finally(() => {
        setLoading(false); // End loading after authentication check
      });
  }, []);

  if (loading) {
    // Show a loading message or spinner during authentication check
    return <div>Loading...</div>;
  }
  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    // console.log("second");
  };
  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <Navbar authState={authState} logout={logout} /> {/* Pass setAuthState */}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
