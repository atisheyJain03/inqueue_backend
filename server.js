import Mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  // process.exit(1);
});

dotenv.config({ path: "./config.env" });
import app from "./app.js";

// CONNECT DB
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

// PORT
let port = process.env.PORT || 8000;
// CREATE SERVER
const server = http.createServer(app);
// SOCKET IO (SERVER SIDE ) CONNECT TO SERVER
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
  upgrade: false,
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  // THIS WILL JOIN THE CONNECTION FOR ROOMS
  // THIS IS FOR REALTIME NOTIFICATIOINS FOR USER AND OWNER FOR TICKET REQUEST
  socket.on("join", function (data) {
    console.log(data.idShop, data.idUser);
    if (data.idShop) socket.join(data.idShop);
    if (data.idUser) socket.join(data.idUser);
  });
  console.log("socked connected successfully");
});

// LISTENING ON PORT AFTER SETTING IO
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// FOR ANY UNHANDLED ERROR THIS WILL CLOSE THE SERVER
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// SIGTERM IS SPECIFIC TO TERMINATE SERVER AND WILL CLOSE THE SERVER ON DEMAND
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
