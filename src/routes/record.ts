import express from "express";
import {
  createRecord,
  getAllRecords,
  getRecord,
  updateRecord,
  deleteRecord,

} from "../controllers/record";
import { tokenMiddleware } from "../middleware";
const router = express.Router();

//get all records
router.get("/", getAllRecords);

//get a particular record
router.get("/:recordId", getRecord);


//create a new record
router.post("/", tokenMiddleware, createRecord);

//update record base on reord id
router.put(
  "/:recordId",
  tokenMiddleware,

  updateRecord
);

//delete a record
router.delete(
  "/:recordId",
  tokenMiddleware,

  deleteRecord
);

export default router;
