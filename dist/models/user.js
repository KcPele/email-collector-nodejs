"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as dotenv from "dotenv";
const validator_1 = __importDefault(require("validator"));
// dotenv.config();
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator_1.default.isEmail, "invalid email"],
    },
    password: { type: String, required: true },
}, { timestamps: true });
const User = (0, mongoose_1.model)("User", schema);
exports.default = User;
//# sourceMappingURL=user.js.map