import Complaint from "../complaint/complaint.model.js";
import type { AuthUser } from "../types.js";
import { ComplaintStatus } from "../state-machine/complaintStatus.enum.js";
import mongoose from "mongoose";

function mapStatusToMessage(to: string) {
  switch (to) {
    case ComplaintStatus.SUBMITTED:
      return "Complaint submitted successfully";
    case ComplaintStatus.IN_PROGRESS:
      return "Your complaint is under review";
    case ComplaintStatus.RESOLVED:
      return "Your complaint has been resolved";
    default:
      return `Complaint status updated to ${to}`;
  }
}

export async function getUserNotificationsService(authUser: AuthUser) {
  const id = new mongoose.Types.ObjectId(authUser.id);
  const complaints = await Complaint.find(
    { createdBy: authUser.id },
    { statusHistory: 1, complaintCode: 1 }
  ).lean();

  return complaints
    .flatMap((c) =>
      (c.statusHistory || [])
        .filter(h => {
          // Check if current user has NOT read this status change
          const readBy = h.readBy || [];
          return !readBy.some(id => id.toString() === id.toString());
        })
        .map((h) => {
          const status = h.to || ComplaintStatus.SUBMITTED;
          return {
            complaintId: c._id,
            complaintCode: c.complaintCode,
            message: mapStatusToMessage(status),
            createdAt: h.changedAt,
            status: status,
          };
        })
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
}
