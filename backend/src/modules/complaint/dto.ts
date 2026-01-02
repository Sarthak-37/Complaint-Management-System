import { ComplaintStatus } from "../state-machine/complaintStatus.enum.js";
import type { UserRole } from "../types.js";
import { ComplaintCategory } from "./complaintCategory.enum.js";
import { ComplaintPriority } from "./complaintPriority.enum.js";
/**
 * Payload for creating a complaint
 * Used by: POST /api/complaints
 */
export interface CreateComplaintPayload {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority?: ComplaintPriority;
}

/**
 * Payload for transitioning complaint status
 * Used by: PATCH /api/complaints/:id/status
 */
export interface TransitionComplaintPayload {
  nextStatus: ComplaintStatus;
  role: UserRole;
}

export interface UpdateComplaintPriorityPayload {
  priority: ComplaintPriority;
}