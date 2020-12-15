import express from 'express';
import { createShop , getAllShops, getShop } from  '../controllers/shopController.js' ;
// import userController from './../controllers/userController');
// import authController from './../controllers/authController.js';

const router = express.Router();

// router.use((req, res, next) =>  {
//     req.body = req.body.data;
//     console.log(req.body)
//     next();
// } )

router.post('/createShop', createShop)
router.get('/getShops', getAllShops)
router.get('/getShop/:id', getShop)

export default router;