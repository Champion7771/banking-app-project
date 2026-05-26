import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  amount: number;
  status: "success" | "failed";
  ipAddress?: string;
  device?: string;
  userAgent?: string;
  suspiciousReason?: string;
  isSuspicious: boolean;
  failureReason?: string;
}

const transactionSchema = new Schema<ITransaction>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },

    ipAddress: {
      type: String,
    },

    device: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    isSuspicious: {
      type: Boolean,
      default: false,
    },

    suspiciousReason: {
      type: String,
    },

    failureReason: String,
  },
  {
    timestamps: true,
  },
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema,
);

export default Transaction;
