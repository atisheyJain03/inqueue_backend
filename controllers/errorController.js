import AppError from "./../utils/appError.js";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // console.log({ err });
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `${value} is already in use. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) RENDERED WEBSITE
  console.error("ERROR 💥", err);
  console.log(
    "🚀 ~ file: errorController.js ~ line 48 ~ sendErrorDev ~ err",
    err
  );
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    // console.error("ERROR 💥", err);
    // 2) Send generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR 💥", err);
  // 2) Send generic message
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

export default (err, req, res, next) => {
  console.log(err.name, err.code);
  // console.log(process.env.NODE_ENV);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  sendErrorDev(err, req, res);
  // }

  // if (process.env.NODE_ENV === "development") {
  //   sendErrorDev(err, req, res);
  // }
  // else if (process.env.NODE_ENV === "production") {
  //   let error = { ...err };
  //   if (err.name === "CastError") error = handleCastErrorDB(err);
  //   else if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  //   else if (err.name === "ValidationError")
  //     // console.log("err");
  //     error = handleValidationErrorDB(err);
  //   else if (err.name === "JsonWebTokenError") error = handleJWTError();
  //   else if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  //   sendErrorProd(error, req, res);
  // }
};
