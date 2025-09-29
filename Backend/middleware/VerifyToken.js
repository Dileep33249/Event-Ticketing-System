const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("VerifyToken - Token received:", token ? "Token present" : "No token");
  console.log("VerifyToken - JWT_SECRET:", process.env.JWT_SECRET ? "Secret present" : "No secret");
  
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }
    
    console.log("JWT decoded successfully:", decoded);
    req.user = decoded;
    next();
  });
};
