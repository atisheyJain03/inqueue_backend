import express from 'express';
import { createService, getFullQueue } from '../controllers/serviceController.js';

// import userController from './../controllers/userController');
// import authController from './../controllers/authController.js';

const router = express.Router();

// router.use((req, res, next) =>  {
//     req.body = req.body.data;
//     console.log(req.body)
//     next();
// } )

router.post('/createService', createService)
router.get('/getQueue/:id',getFullQueue)

export default router;