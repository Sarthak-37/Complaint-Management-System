// complaintStateMap.ts
import { ComplaintStatus } from "./complaintStatus.enum.js";

export const ALLOWED_TRANSITIONS: Record<
  ComplaintStatus,
  ComplaintStatus[]
> = {
  [ComplaintStatus.SUBMITTED]: [
    ComplaintStatus.UNDER_REVIEW
  ],

  [ComplaintStatus.UNDER_REVIEW]: [
    ComplaintStatus.ASSIGNED,
    ComplaintStatus.REJECTED
  ],

  [ComplaintStatus.ASSIGNED]: [
    ComplaintStatus.IN_PROGRESS,
    ComplaintStatus.REJECTED
  ],

  [ComplaintStatus.IN_PROGRESS]: [
    ComplaintStatus.RESOLVED,
    ComplaintStatus.ESCALATED
  ],

  [ComplaintStatus.ESCALATED]: [
    ComplaintStatus.RESOLVED,
    ComplaintStatus.REJECTED
  ],

  [ComplaintStatus.RESOLVED]: [
    ComplaintStatus.CLOSED,
    ComplaintStatus.REOPENED
  ],

  [ComplaintStatus.REOPENED]: [
    ComplaintStatus.UNDER_REVIEW
  ],

  [ComplaintStatus.CLOSED]: [],     // FINAL
  [ComplaintStatus.REJECTED]: []    // FINAL
};
