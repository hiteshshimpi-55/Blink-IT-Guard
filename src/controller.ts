import { Request,Response } from "express";
import utility from "./utils";
import db  from "./db";

const signup = async (req: Request, res: Response) => {
    const {
        user_id,
        password,
        email
    } = req.body;

    try {
        // Check if the user already exists in the database
        const existingUser = await getUserById(user_id);
        if (existingUser) {
            return res.status(400).send({
                message: "User already exists"
            });
        }

        // Hash the password
        const hashedPassword = await utility.hashedPassword(password);

        // Create a new user in the database
        await createUser(user_id, hashedPassword, email);

        // Generate access and refresh tokens
        const accessToken = utility.generateToken({ user_id }, true);
        const refreshToken = utility.generateToken({ user_id }, false);

        res.status(200).send({
            message: "User signed up successfully",
            data: {
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error("Error signing up user:", error);
        res.status(500).send({
            message: "Internal server error"
        });
    }
};

const loginUser = async (req: Request, res: Response)=>{
    const {
        user_id,
        password,
    } = req.body;


    // read from table to compare password. The password is hashed and so should be decrypted

    const accessToken = utility.generateToken({user_id},true);
    const refreshToken = utility.generateToken({user_id},false);

    res.status(200).send({
        message: "User logged in successfully",
        data: {
            accessToken,
            refreshToken
        }
    });
}


const getRefreshToken = async(req:Request, res:Response) => {
    const {
        refreshToken
    } = req.body;

    const isAuth = utility.authenticateToken(refreshToken,false);
    if(isAuth){
        const accessToken = utility.generateToken({user_id: "user_id"},true);
        res.status(200).send({
            message: "User is authenticated",
            data: {
                accessToken
            }
        });
    }else{
        res.status(403).send({
            message: "User is not authenticated",
        });
    }
}
const getUser = async(req:Request,res:Response)=>{
    const header = req.headers['authorization'];
    const token = header.split(' ')[1];
    console.log(`token received : ${token}`);
    const isAuth = utility.authenticateToken(token,true);
    if(isAuth){
        res.status(200).send({
            message: "User is authenticated",
        });
    }else{
        res.status(403).send({
            message: "User is not authenticated",
        });
    }

}


async function getUserById(user_id: string): Promise<any> {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE user_id = ?", [user_id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

async function createUser(user_id: string, password: string, email: string): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO users (user_id, password, email) VALUES (?, ?, ?)",
            [user_id, password, email],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
    });
}

export default{
    signup,
    loginUser,
    getRefreshToken,
    getUser
};
