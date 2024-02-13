import { NextFunction } from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';

const accessSecret = process.env.ACCESS_SECRET;

const refreshSecret = process.env.REFRESH_SECRET;

function generateToken(user:any,isAccess:boolean):string{
    
    const duration:string = isAccess ? '60m' : '7d';
    const secret:string = isAccess ? accessSecret : refreshSecret;
    return jwt.sign(user,secret,{expiresIn:duration});
}


function authenticateToken(token:string,isAccess:boolean): boolean{
    if(!token){
        return false;
    }
    const secret = isAccess ? accessSecret : refreshSecret;
    try{
        const user = jwt.verify(token,secret);
        console.log(user);
        return true;
    }catch(err){
        return false;
    }
}

function allowedFiles(filename:string):boolean{
    const ext = path.extname(filename).toLowerCase();
    return ['.png','.jpg','.jpeg','.gif'].includes(ext);
}

export default{
    generateToken,
    authenticateToken,
    allowedFiles
}