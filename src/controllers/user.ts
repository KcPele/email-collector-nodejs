import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";

const privateKey = process.env.PRIVATE_KEY;

//generating token
const generateToken = (id: any): string => {
  return jwt.sign({ _id: id }, privateKey as string, {
    expiresIn: 60 * 60 * 48,
  });
};
//hashing password
const hashingPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

//create new users
const createNewUser = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    try {
      const userData: IUser = req.body;
      let password = userData.password;
      userData.password = await hashingPassword(password);

      const user = await User.create(userData);

      res.status(200).json(user);
    } catch (error: any) {
      if (error.code === 11000) {
        // duplicate key error
        res
          .status(409)
          .json({ message: "user already exists with these email" });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  }
);

const loginUser = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user) {
      res.status(400).json({ error: "Wrong credentials please try again" });
    } else {
      const comparedPass = await bcrypt.compare(password, user.password);
      if (!comparedPass) {
        res.status(400).json({ error: "Wrong credentials please try again" });
      } else {
        const token = generateToken(user._id);

        let { password, ...userData } = user;
        res.status(200).json({
          ...userData,
          token,
        });
      }
    }
  }
);

//updating user
const updateUser = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    let id = req.params?.userId;
    try {
      const user = await User.findById(id);
      if (!user) throw new Error("user not found");
      if (user._id.toString() !== req.user._id.toString())
        throw new Error("you are not authorized to update this user");
      const updateData: IUser = req.body;

      let updatedUser = await User.findByIdAndUpdate({ _id: id }, updateData, {
        new: true,
      }).select("-password");

      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ errors: error.message });
    }
  }
);

//delete users
const deleteUser = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) throw new Error("user not found");
      if (user._id.toString() !== req.user._id.toString())
        throw new Error("you are not authorized to update this user");
      await User.findOneAndRemove({ _id: userId });

      res.status(200).json({
        message: "User has been deleted",
      });
    } catch (error) {
      next(error);
    }
  }
);
export { createNewUser, updateUser, loginUser, deleteUser };
