// canTransition.ts
import { ComplaintStatus } from "./complaintStatus.enum.js";
import { validateStateTransition } from "./validateTransition.js";
import { ROLE_ALLOWED_TRANSITIONS } from "./roleTransitionRules.js";

export function canTransition(
  role: "USER" | "AUTHORITY" | "ADMIN",
  currentStatus: ComplaintStatus,
  nextStatus: ComplaintStatus
): boolean {

  // 1. Check lifecycle validity
  if (!validateStateTransition(currentStatus, nextStatus)) {
    return false;
  }

  // 2. Check role permission
  const allowedForRole = ROLE_ALLOWED_TRANSITIONS[role] || [];

  return allowedForRole.some(
    ([from, to]) => from === currentStatus && to === nextStatus
  );
}
