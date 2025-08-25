import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

//importing local
import connectDb from './config/mongoDb.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 1600;
connectDb();

//middleware

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}));

//api endpoints
app.get('/', (req, res)=>{res.send("hello there beautiful")})
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)


//server

app.listen(PORT, ()=>{
    console.log(`server started at ${PORT}`)}
);