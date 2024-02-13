import { Request,Response } from "express";
import utility from "./utils";

const signup = async (req:Request, res:Response) => {
    const {
        user_id,
        password,
        email,
        phone
    } = req.body;

    const accessToken = utility.generateToken({user_id},true);
    const refreshToken = utility.generateToken({user_id},false);

    res.status(200).send({
        message: "User signed up successfully",
        data: {
            accessToken,
            refreshToken
        }
    });
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
export default{
    signup,
    loginUser,
    getRefreshToken,
    getUser
};
