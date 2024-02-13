import { NextFunction } from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const accessSecret = process.env.ACCESS_SECRET;

const refreshSecret = process.env.REFRESH_SECRET;

function generateAccessToken(user:any):string{
    return jwt.sign(user,accessSecret,{expiresIn:'15m'});
}

function authenticateToken(token:string): boolean{
    if(!token){
        return false;
    }


    try{
        const user = jwt.verify(token,accessSecret);
        return true;
    }catch(err){
        return false;
    }
}


module.exports = {
    generateAccessToken,
    authenticateToken
}