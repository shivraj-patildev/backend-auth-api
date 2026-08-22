const documentRepository = require("../repositories/documentRepository");

async function createDocument(name, userId) {
  return await documentRepository.createDocument(name, userId);
}

async function getDocumentsByUserId(userId) {
  return await documentRepository.getDocumentsByUserId(userId);
}

async function getDocumentByIdAndUserId(documentId, userId) {
  return documentRepository.getDocumentByIdAndUserId(documentId, userId);
}

async function updateDocumentByIdAndUserId(documentId, userId, name) {
  return documentRepository.updateDocumentByIdAndUserId(
    documentId,
    userId,
    name,
  );
}

module.exports = {
  createDocument,
  getDocumentsByUserId,
  getDocumentByIdAndUserId,
  updateDocumentByIdAndUserId,
};
