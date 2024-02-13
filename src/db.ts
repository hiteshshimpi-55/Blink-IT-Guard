import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
dotenv.config();

const db_path:string = process.env.DB_PATH;
console.log(db_path);
const db = new sqlite3.Database(db_path,sqlite3.OPEN_READWRITE,(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log('Connected to the database');
        // create a table here
        db.run(`CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL
        )`);
    }
}); 

export default db;
