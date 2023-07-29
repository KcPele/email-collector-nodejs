"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecord = exports.updateRecord = exports.deleteRecord = exports.createRecord = exports.getAllRecords = void 0;
const record_1 = __importDefault(require("../models/record"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const getAllRecords = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const records = await record_1.default.find({});
        res.status(200).json({ records });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllRecords = getAllRecords;
const getRecord = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { recordId } = req.params;
        const record = await record_1.default.findById(recordId);
        if (!record)
            throw new Error("Record not found");
        res.json(record);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getRecord = getRecord;
const createRecord = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        // Extract data from request body
        const { email } = req.body;
        // Validate required fields
        if (!email) {
            throw new Error("Please provide all required fields");
        }
        // Create new record
        const record = new record_1.default({
            user: req.user,
            email,
        });
        // Save record to database
        await record.save();
        // Send response
        res.status(201).json(record);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createRecord = createRecord;
const updateRecord = (0, express_async_handler_1.default)(async (req, res) => {
    const { email } = req.body;
    const recordData = {
        email,
    };
    // Check if user exists
    const { recordId } = req.params;
    //check if record user is the same as the user updating the record
    try {
        const rec = await record_1.default.findById(recordId);
        if (!rec)
            throw new Error("Invalid record ID");
        if (rec.user._id.toString() !== req.user._id.toString())
            throw new Error("You are not authorized to update this record");
        const record = await record_1.default.findByIdAndUpdate({ _id: recordId }, recordData, {
            new: true,
        });
        res.status(200).json(record);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateRecord = updateRecord;
const deleteRecord = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const { recordId } = req.params;
        const record = await record_1.default.findById(recordId);
        if (!record)
            throw new Error("Invalid record ID");
        if (record.user._id.toString() !== req.user._id.toString())
            throw new Error("You are not authorized to delete this record");
        await record_1.default.findByIdAndDelete(recordId);
        res.json({ message: "Record deleted" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteRecord = deleteRecord;
//# sourceMappingURL=record.js.map