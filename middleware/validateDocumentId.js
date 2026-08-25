function validateDocumentId(req, res, next) {
  const documentId = Number(req.params.id);

  if (!Number.isInteger(documentId) || documentId <= 0) {
    const error = new Error("Invalid document Id");
    error.status = 400;
    return next(error);
  }
  next();
}
module.exports = validateDocumentId;
