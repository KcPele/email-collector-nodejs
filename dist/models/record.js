"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const RecordSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator_1.default.isEmail, "invalid email"],
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
const RecordModel = mongoose_1.default.model("Record", RecordSchema);
exports.default = RecordModel;
//# sourceMappingURL=record.js.map