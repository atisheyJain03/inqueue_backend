import express from 'express';
// import userController import './../controllers/userController');
import {signup,login,logout, isLoggedIn} from './../controllers/authController.js';

const router = express.Router();

// router.use((req, res, next) =>  {
//     req.body = req.body.data;
//     console.log(req.body)
//     next();
// } )

router.post('/signup',signup);
router.post('/login', login);
router.get('/logout',isLoggedIn, logout);

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
