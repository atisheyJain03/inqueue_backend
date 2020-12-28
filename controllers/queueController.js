import catchAsync from "../utils/catchAsync.js";
import faker from "faker";
import AppError from "../utils/appError.js";
import Queue from "../models/queueModel.js";
import Shop from "../models/shopModel.js";
import Service from "../models/serviceModel.js";
import { io } from "../server.js";
// import { io, io_socket } from "../server.js";

export const createQueue = catchAsync(async (req, res, next) => {
  if (!req.userId) {
    return next(new AppError("User is not logged in . Please login"));
  }
  if (!req.body.serviceId) {
    return next(new AppError("Please select a Service"));
  }

  const service = await Service.exists({ _id: req.body.serviceId });
  // io.on("connection", (socket) => {
  //   console.log("socket");
  //   // socket.emit(req.body.serviceId, "hello");
  //   socket.emit(shop.id, "hello");
  // });
  // console.log(service, req.body.serviceId, req.body.shopId);
  if (!service) {
    return next(new AppError("Please select a valid service"));
  }

  const queue = await Queue.create({
    shop: req.body.shopId,
    user: req.userId,
    // number: service.totalNumber,
    service: req.body.serviceId,
    description: req.body.description,
  });

  const shop = await Shop.findByIdAndUpdate(req.body.shopId, {
    $push: { waitingQueue: queue },
  });
  // console.log(shop);
  if (!shop) {
    return next(new AppError("No Shop Exist"));
  }

  console.log(shop.id);

  io.to(shop.id).emit("notification", "hello");

  // const shopio =io.sockets.emit(req.body.serviceId, queue.number);
  res.status(201).json({
    status: "success",
    data: {
      queue,
    },
  });
});

export const changeQueueStatus = catchAsync(async (req, res, next) => {
  // console.log("//////////////////");
  // console.log({ ...req.body });
  let queue = "";

  if (req.body.type === "accepted") {
    const service = await Service.findByIdAndUpdate(
      req.body.serviceId,
      {
        $inc: { totalNumber: 1 },
      },
      {
        new: true,
      }
    ).select("totalNumber");

    queue = await Queue.findByIdAndUpdate(req.body.queueId, {
      status: "accepted",
      number: service.totalNumber,
    });
  } else if (req.body.type === "rejected") {
    queue = await Queue.findByIdAndUpdate(req.body.queueId, {
      status: "rejected",
    });
  }

  await Shop.findByIdAndUpdate(req.body.shopId, {
    $pull: { waitingQueue: req.body.queueId },
  });

  res.status(200).json({
    status: "success",
    data: {
      queue,
    },
  });
});
