import mongoose from "mongoose";
import User from "../models/user.model";
import Transaction from "../models/transaction.model";
import AppError from "../utils/AppError";
import { getIO, onlineUsers } from "../sockets/socket";
import Notification from "../models/notification.model";

interface TransferInput {
  senderId: string;
  receiverEmail: string;
  amount: number;
  ipAddress?: string;
  userAgent?: string;
  device?: string;
  isSuspicious?: boolean;
  suspiciousReason?: string;
}

export const transferMoneyService = async (data: TransferInput) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const sender = await User.findById(data.senderId).session(session);

    if (!sender) {
      throw new AppError("Sender not found", 404);
    }

    const receiver = await User.findOne({ email: data.receiverEmail }).session(
      session,
    );

    if (!receiver) {
      throw new AppError("Receiver not found", 404);
    }

    if (sender.email === receiver.email) {
      throw new AppError("Cannot transfer to yourself", 400);
    }

    if (sender.balance < data.amount) {
      throw new AppError("Insufficient balance", 400);
    }
    // MAX TRANSFER LIMIT
    if (data.amount > 10000) {
      throw new AppError("Maximum transfer limit is ₹10,000", 400);
    }

    sender.balance -= data.amount;

    receiver.balance += data.amount;

    await sender.save({ session });

    await receiver.save({ session });

    // FRAUD DETECTION
    let isSuspicious = false;

    let suspiciousReason = "";

    // LARGE AMOUNT
    if (data.amount >= 1000) {
      isSuspicious = true;

      suspiciousReason = "Large transaction amount";
    }

    // FROZEN USER TRYING TO SEND
    if (sender.isFrozen) {
      isSuspicious = true;

      suspiciousReason = "Frozen user attempted transaction";
    }

    // LARGE AMOUNT RULE
    if (data.amount >= 100000) {
      isSuspicious = true;

      suspiciousReason = "Large transaction amount";
    }

    // FROZEN USER RULE
    if (sender.isFrozen) {
      isSuspicious = true;
      suspiciousReason = "Frozen user attempted transaction";
    }

    const transaction = await Transaction.create(
      [
        {
          sender: sender._id,
          receiver: receiver._id,
          amount: data.amount,
          status: isSuspicious ? "failed" : "success",
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          device: data.device,
          isSuspicious,
          suspiciousReason,
        },
      ],
      { session },
    );

    await Notification.create(
      [
        {
          user: receiver._id,
          message: `You received ₹${data.amount} from ${sender.name}`,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    const io = getIO();
    const receiverSocketId = onlineUsers.get(data.receiverEmail);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("moneyReceived", {
        message: `You received ₹${data.amount}`,
      });
    }

    session.endSession();
    return transaction[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getTransactionHistoryService = async (userId: string) => {
  const transactions = await Transaction.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender", "name email")
    .populate("receiver", "name email")
    .sort({ createdAt: -1 });

  return transactions;
};
