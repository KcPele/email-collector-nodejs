import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user";
import { tokenMiddleware } from "../middleware";
import {
  createNewUser,
  deleteUser,
  loginUser,
  updateUser,
} from "../controllers/user";

const router = express.Router();

//get all users
router.get(
  "/",

  asyncHandler(async (req: express.Request, res: express.Response) => {
    const users = await User.find({}).select("email").sort("-createdAt");
    res.status(200).json(users);
  })
);

//get a particular user
router.get(
  "/:userId",
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const { userId } = req.params;
    const users = await User.findById(userId).select("email");
    res.status(200).json(users);
  })
);

// login route to generate user token
router.post("/login", loginUser);
//create a user
router.post(
  "/register",

  createNewUser
);

//creating a new user
router.post("/register", createNewUser);

//update user
router.put("/:userId", tokenMiddleware, updateUser);

//delete a user
router.delete("/:userId", tokenMiddleware, deleteUser);
export default router;
