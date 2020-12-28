import express from "express";

// FOR ENVIROMENT VARIABLES
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" }); // THIS IS IMPORTANT

// IMPORTS FROM NODE MODULES
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import expressMongoSanitize from "express-mongo-sanitize";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";

// IMPORT FROM OTHER MODULES
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import userRouter from "./routes/userRoutes.js";
import shopRouter from "./routes/shopRoutes.js";
import queueRouter from "./routes/queueRoutes.js";
import serviceRouter from "./routes/serviceRoutes.js";

const app = express();

app.enable("trust proxy");

// 1) GLOBAL MIDDLEWARES

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// Access-Control-Allow-Origin *

app.options("*", cors());
// app.options('/api/v1/tours/:id', cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
// LATER WILL CHANGE IT TO 100

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// // Stripe webhook, BEFORE body-parser, because stripe needs the body as stream
// app.post(
//   '/webhook-checkout',
//   bodyParser.raw({ type: 'application/json' }),
//   bookingController.webhookCheckout
// );

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(expressMongoSanitize());

// Data sanitization against XSS
app.use(xss());

// // Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsQuantity',
//       'ratingsAverage',
//       'maxGroupSize',
//       'difficulty',
//       'price'
//     ]
//   })
// );

// app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//  THIS IS FOR FRONTEND API
app.use((req, res, next) => {
  // CONVERT BODY
  req.body = req.body.data;
  next();
});

// this route is for images
app.use("/public", express.static("public"));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/shops", shopRouter);
app.use("/api/v1/service", serviceRouter);
app.use("/api/v1/queue", queueRouter);

// NOT FOUND
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
