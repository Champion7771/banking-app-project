import http from "http";
import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";
import { initSocket } from "./sockets/socket";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB Connected");

    initSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
