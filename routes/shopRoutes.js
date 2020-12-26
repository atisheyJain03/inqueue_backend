import express from "express";
import { isLoggedIn, loginShop } from "../controllers/authController.js";
import {
  createShop,
  getAllShops,
  getShop,
  updateCoverPhoto,
  updateCardPhoto,
  updateShop,
  isShop,
  getShopByAdmin,
  resizeCoverPhoto,
  resizeCardPhoto,
} from "../controllers/shopController.js";
import {
  resizeUserPhoto,
  uploadUserPhoto,
} from "../controllers/userController.js";
// import userController from './../controllers/userController');
// import authController from './../controllers/authController.js';

const router = express.Router();

// router.use((req, res, next) =>  {
//     req.body = req.body.data;
//     console.log(req.body)
//     next();
// } )

router.post("/createShop", createShop);
router.get("/getShops", getAllShops);
router.get("/getShop/:id", getShop);
router.patch(
  "/updateShop/coverPhoto/:id",
  uploadUserPhoto,
  resizeCoverPhoto,
  updateCoverPhoto
);
router.patch(
  "/updateShop/cardPhoto/:id",
  uploadUserPhoto,
  resizeCardPhoto,
  updateCardPhoto
);
router.post("/loginShop", loginShop);
router.patch("/updateShop/:id", updateShop);
router.get("/getShopByAdmin", isLoggedIn, isShop, getShopByAdmin);

export default router;
