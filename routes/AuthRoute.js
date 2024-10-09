import express from "express";
import { loginUser, logoutUser, UserInfo } from "../controller/AutchC.js";

const authRouter = express.Router();

authRouter.get("/info", UserInfo);
authRouter.post("/login", loginUser);
authRouter.delete("/logout", logoutUser);

export default authRouter;
