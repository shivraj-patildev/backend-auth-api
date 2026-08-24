function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const error = new Error(`${role} access required`);
      error.status = 403;
      return next(error);
    }
    next();
  };
}

module.exports = requireRole;
