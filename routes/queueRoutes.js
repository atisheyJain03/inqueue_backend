import express from "express";
import { isLoggedIn } from "../controllers/authController.js";
import {
  changeQueueStatus,
  createQueue,
} from "../controllers/queueController.js";

const router = express.Router();

// CREATE QUEUE
router.post("/createQueue", isLoggedIn, createQueue);

// CHANGE QUEUE STATUS LIKE ACCEPTED , REJECTED , ETC
router.post("/changeQueueStatus", changeQueueStatus);

export default router;
