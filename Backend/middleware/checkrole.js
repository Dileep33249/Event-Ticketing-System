module.exports = (...roles) => {
  return (req, res, next) => {
    console.log("CheckRole - Required roles:", roles);
    console.log("CheckRole - User role:", req.user?.role);
    console.log("CheckRole - User object:", req.user);
    
    if (!req.user || !req.user.role) {
      console.log("CheckRole - No user or role found");
      return res.status(403).json({ message: "Forbidden: No user role" });
    }
    
    if (!roles.includes(req.user.role)) {
      console.log("CheckRole - Role not allowed. Required:", roles, "Got:", req.user.role);
      return res.status(403).json({ message: "Forbidden: No permission" });
    }
    
    console.log("CheckRole - Access granted");
    next();
  };
};
