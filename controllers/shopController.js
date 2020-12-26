import Shop from "../models/shopModel.js";
import catchAsync from "../utils/catchAsync.js";
import faker from "faker";
import AppError from "../utils/appError.js";
import sharp from "sharp";
import User from "../models/userModel.js";

export const resizeCoverPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `cover-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(820, 312, {
      fit: "fill",
    })
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`public/image/shop/${req.file.filename}`);

  next();
});

export const resizeCardPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `card-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`public/image/shop/${req.file.filename}`);

  next();
});

export const createShop = catchAsync(async (req, res) => {
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
    ratingsAverage: (faker.random.number() % 4) + 1,
    ratingsQuantity: faker.random.number(),
    info: faker.lorem.paragraph(),
    description: faker.lorem.paragraphs(),
    coverPhoto: faker.image.imageUrl(),
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
  // console.log(obj)
  const shop = await Shop.create(obj);

  res.status(201).json({
    status: "success",
    data: { shop },
  });
});

export const getAllShops = catchAsync(async (req, res) => {
  const shops = await Shop.find();
  res.status(200).json({
    status: "success",
    data: { shops },
  });
});

export const getShop = catchAsync(async (req, res, next) => {
  // console.log(req.params);
  let id = "";
  if (req.params.id) id = req.params.id;
  else id = res.locals.shop;
  const shop = await Shop.findById(id).populate("serviceBy");
  if (!shop) throw next(new AppError("Not Record found with this id", 404));
  console.log(shop);
  res.status(200).json({
    status: "success",
    data: { shop },
  });
});

export const getShopByAdmin = catchAsync(async (req, res, next) => {
  // console.log(req.params);
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

  //const image = `http://localhost:8000/public/image/user/${req.file.filename}`;

  res.status(200).json({
    status: "success",
    data: {
      shop: updatedShop,
      // image: "hello",
    },
  });
});

export const updateCardPhoto = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
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

  //const image = `http://localhost:8000/public/image/user/${req.file.filename}`;

  res.status(200).json({
    status: "success",
    data: {
      shop: updatedShop,
      // image: "hello",
    },
  });
});

export const isShop = catchAsync(async (req, res, next) => {
  const user = res.locals.user;
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
  console.log("/////////////////////////////////////////");
  console.log(shop);
  res.locals.shop = user.shop;
  console.log({ ...res.locals });
  next();
});

export const updateShop = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  const shopInfo = {};
  if (req.body.name) shopInfo.name = req.body.name;
  if (req.body.address) shopInfo.address = req.body.address;
  if (req.body.info) shopInfo.info = req.body.info;
  if (req.body.description) shopInfo.description = req.body.description;
  if (req.body.phoneNumber) shopInfo.phoneNumber = req.body.phoneNumber * 1;
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
  console.log(res.locals.shop);
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

// export const getAllShops = catchAsync(async (req, res) => {
//   const shops = await Shop.find();
//   res.status(200).json({
//     status: "success",
//     data: { shops },
//   });
// });

// export const getShop = catchAsync(async (req, res, next) => {
//   // console.log(req.params);
//   const shop = await Shop.findById(req.params.id);
//   if (!shop) throw next(new AppError("Not Record found with this id", 404));
//   res.status(200).json({
//     status: "success",
//     data: { shop },
//   });
// });
