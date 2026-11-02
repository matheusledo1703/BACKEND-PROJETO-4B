import { Router } from "express";
import { createUser } from "../controllers/user";

const userRouter = Router();

userRouter.post("/users", createUser);

export default userRouter;
