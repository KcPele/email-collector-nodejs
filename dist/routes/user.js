"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_1 = __importDefault(require("../models/user"));
const middleware_1 = require("../middleware");
const user_2 = require("../controllers/user");
const router = express_1.default.Router();
//get all users
router.get("/", (0, express_async_handler_1.default)(async (req, res) => {
    const users = await user_1.default.find({}).select("email").sort("-createdAt");
    res.status(200).json(users);
}));
//get a particular user
router.get("/:userId", (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.params;
    const users = await user_1.default.findById(userId).select("email");
    res.status(200).json(users);
}));
// login route to generate user token
router.post("/login", user_2.loginUser);
//create a user
router.post("/register", user_2.createNewUser);
//creating a new user
router.post("/register", user_2.createNewUser);
//update user
router.put("/:userId", middleware_1.tokenMiddleware, user_2.updateUser);
//delete a user
router.delete("/:userId", middleware_1.tokenMiddleware, user_2.deleteUser);
exports.default = router;
//# sourceMappingURL=user.js.map