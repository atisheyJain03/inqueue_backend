import Shop from "../models/shopModel.js";
import catchAsync from "../utils/catchAsync.js";
import faker from "faker";
import AppError from "../utils/appError.js";
// import sharp from "sharp";
import APIFeatures from "../utils/apiFeatures.js";

// RESIZE COVER PHOTO
// export const resizeCoverPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `cover-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//     .resize(820, 312, {
//       fit: "fill",
//     })
//     .toFormat("jpeg")
//     .jpeg({ quality: 100 })
//     .toFile(`public/image/shop/${req.file.filename}`);

//   next();
// });

// RESIZE CARD PHOTO
// export const resizeCardPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `card-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat("jpeg")
//     .jpeg({ quality: 100 })
//     .toFile(`public/image/shop/${req.file.filename}`);

//   next();
// });

// THIS IS FOR TEST PURPOSES ON;Y TO CREATE SHOP WITH TEST DATA
export const createShop = catchAsync(async (req, res) => {
  const obj = {
    name: faker.company.companyName(),
    ratingsAverage: (faker.random.number() % 4) + 1,
    ratingsQuantity: faker.random.number(),
    info: faker.lorem.paragraph(),
    description: faker.lorem.paragraphs(),
    coverPhoto: faker.image.imageUrl(),
    cardPhoto: faker.image.imageUrl(),
    openingHours: [
      { open: 1000, close: 1400 },
      { open: 1500, close: 1800 },
    ],
    Location: {
      coordinates: [
        faker.address.latitude() * 1,
        faker.address.longitude() * 1,
      ],
    },
    address: faker.address.streetAddress(),
    shopType: faker.name.jobType(),
    phoneNumber: 9876545678,
    website: faker.internet.url(),
  };

  const shop = await Shop.create(obj);

  res.status(201).json({
    message: "this is dummy route used to create test data",
    status: "success",
    data: { shop },
  });
});

// GET ALL SHOPS
export const getAllShops = catchAsync(async (req, res) => {
  // const shops = await Shop.find();
  let filter = {};
  const features = new APIFeatures(Shop.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const shops = await features.query;

  res.status(200).json({
    status: "success",
    data: { shops },
  });
});

// GET ONE SHOP
export const getShop = catchAsync(async (req, res, next) => {
  let id = "";
  if (req.params.id) id = req.params.id;
  else id = res.locals.shop;
  const shop = await Shop.findById(id).populate("serviceBy");
  if (!shop) throw next(new AppError("Not Record found with this id", 404));
  res.status(200).json({
    status: "success",
    data: { shop },
  });
});

// SEND SHOP RECORD WHEN ASKED BY ADMIN
export const getShopByAdmin = catchAsync(async (req, res, next) => {
  let id = res.locals.shop;
  const shop = await Shop.findById(id).populate({
    path: "serviceBy",
    select: "name isAvailable",
  });
  if (!shop) throw next(new AppError("Not Record found with this id", 404));
  res.status(200).json({
    status: "success",
    data: { shop },
  });
});

// UPDATE COVER PHOTO
export const updateCoverPhoto = catchAsync(async (req, res, next) => {
  const filteredBody = {};
  if (req.file)
    filteredBody.coverPhoto = `http://localhost:8000/public/image/shop/${req.file.filename}`;

  // 3) Update user document
  const updatedShop = await Shop.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      shop: updatedShop,
    },
  });
});

// UPDATE CARD PHOTO
export const updateCardPhoto = catchAsync(async (req, res, next) => {
  const filteredBody = {};
  if (req.file)
    filteredBody.cardPhoto = `http://localhost:8000/public/image/shop/${req.file.filename}`;

  // 3) Update user document
  const updatedShop = await Shop.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      shop: updatedShop,
    },
  });
});

// CHECK IF USER IS ADMIN USER AND HAS SHOP LINKED WITH IT
export const isShop = catchAsync(async (req, res, next) => {
  const user = res.locals.user;
  console.log("🚀 ~ file: shopController.js ~ line 171 ~ isShop ~ user", user);
  if (!user) {
    return next(
      next(new AppError("User is not logged in . Please log in", 401))
    );
  }

  if (user.role !== "admin") {
    return next(
      new AppError(
        "Not an admin user please use /login route to login as a user",
        401
      )
    );
  }
  if (!user.shop) {
    return next(new AppError("No shop is Linked with this Account", 401));
  }

  const shop = await Shop.findById(user.shop);
  if (!shop) {
    return new AppError("No shop or service is linked to this account", 401);
  }

  res.locals.shop = user.shop;

  next();
});

// UPDATE SHOP
export const updateShop = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const shopInfo = {};
  if (req.body.name) shopInfo.name = req.body.name;
  if (req.body.address) shopInfo.address = req.body.address;
  if (req.body.info) shopInfo.info = req.body.info;
  if (req.body.description) shopInfo.description = req.body.description;
  if (req.body.phoneNumber) shopInfo.phoneNumber = req.body.phoneNumber * 1;
  if (req.body.shopType) shopInfo.shopType = req.body.shopType;
  if (req.body.website) shopInfo.website = req.body.website;
  if (req.body.openingHours) {
    req.body.openingHours.forEach((value) => {
      value.open = value.open * 1;
      value.close = value.close * 1;
      let x = value.open;
      if (value.open > value.close) {
        value.open = value.close;
        value.close = x;
      }
      if (
        value.open < 0 ||
        value.close > 2400 ||
        value.close % 100 >= 60 ||
        value.open % 100 >= 60
      ) {
        return next(new AppError("Incorrect time", 400));
      }
    });
    shopInfo.openingHours = req.body.openingHours;
  }
  // console.log(res.locals.shop);
  const shop = await Shop.findByIdAndUpdate(id, shopInfo, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      shop,
    },
  });
});

// GETTING WAITING LIST FROM SHOP
export const getWaitingList = catchAsync(async (req, res, next) => {
  const limit = req.query.limit * 1 || 10;
  const skip = (req.query.page * 1 - 1) * limit;
  const queue = await Shop.findById(req.params.id)
    .populate({
      path: "waitingQueue",
      select: "user service updatedAt",
      populate: [
        { path: "user", select: "name" },
        { path: "service", select: "name" },
      ],
      options: { sort: { updatedAt: -1 }, limit: limit, skip: skip },
    })
    .select("waitingQueue");
  res.status(200).json({
    status: "success",
    data: {
      queue,
    },
  });
});

export const getServiceofShop = catchAsync(async (req, res, next) => {
  let id = "";
  if (req.params.id) id = req.params.id;
  const shop = await Shop.findById(id)
    .populate({
      path: "serviceBy",
      select: "name id",
    })
    .select("serviceBy");
  if (!shop) throw next(new AppError("Not Record found with this id", 404));
  res.status(200).json({
    status: "success",
    data: { services: shop },
  });
});
