import express from "express";
import {
  refreshToken,
  signIn,
  signOut,
  signUp,
} from "../controllers/authControllers.js";

const authRouter = express.Router();

// Đăng ký
authRouter.post("/signup", signUp);

// Đăng nhập
authRouter.post("/signin", signIn);

// Đăng xuất
authRouter.post("/signout", signOut);

authRouter.post("/refresh", refreshToken);

export default authRouter;
