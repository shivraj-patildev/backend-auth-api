const pool = require("../config/db");

async function createDocument(name, userId) {
  const result = await pool.query(
    `INSERT INTO documents (name,user_id)
        VALUES($1,$2)
        RETURNING id , name, user_id`,
    [name, userId],
  );
  return result;
}

async function getDocumentsByUserId(userId) {
  const result = await pool.query(
    `SELECT id,name,user_id
        FROM documents
        WHERE user_id = $1
        ORDER BY id
        `,
    [userId],
  );
  return result.rows;
}

async function getDocumentByIdAndUserId(documentId, userId) {
  const result = await pool.query(
    `SELECT id, name,user_id
    FROM documents
    WHERE id = $1 AND user_id = $2`,
    [documentId, userId],
  );
  return result.rows[0];
}

async function updateDocumentByIdAndUserId(documentId, userId, name) {
  const result = await pool.query(
    `UPDATE documents
    SET name = $1
    WHERE id =$2 AND user_id = $3
    RETURNING id, name, user_id`,
    [name, documentId, userId],
  );

  return result.rows[0];
}

async function deleteDocumentByIdAndUserId(documentId, userId) {
  const result = await pool.query(
    `DELETE FROM documents
      WHERE id = $1 AND user_id =$2
      RETURNING id, name, user_id`,
    [documentId, userId],
  );
  return result.rows[0];
}

module.exports = {
  createDocument,
  getDocumentsByUserId,
  getDocumentByIdAndUserId,
  updateDocumentByIdAndUserId,
  deleteDocumentByIdAndUserId,
};
