import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./auth.db',sqlite3.OPEN_READWRITE,(err)=>{
}); // or provide a file path for a persistent database
