import mongoose, { Schema, Document } from "mongoose";
import { ComplaintCategory } from "../complaint/complaintCategory.enum.js";

export enum AccountStatus {
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  PENDING_INVITE = "PENDING_INVITE"
}

export interface IUser extends Document {
  username:string;
  email: string;
  passwordHash: string | null;
  role: "USER" | "AUTHORITY" | "ADMIN";
  categories: ComplaintCategory[];
  accountStatus: AccountStatus;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: false,
      default: null
    },
    role: {
      type: String,
      enum: ["USER", "AUTHORITY", "ADMIN"],
      required: true
    },
    categories: {
      type: [String],
      enum: Object.values(ComplaintCategory),
      default: []
    },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.PENDING_VERIFICATION
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
