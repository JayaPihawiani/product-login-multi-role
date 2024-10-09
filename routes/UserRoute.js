import express from "express";
import { verifyUser, adminAuth } from "../middleware/AuthM.js";

import {
  createUser,
  deleteUser,
  getUser,
  getUserById,
  updateUser,
} from "../controller/UserC.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(verifyUser, adminAuth, getUser)
  .post(verifyUser, adminAuth, createUser);
userRouter
  .route("/:id")
  .get(verifyUser, adminAuth, getUserById)
  .delete(verifyUser, adminAuth, deleteUser)
  .patch(verifyUser, adminAuth, updateUser);

export default userRouter;
