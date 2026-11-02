import dotenv from "dotenv";
dotenv.config(); // precisa vir antes de ler process.env

import express from "express";
import cors from "cors";
import { connectToDB } from "./database/sequelize";
import userRouter from "./routes/user";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

connectToDB();

app.use(userRouter);

app.listen(3000, () => console.log("Rodando em http://localhost:3000"));
