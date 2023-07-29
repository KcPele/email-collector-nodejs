"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.loginUser = exports.updateUser = exports.createNewUser = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const privateKey = process.env.PRIVATE_KEY;
//generating token
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ _id: id }, privateKey, {
        expiresIn: 60 * 60 * 48,
    });
};
//hashing password
const hashingPassword = async (password) => {
    const salt = await bcrypt_1.default.genSalt(10);
    return await bcrypt_1.default.hash(password, salt);
};
//create new users
const createNewUser = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const userData = req.body;
        let password = userData.password;
        userData.password = await hashingPassword(password);
        const user = await user_1.default.create(userData);
        res.status(200).json(user);
    }
    catch (error) {
        if (error.code === 11000) {
            // duplicate key error
            res
                .status(409)
                .json({ message: "user already exists with these email" });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
});
exports.createNewUser = createNewUser;
const loginUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await user_1.default.findOne({ email }).lean();
    if (!user) {
        res.status(400).json({ error: "Wrong credentials please try again" });
    }
    else {
        const comparedPass = await bcrypt_1.default.compare(password, user.password);
        if (!comparedPass) {
            res.status(400).json({ error: "Wrong credentials please try again" });
        }
        else {
            const token = generateToken(user._id);
            let { password } = user, userData = __rest(user, ["password"]);
            res.status(200).json(Object.assign(Object.assign({}, userData), { token }));
        }
    }
});
exports.loginUser = loginUser;
//updating user
const updateUser = (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    let id = (_a = req.params) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const user = await user_1.default.findById(id);
        if (!user)
            throw new Error("user not found");
        if (user._id.toString() !== req.user._id.toString())
            throw new Error("you are not authorized to update this user");
        const updateData = req.body;
        let updatedUser = await user_1.default.findByIdAndUpdate({ _id: id }, updateData, {
            new: true,
        }).select("-password");
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ errors: error.message });
    }
});
exports.updateUser = updateUser;
//delete users
const deleteUser = (0, express_async_handler_1.default)(async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await user_1.default.findById(userId);
        if (!user)
            throw new Error("user not found");
        if (user._id.toString() !== req.user._id.toString())
            throw new Error("you are not authorized to update this user");
        await user_1.default.findOneAndRemove({ _id: userId });
        res.status(200).json({
            message: "User has been deleted",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.js.map