function validateAuthInput(req, res, next) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.status = 400;
    return next(error);
  }
  if (typeof email !== "string" || typeof password !== "string") {
    const error = new Error("Email and password must be strings");
    error.status = 400;
    return next(error);
  }
  next();
}

module.exports = validateAuthInput;
