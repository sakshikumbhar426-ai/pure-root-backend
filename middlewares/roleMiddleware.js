const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const userRole = req.user.role.toLowerCase();
    const requiredRoles = allowedRoles.map(role => role.toLowerCase());

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Forbidden: Your role (${userRole}) does not have permission.`,
      });
    }

    next();
  };
};

export default roleMiddleware;