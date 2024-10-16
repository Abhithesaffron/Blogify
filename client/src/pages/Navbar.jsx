import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext"; 

const Navbar = ({ authState, logout }) => {
  const navigate = useNavigate();

  const goToProfile = () => {
    if (authState.id) {
      navigate(`/profile/${authState.id}`);
    } else {
      // console.log(authState);
      console.error("User ID not found in authState.");
    }
  };

  const logoutnavigate = () => {
    // console.log("first");
    navigate("/login");
    logout();
  };

  return (
    <div className="navbar">
      <div className="links">
        {!authState.status ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/registration">Registration</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/createpost">Create A Post</Link>
          </>
        )}
      </div>
      <div className="loggedInContainer">
        {authState.status && (
          <>
            <div onClick={goToProfile} style={{ cursor: "pointer" }}>
              <h1>{authState.username}</h1>
            </div>
            <button onClick={logoutnavigate}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
