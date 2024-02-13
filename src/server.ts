import express,{Express,Request,Response} from 'express';
import dotenv  from 'dotenv';
import route from "./routes";

dotenv.config();


const app: Express = express();


console.log(`Environments: ${process.env.ACCESS_SECRET}`)

app.use(express.json());

app.use("/api/v1/",route);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

