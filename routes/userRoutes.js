import express from "express";
import {
  getMe,
  getNotifications,
  getUserQueue,
  // resizeUserPhoto,
  updateMe,
  uploadUserPhoto,
} from "../controllers/userController.js";
import {
  signup,
  login,
  logout,
  isLoggedIn,
  loginShop,
  signupShop,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup); // @ROUTE SIGNUP USER
router.post("/login", login); // @ROUTE LOGIN USER
router.get("/logout", isLoggedIn, logout); // @ROUTE LOGOUT USER/ADMIN
// @  ROUTE FOR QUEUE STATES FOR USER  LIKE ALL TICKETS GENERATE BY HIM
router.get("/getQueue", isLoggedIn, getUserQueue);
router.get("/me/:token", isLoggedIn, getMe); // @ROUTE ABOUT ME

// @ROUTE TO UPDATE USER INFO LIKE PHOTO , NAME, ETC
router.patch(
  "/updateMe",
  isLoggedIn, // CHECK  IF LOGGED IN OR NOT BY COOKIE
  uploadUserPhoto,
  // resizeUserPhoto,
  updateMe
);
router.post("/loginShop", loginShop); // @ROUTE FOR LOGIN AS ADMIN WITH SHOP REGISTER
router.post("/signUpShop", signupShop); // @ROUTE CREATE ACCOUNT AS ADMIN WITH EMPTY SHOP WITH IT
router.get("/notifications/:id", getNotifications);
export default router;
