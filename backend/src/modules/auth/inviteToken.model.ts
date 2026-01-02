import mongoose, { Schema, Types } from "mongoose";
import { ComplaintCategory } from "../../modules/complaint/complaintCategory.enum.js";
export interface IInviteToken {
  email: string;
  role: "AUTHORITY";
  categories: ComplaintCategory[];
  token: string;
  expiresAt: Date;
  used: boolean;
}


const inviteTokenSchema = new Schema<IInviteToken>({
  email: { type: String, required: true },
  role: { type: String, required: true },
  categories: [{ type: String, enum: Object.values(ComplaintCategory) }],
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
});


export const InviteToken = mongoose.model<IInviteToken>(
  "InviteToken",
  inviteTokenSchema
);
