function validateAuthInput(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.status = 400;
    throw error;
  }
  next();
}

module.exports = validateAuthInput;
