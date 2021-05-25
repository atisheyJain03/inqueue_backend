import Shop from "../models/shopModel.js";
import catchAsync from "../utils/catchAsync.js";
import faker from "faker";
import AppError from "../utils/appError.js";
import Service from "../models/serviceModel.js";

export const createService = catchAsync(async (req, res) => {
  const body = { ...req.body };
  const obj = {
    name: body.name,
    shop: res.locals.shop,
    price: body.price * 1,
  };
  // console.log(obj);
  const service = await Service.create(obj);

  res.status(201).json({
    status: "success",
    data: { service },
  });
});

export const getFullQueue = catchAsync(async (req, res) => {
  const limit = req.query.limit * 1 || 10;
  const skip = (req.query.page * 1 - 1) * limit;

  const queue = await Service.findById(req.params.id).populate({
    path: "queue",

    options: { sort: { updatedAt: -1 }, limit: limit, skip: skip },

    populate: { path: "user", select: "name email phoneNumber" },
  });
  //   console.log(queue);
  res.status(200).json({
    status: "success",
    data: { queue },
  });
});

export const updateService = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatesService = await Service.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  // console.log(updatesService);
  res.status(202).json({
    status: "success",
    data: { service: updatesService },
  });
});

export const deleteService = catchAsync(async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const deleteService = await Service.findByIdAndDelete(id);
  // console.log(deleteService);
  res.status(204).json({
    status: "success",
    data: { service: deleteService },
  });
});

export const changeCurrentNumber = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const number = req.body.number * 1 || 0;
  let service = await Service.findById(id);
  if (!service) return new new AppError("No service found", 404)();
  if (service.currentNumber >= service.totalNumber) {
    return next(
      new AppError("Current Number cannot be greater than totalNumber", 401)
    );
  } else {
    service = await Service.findByIdAndUpdate(
      id,
      {
        $inc: { currentNumber: number },
      },
      {
        new: true,
      }
    ).select("currentNumber");
  }
  console.log(service);
  res.status(200).json({
    status: "success",
    data: { service },
  });
});
