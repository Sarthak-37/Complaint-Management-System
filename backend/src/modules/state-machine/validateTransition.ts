// validateTransition.ts
import { ComplaintStatus } from "./complaintStatus.enum.js";
import { ALLOWED_TRANSITIONS } from "./complaintStateMap.js";

export function validateStateTransition(
  currentStatus: ComplaintStatus,
  nextStatus: ComplaintStatus
): boolean {
  const allowedNextStates = ALLOWED_TRANSITIONS[currentStatus];
  return allowedNextStates.includes(nextStatus);
}
