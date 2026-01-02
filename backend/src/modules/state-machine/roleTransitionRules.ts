// roleTransitionRules.ts
import { ComplaintStatus } from "./complaintStatus.enum.js";

export const ROLE_ALLOWED_TRANSITIONS = {
  USER: [
    [ComplaintStatus.RESOLVED, ComplaintStatus.REOPENED],
    [ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED]
  ],

  AUTHORITY: [
    [ComplaintStatus.ASSIGNED, ComplaintStatus.IN_PROGRESS],
    [ComplaintStatus.IN_PROGRESS, ComplaintStatus.RESOLVED],
    [ComplaintStatus.IN_PROGRESS, ComplaintStatus.ESCALATED],
    [ComplaintStatus.ASSIGNED, ComplaintStatus.REJECTED]
  ],

  ADMIN: [
    [ComplaintStatus.SUBMITTED, ComplaintStatus.UNDER_REVIEW],
    [ComplaintStatus.UNDER_REVIEW, ComplaintStatus.ASSIGNED],
    [ComplaintStatus.UNDER_REVIEW, ComplaintStatus.REJECTED],
    [ComplaintStatus.ESCALATED, ComplaintStatus.REJECTED],
    [ComplaintStatus.ESCALATED, ComplaintStatus.RESOLVED]
  ]
};
