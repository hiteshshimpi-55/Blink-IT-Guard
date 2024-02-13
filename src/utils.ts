import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import db from "./db";
import jwt from "jsonwebtoken";
import fs from "fs";

dotenv.config();

export default { dotenv, multer, path, bcrypt, db, jwt, fs };
