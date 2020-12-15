import Shop from '../models/shopModel.js';
import catchAsync from '../utils/catchAsync.js';
import faker from 'faker'
import AppError from '../utils/appError.js';
import Service from '../models/serviceModel.js';


export const createService = catchAsync(async(req, res) => {
    console.log(req.body);
    const body = {...req.body};
    
    const obj = {
        name : body.name,
        shop : body.shop,
        price : body.price,
    }
    
    console.log(obj)
    const service = await  Service.create(obj);
    
    res.status(201).json({
        status: "success", 
        data: {service}
    })
    
    
})

export const getFullQueue = catchAsync(async(req, res)=> {
    const queue =await Service.findById(req.params.id).populate('queue');
    console.log(queue);
    res.status(200).json({
        status: "success",
        data:{queue}
    })
})

export const getAllShops = catchAsync(async(req,res) => {
    const shops= await Shop.find();
    res.status(200).json({
        status: "success",
        data: {shops}
    })
})

export const getShop = catchAsync(async(req, res,next) => {
    // console.log(req.params);
    const shop = await Shop.findById(req.params.id);
    if(!shop) throw next(new AppError("Not Record found with this id" , 404));
    res.status(200).json({
        status: "success",
        data: {shop}
    })
})