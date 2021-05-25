import express from "express";
import { isLoggedIn } from "../controllers/authController.js";
import {
  changeQueueStatus,
  createQueue,
  createTicketByAdmin,
} from "../controllers/queueController.js";

const router = express.Router();

// CREATE QUEUE
router.post("/createQueue", isLoggedIn, createQueue);

// CHANGE QUEUE STATUS LIKE ACCEPTED , REJECTED , ETC
router.post("/changeQueueStatus", changeQueueStatus);
router.post("/generateTicket/:id", createTicketByAdmin);
// router.post("/sendSMS", sms);
export default router;
