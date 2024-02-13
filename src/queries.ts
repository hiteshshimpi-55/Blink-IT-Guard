const createTable: string = `CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
)`;

const insertIntoTable: string = `INSERT INTO users (user_id, password, email) VALUES (?, ?, ?)`;

const findUserById: string = `SELECT * FROM users WHERE user_id = ?`;

export default {
  createTable,
  insertIntoTable,
  findUserById,
};
