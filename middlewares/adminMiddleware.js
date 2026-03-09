
const adminMiddleware = (req, res, next) => {
  // Check if user exists and has the admin role
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, proceed to the controller
  } else {
    return res.status(403).json({ 
      message: "Access denied. Admin privileges required." 
    });
  }
};

module.exports = adminMiddleware;