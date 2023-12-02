function admin(req, res, next) {
  // Check if user is authenticated and has admin role
  if (req.user && req.user.role === "admin") {
    // User is authenticated and has admin role, proceed to next middleware
    next();
  } else {
    // User is not authenticated or does not have admin role, return 403 Forbidden error
    res.status(403).json({ error: "Forbidden" });
  }
}

module.exports = admin;
