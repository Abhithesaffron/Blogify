const { verify } = require("jsonwebtoken");

// Middleware to validate JSON Web Token (JWT)
const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  // Check if the access token is provided
  if (!accessToken) {
    return res.status(401).json({ error: "User not logged in!" });
  }

  try {
    // Verify the access token
    const validToken = verify(accessToken, process.env.JWT_SECRET || "importantsecret"); // Use environment variable for secret
    req.user = validToken; // Store the verified token in the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Token verification error:", err.message); // Log the error for debugging
    return res.status(403).json({ error: "Invalid token!" }); // Return forbidden status for invalid token
  }
};

// Export the validateToken function
module.exports = { validateToken };
