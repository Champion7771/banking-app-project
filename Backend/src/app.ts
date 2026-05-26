import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import globalErrorHandler from "./middleware/error.middleware";
import transactionRoutes from "./routes/transaction.route";
import notificationRoutes from "./routes/notification.route";
import adminRoutes from "./routes/admin.route";
import { publicApiLimiter } from "./middleware/rateLimit.middleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(publicApiLimiter);

app.use(express.json());

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/transactions", transactionRoutes);
app.use(globalErrorHandler);

app.get("/", (req, res) => {
  res.send("Welcome to the Banking Application API");
});

export default app;
