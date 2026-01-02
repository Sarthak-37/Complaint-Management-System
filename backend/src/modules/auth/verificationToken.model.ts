import mongoose, { Schema, Document } from "mongoose";

export interface IVerificationToken extends Document {
  id: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    tokenHash: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

// Automatically remove expired tokens
VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationToken =
  mongoose.model<IVerificationToken>(
    "VerificationToken",
    VerificationTokenSchema
  );
