import { Request,Response } from "express";
import "./utils.ts";

const createUser = async (req: Request, res: Response)=>{
    const {
        userId,
        userName,
        password,
        email,
    } = req.body;
    
    console.log("Creating a user. . . ");

    const accessToken = generateAccessToken({
        userId,
        userName,
        email,
    });
    res.status(200).send({
        message: "User created successfully",
        data: {
            userId,
            userName,
            email,
        }
    })
}

function generateAccessToken(arg0: {}) {
    throw new Error("Function not implemented.");
}
