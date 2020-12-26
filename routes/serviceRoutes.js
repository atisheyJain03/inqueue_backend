import express from "express";
import { isLoggedIn } from "../controllers/authController.js";
import {
  createService,
  deleteService,
  getFullQueue,
  updateService,
} from "../controllers/serviceController.js";
import { isShop } from "../controllers/shopController.js";

// import userController from './../controllers/userController');
// import authController from './../controllers/authController.js';

const router = express.Router();

// router.use((req, res, next) =>  {
//     req.body = req.body.data;
//     console.log(req.body)
//     next();
// } )

router.post("/createService", isLoggedIn, isShop, createService);
router.get("/getQueue/:id", getFullQueue);
router.patch("/updateService/:id", updateService);
router.delete("/deleteService/:id", deleteService);

export default router;
