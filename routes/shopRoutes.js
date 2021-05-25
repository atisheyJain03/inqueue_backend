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
  getWaitingList,
  getServiceofShop,
} from "../controllers/shopController.js";
import { uploadUserPhoto } from "../controllers/userController.js";

const router = express.Router();

// @DUMMY THIS IS DUMMY ROUTE USED TO CREATE SHOP WITH TEST DATA
router.post("/createShop", createShop);

router.get("/getShops", getAllShops); // @ROUTE GET ALL SHOPS
router.get("/getShop/:id", getShop); // @ROUTE GET A SHOP WITH GIVEN ID OF SHOP

// @ROUTE FOR UPDATE SHOP COVER PHOTO
router.patch(
  "/updateShop/coverPhoto/:id",
  uploadUserPhoto,
  resizeCoverPhoto,
  updateCoverPhoto
);

// @ROUTE FOR UPDATE SHOP CARD PHOTO (WHICH WILL DISPLAY ON SURFING (/getShops) ROUTE )
router.patch(
  "/updateShop/cardPhoto/:id",
  uploadUserPhoto,
  resizeCardPhoto,
  updateCardPhoto
);

// router.post("/loginShop", loginShop);

// UPDATE SHOP CONTENT LIKE ADDRESS,INFO,DESCRIPTION ,NAME ,TYPE,ETC...
router.patch("/updateShop/:id", updateShop);

// GET LIST OF WAITING QUEUE LIST (WHICH WILL DISPLAY IN NOTIFICATIONS IN FRONTENT)
router.get("/waitingQueue/:id", getWaitingList);

// THIS ROUTE WILL RUN WHEN WHEN USER TRY TO CHANGE SHOP SETTING
// TO CHECK IF USER IS AUTHORISED (ADMIN) OR NOT
// THIS WILL RUN AUTOMITACLY (USEEFFECT IN REACT.JS) WHEN SETTINGS PAGE WILL RENDERED
router.get("/getShopByAdmin", isLoggedIn, isShop, getShopByAdmin);
router.get("/services/:id", getServiceofShop);
export default router;
