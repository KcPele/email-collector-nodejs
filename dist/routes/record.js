"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const record_1 = require("../controllers/record");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
//get all records
router.get("/", record_1.getAllRecords);
//get a particular record
router.get("/:recordId", record_1.getRecord);
//create a new record
router.post("/", middleware_1.tokenMiddleware, record_1.createRecord);
//update record base on reord id
router.put("/:recordId", middleware_1.tokenMiddleware, record_1.updateRecord);
//delete a record
router.delete("/:recordId", middleware_1.tokenMiddleware, record_1.deleteRecord);
exports.default = router;
//# sourceMappingURL=record.js.map