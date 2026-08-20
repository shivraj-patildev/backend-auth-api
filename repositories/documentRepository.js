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

module.exports = {
  createDocument,
  getDocumentsByUserId,
};
