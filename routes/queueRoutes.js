import express from 'express';
import { isLoggedIn } from '../controllers/authController.js';
import { createQueue } from '../controllers/queueController.js';

const router = express.Router();

router.use((req, res, next) =>  {
    req.body = req.body.data;
    console.log(req.body)
    next();
} )

router.post('/createQueue' ,isLoggedIn, createQueue)

export default router