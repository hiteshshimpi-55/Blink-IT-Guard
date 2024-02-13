import express,{Express,Request,Response} from 'express';
import dotenv  from 'dotenv';
import route from "./routes";

dotenv.config();


const app: Express = express();

app.use(express.json());

app.use("/api/v1/",route);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

