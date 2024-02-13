import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();
import path from 'path';

const accessSecret = process.env.ACCESS_SECRET;

const refreshSecret = process.env.REFRESH_SECRET;

const saltRounds = 10;

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
        return true;
    }catch(err){
        return false;
    }
}

function allowedFiles(filename:string):boolean{
    const ext = path.extname(filename).toLowerCase();
    return ['.png','.jpg','.jpeg','.gif'].includes(ext);
}

async function hashedPassword(password:string): Promise<string>{
    const result = await bcrypt.hash(password,saltRounds);
    return result;
}

async function comparePassword(password:string,hash:string):Promise<boolean>{
    const result = await bcrypt.compare(password,hash);
    return result;
}

export default{
    generateToken,
    authenticateToken,
    allowedFiles,
    hashedPassword,
    comparePassword
}