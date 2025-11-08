import express from "express";
import { authMe } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("/me", authMe);

export default userRouter;
