import multer from "multer";
import sharp from "sharp";
import User from "./../models/userModel.js";
import catchAsync from "./../utils/catchAsync.js";
import AppError from "./../utils/appError.js";
import Queue from "../models/queueModel.js";
// import factory  from'./handlerFactory.js';

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/image/user");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `user-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

// const upload = multer({ dest: "public/image/user" });

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload a valid image.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`public/image/user/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// export const getMe = (req, res, next) => {
//   req.params.id = req.user.id;
//   next();
// };

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data

  console.log(req.file);
  console.log(req.body);
  console.log(req.userId);

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = {};
  if (req.body.name) filteredBody.name = req.body.name;
  if (req.file)
    filteredBody.photo = `http://localhost:8000/public/image/user/${req.file.filename}`;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.userId, filteredBody, {
    new: true,
    runValidators: true,
  });

  //const image = `http://localhost:8000/public/image/user/${req.file.filename}`;

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
      // image: "hello",
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

export const getUserQueue = catchAsync(async (req, res) => {
  // console.log(req.params);
  // const queue = await User.findById(req.userId)
  // .populate('queueList').select('queueList')
  const queue = await Queue.find({ user: req.userId })
    .populate({
      path: "service",
      select: "name currentNumber shop",
    })
    .populate({ path: "shop", select: "name" })
    .sort({ updatedAt: -1 });
  // console.log(queue);
  res.status(200).json({
    status: "success",
    data: { queue },
  });
});

export const getMe = (req, res) => {
  // console.log(res.locals.user);
  res.status(200).json({
    status: "success",
    data: {
      user: res.locals.user,
    },
  });
};

// export const getUser = factory.getOne(User);
// export const getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
// export const updateUser = factory.updateOne(User);
// export const deleteUser = factory.deleteOne(User);
