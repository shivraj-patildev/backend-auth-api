function validateDocument(req, res, next) {
  const { name } = req.body;
  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("Document name is required");
  }

  if (errors.length > 0) {
    const error = new Error("Validation Failed!");
    error.status = 400;
    error.errors = errors;
    return next(error);
  }
  next();
}

module.exports = validateDocument;
