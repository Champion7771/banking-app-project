import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import User from "../models/user.model";
import Transaction from "../models/transaction.model";

// GET ALL USERS
export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    data: users,
  });
});

// GET ALL TRANSACTIONS
export const getAllTransactions = catchAsync(
  async (req: Request, res: Response) => {
    const transactions = await Transaction.find()
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: transactions,
    });
  },
);

// ADMIN ANALYTICS
export const getAdminAnalytics = catchAsync(
  async (req: Request, res: Response) => {
    // TOTAL USERS
    const totalUsers = await User.countDocuments();

    // TOTAL TRANSACTIONS
    const totalTransactions = await Transaction.countDocuments();

    // TOTAL MONEY MOVED
    const revenueData = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalAmount || 0;

    // ACTIVE USERS
    const activeUsers = await User.countDocuments({
      isBlocked: false,
    });

    res.status(200).json({
      success: true,

      data: {
        totalUsers,
        totalTransactions,
        totalRevenue,
        activeUsers,
      },
    });
  },
);

// BLOCK USER
export const blockUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isBlocked: true,
    },
    {
      new: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "User blocked",
    data: user,
  });
});

// UNBLOCK USER
export const unblockUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isBlocked: false,
    },
    {
      new: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "User unblocked",
    data: user,
  });
});

// FREEZE USER
export const freezeUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isFrozen: true,
    },
    {
      new: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "User frozen",
    data: user,
  });
});

// UNFREEZE USER
export const unfreezeUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      isFrozen: false,
    },
    {
      new: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "User unfrozen",
    data: user,
  });
});

// DELETE USER
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User deleted",
  });
});
