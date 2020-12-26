import catchAsync from "../utils/catchAsync.js";
import faker from "faker";
import AppError from "../utils/appError.js";
import Queue from "../models/queueModel.js";
import Service from "../models/serviceModel.js";
// import { io, io_socket } from "../server.js";

export const createQueue = catchAsync(async (req, res, next) => {
  if (!req.userId) {
    return next(new AppError("User is not logged in . Please login"));
  }
  if (!req.body.serviceId) {
    return next(new AppError("Please select a Service"));
  }

  const service = await Service.findByIdAndUpdate(
    req.body.serviceId,
    { $inc: { totalNumber: 1 } },
    {
      new: true,
    }
  );
  //   io.on("connection", (socket) => {
  //     console.log("socket");
  //     socket.emit(req.body.serviceId, "hello");
  //   });

  if (!service) {
    return next(new AppError("Please select a valid service"));
  }

  const queue = await Queue.create({
    shop: service.shop,
    user: req.userId,
    number: service.totalNumber,
    service: req.body.serviceId,
    description: req.body.description,
  });

  // io.sockets.emit(req.body.serviceId, queue.number);
  res.status(201).json({
    status: "success",
    data: {
      queue,
    },
  });
});
