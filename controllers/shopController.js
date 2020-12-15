import Shop from '../models/shopModel.js';
import catchAsync from '../utils/catchAsync.js';
import faker from 'faker'
import AppError from '../utils/appError.js';


export const createShop = catchAsync(async(req, res) => {
    // console.log(req.body);
    // const body = {...req.body};
    
    // const obj = {
    //     name : body.name,
    //     description : body.description,
    //     info : body.info,
    //     openingHours : body.openingHours,
    //     address : body.address,
    // }
    
    
    const obj = {
        name: faker.company.companyName(),
        ratingsAverage: faker.random.number()%4 +1,
        ratingsQuantity: faker.random.number(),
        info: faker.lorem.paragraph(),
        description: faker.lorem.paragraphs(),
        imageCover: faker.image.imageUrl(),
        openingHours : [{open: 1000 , close:1400}, { open:1500 , close:1800}],
        Location:{ coordinates: [faker.address.latitude()*1, faker.address.longitude()*1]
        },
        address: faker.address.streetAddress(),
        shopType: faker.name.jobType(),
        phoneNumber: 9876545678,
        website: faker.internet.url()
    
    }
    console.log(obj)
    const shop = await  Shop.create(obj);
    
    res.status(201).json({
        status: "success", 
        data: {shop}
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
    const shop =  await Shop.findById(req.params.id)
    .populate('serviceBy');
    if(!shop) throw next(new AppError("Not Record found with this id" , 404));
    console.log(shop)
    res.status(200).json({
        status: "success",
        data: {shop}
    })
})