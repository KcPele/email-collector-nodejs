import { Request, Response } from "express";
import RecordModel, { IRecord } from "../models/record";
import asyncHandler from "express-async-handler";
import User from "../models/user";

const getAllRecords = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const records = await RecordModel.find({});

      res.status(200).json({ records });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

const getRecord = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { recordId } = req.params;
      const record = await RecordModel.findById(recordId);
      if (!record) throw new Error("Record not found");
      res.json(record);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

const createRecord = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Extract data from request body
      const { email } = req.body;

      // Validate required fields
      if (!email) {
        throw new Error("Please provide all required fields");
      }

      // Create new record
      const record = new RecordModel({
        user: req.user,
        email,
      });

      // Save record to database
      await record.save();
      // Send response
      res.status(201).json(record);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

const updateRecord = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const recordData: Partial<IRecord> = {
      email,
    };

    // Check if user exists

    const { recordId } = req.params;
    //check if record user is the same as the user updating the record

    try {
      const rec = await RecordModel.findById(recordId);
      if (!rec) throw new Error("Invalid record ID");
      if (rec.user._id.toString() !== req.user._id.toString())
        throw new Error("You are not authorized to update this record");
      const record = await RecordModel.findByIdAndUpdate(
        { _id: recordId },
        recordData,
        {
          new: true,
        }
      );

      res.status(200).json(record);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);
const deleteRecord = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { recordId } = req.params;

      const record = await RecordModel.findById(recordId);
      if (!record) throw new Error("Invalid record ID");
      if (record.user._id.toString() !== req.user._id.toString())
        throw new Error("You are not authorized to delete this record");

      await RecordModel.findByIdAndDelete(recordId);

      res.json({ message: "Record deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

export { getAllRecords, createRecord, deleteRecord, updateRecord, getRecord };
