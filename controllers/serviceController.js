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
  const queue = await Service.findById(req.params.id).populate("queue");
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
