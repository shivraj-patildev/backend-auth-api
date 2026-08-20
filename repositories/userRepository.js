const pool = require("../config/db");

async function createUser(user) {
  const result = await pool.query(
    `INSERT INTO users(email,password_hash)
                                   VALUES ($1,$2)`,
    [user.email, user.password_hash],
  );
  return result;
}

async function findUserByEmail(email) {
  const result = await pool.query(
    `
        SELECT *
        FROM users
        WHERE email = $1
        `,
    [email],
  );

  return result.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
};
