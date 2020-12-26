import express from "express";
import {
  getMe,
  getUserQueue,
  resizeUserPhoto,
  updateMe,
  uploadUserPhoto,
} from "../controllers/userController.js";
import multer from "multer";
import {
  signup,
  login,
  logout,
  isLoggedIn,
  loginShop,
  signupShop,
} from "./../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", isLoggedIn, logout);
router.get("/getQueue", isLoggedIn, getUserQueue);
router.get("/me", isLoggedIn, getMe);
router.get("/logout", isLoggedIn, logout);
router.patch(
  "/updateMe",
  isLoggedIn,
  uploadUserPhoto,
  resizeUserPhoto,
  updateMe
);
router.post("/loginShop", loginShop);
router.post("/signUpShop", signupShop);

// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);

// // Protect all routes after this middleware
// router.use(authController.protect);

// router.patch('/updateMyPassword', authController.updatePassword);
// router.get('/me', userController.getMe, userController.getUser);
// router.patch(
//   '/updateMe',
//   userController.uploadUserPhoto,
//   userController.resizeUserPhoto,
//   userController.updateMe
// );
// router.delete('/deleteMe', userController.deleteMe);

// router.use(authController.restrictTo('admin'));

// router
//   .route('/')
//   .get(userController.getAllUsers)
//   .post(userController.createUser);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

export default router;
