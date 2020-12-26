import Mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
import app from "./app.js";

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASS
);
Mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 8000;
const server = http.createServer(app);
export const io = new Server(server, {
  // wsEngine: "eiows",
  cors: {
    origin: "*",
  },
});

// export var io_socket = null;
// io.on("connection", (socket) => {
//   console.log("socked connected successfully");
// });

server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
