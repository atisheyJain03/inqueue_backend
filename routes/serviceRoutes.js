import express from "express";
import { isLoggedIn } from "../controllers/authController.js";
import {
  createService,
  deleteService,
  getFullQueue,
  updateService,
} from "../controllers/serviceController.js";
import { isShop } from "../controllers/shopController.js";

const router = express.Router();

// CREATE SERVICE IN SHOP BY ADMIN
router.post("/createService", isLoggedIn, isShop, createService);

router.get("/getQueue/:id", getFullQueue);

// UPDATE SERVICE LIKE AVAILABLE OR NOT AVAILABLE
router.patch("/updateService/:id", updateService);

// DELETE SERVICE BY ADMIN
router.delete("/deleteService/:id", deleteService);

export default router;
