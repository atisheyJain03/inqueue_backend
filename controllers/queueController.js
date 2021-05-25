import catchAsync from "../utils/catchAsync.js";
import faker from "faker";
import dotenv from "dotenv";
import AppError from "../utils/appError.js";
import Queue from "../models/queueModel.js";
import Shop from "../models/shopModel.js";
import Service from "../models/serviceModel.js";
import { io } from "../server.js";
import User from "../models/userModel.js";
// import sendSMS from "../../sms.js";

dotenv.config({ path: "../config.env" }); // THIS IS IMPORTANT

// import { io, io_socket } from "../server.js";

// export const sms = async (req, res) => {
//   console.log("sms");
//   sendSMS(req, res)
//     .then(function (data) {
//       res.end(JSON.stringify({ MessageID: data.MessageId }));
//     })
//     .catch(function (err) {
//       res.end(JSON.stringify({ Error: err }));
//     });
// };

export const createQueue = catchAsync(async (req, res, next) => {
  console.log(req.body);
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
  console.log(queue.user, queue.user.toString());
  io.to(shop.id).emit("shop", "hello");

  // const shopio =io.sockets.emit(req.body.serviceId, queue.number);
  res.status(201).json({
    status: "success",
    data: {
      queue,
    },
  });
});

export const changeQueueStatus = catchAsync(async (req, res, next) => {
  let queue = "";
  let service = "";
  if (req.body.type === "accepted") {
    service = await Service.findByIdAndUpdate(
      req.body.serviceId,
      {
        $inc: { totalNumber: 1 },
      },
      {
        new: true,
      }
    ).select("totalNumber name");

    queue = await Queue.findByIdAndUpdate(
      req.body.queueId,
      {
        status: "accepted",
        number: service.totalNumber,
      },
      { new: true }
    );
  } else if (req.body.type === "rejected") {
    service = await Service.findByIdAndUpdate(
      req.body.serviceId,
      {
        $inc: { totalNumber: 0 },
      },
      {
        new: true,
      }
    ).select("name");
    queue = await Queue.findByIdAndUpdate(
      req.body.queueId,
      {
        status: "rejected",
      },
      { new: true }
    );
  }

  const shop = await Shop.findByIdAndUpdate(req.body.shopId, {
    $pull: { waitingQueue: req.body.queueId },
  });

  const obj = {
    status: queue.status,
    shop: shop.name,
    service: service.name,
    number: service.totalNumber,
  };

  const user = await User.findByIdAndUpdate(queue.user, {
    $push: {
      notifications: { $each: [obj], $position: 0, $slice: 100 },
    },
  });

  io.to(queue.user.toString()).emit("notification", "hello");
  res.status(200).json({
    status: "success",
    data: {
      queue,
    },
  });
});

export const createTicketByAdmin = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { totalNumber: 1 },
    },
    {
      new: true,
    }
  );
  if (!service) {
    return next(new AppError("Please select a valid service"));
  }

  const ticket = await Queue.create({
    shop: service.shop,
    userName: req.body.name,
    phoneNumber: req.body.phoneNumber,
    number: service.totalNumber,
    service: service.id,
    description: req.body.description,
  });

  res.status(200).json({
    status: "success",
    data: { ticket },
  });
});
