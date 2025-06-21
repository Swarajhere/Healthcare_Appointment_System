const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("verifyToken: Authorization header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("verifyToken: No token provided or invalid format");
    return res.status(401).json({
      success: false,
      message: "No token provided or invalid format",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("verifyToken: Decoded token:", decoded);
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (error) {
    console.error("verifyToken: Token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const restrictTo = (roles) => (req, res, next) => {
  console.log("restrictTo: User role:", req.user?.role, "Allowed roles:", roles);
  if (!req.user || !roles.includes(req.user.role)) {
    console.error("restrictTo: Access denied for role:", req.user?.role);
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  next();
};

module.exports = { verifyToken, restrictTo };