import mongoose, { Schema } from "mongoose";
import { ComplaintStatus } from "../state-machine/complaintStatus.enum.js";
import { ComplaintCategory } from "./complaintCategory.enum.js";
import { ComplaintPriority } from "./complaintPriority.enum.js";

const MessageSchema = new Schema(
  {
    senderRole: {
      type: String,
      enum: ["USER", "AUTHORITY"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);



const ComplaintSchema = new Schema(
  {
    complaintCode: {
      type: String,
      unique: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },

    category: {
      type: String,
      enum: Object.values(ComplaintCategory),
      required: true,
    },

    priority: {
      type: String,
      enum: Object.values(ComplaintPriority),
      default: ComplaintPriority.MEDIUM,
    },

    status: {
      type: String,
      enum: Object.values(ComplaintStatus),
      default: ComplaintStatus.SUBMITTED,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    messages: {
      type: Array,
      default: [],
    },

    statusHistory: [
      {
        from: String,
        to: String,
        changedBy: {
          type: String,
          ref: "User",
        },
        changedAt: { type: Date, default: Date.now },
        readBy: {
          type: [Schema.Types.ObjectId],
          ref: "User",
          default: [],
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", ComplaintSchema);
export { MessageSchema };
