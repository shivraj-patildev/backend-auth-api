const documentRepository = require("../repositories/documentRepository");

async function createDocument(name, userId) {
  return await documentRepository.createDocument(name, userId);
}

async function getDocumentsByUserId(userId) {
  return await documentRepository.getDocumentsByUserId(userId);
}

module.exports = {
  createDocument,
  getDocumentsByUserId,
};
