import sqlite3 from "sqlite3";
import queries from "./queries";
import dotenv from "dotenv";
dotenv.config();

const db_path: string = process.env.DB_PATH;
const db = new sqlite3.Database(db_path, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to the database");
    // create a table here
    db.run(queries.createTable);
  }
});

export default db;
