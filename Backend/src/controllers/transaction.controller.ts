import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { transferSchema } from "../utils/validators/transaction.validator";
import { transferMoneyService } from "../services/transaction.service";
import { getTransactionHistoryService } from "../services/transaction.service";

export const transferMoney = catchAsync(async (req: any, res: Response) => {
  const validatedData = transferSchema.parse(req.body);

  const result = await transferMoneyService({
    senderId: req.user.userId, // SENDER ID FROM AUTH MIDDLEWARE
    receiverEmail: validatedData.receiverEmail, // RECEIVER IDENTIFIED BY EMAIL
    amount: validatedData.amount, // AMOUNT TO TRANSFER
    ipAddress: req.ip, // IP ADDRESS FROM REQUEST
    userAgent: req.headers["user-agent"] || "Unknown", // USER AGENT FROM HEADERS
    device: req.headers["sec-ch-ua-platform"] || "Unknown", // DEVICE INFO FROM CHROME HEADERS
    
  });

  res.status(200).json({
    success: true,
    message: "Transfer successful",
    data: result,
  });
});

export const getTransactionHistory = catchAsync(
  async (req: any, res: Response) => {
    const transactions = await getTransactionHistoryService(req.user.userId);

    res.status(200).json({
      success: true,
      data: transactions,
    });
  },
);
