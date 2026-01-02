export const ComplaintCategory = {
  POLICY_PAYMENTS: "POLICY_PAYMENTS",
  CLAIMS: "CLAIMS",
  SUPPORT_APP: "SUPPORT_APP",
  OTHER: "OTHER",
} as const;

export const ComplaintStatus = {
  SUBMITTED: "SUBMITTED",
  UNDER_REVIEW: "UNDER_REVIEW",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  ESCALATED: "ESCALATED",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
  REJECTED: "REJECTED",
  REOPENED: "REOPENED"
} as const;

export type ComplaintStatus = typeof ComplaintStatus[keyof typeof ComplaintStatus];
// This creates a type based on the object's values
export type ComplaintCategory = typeof ComplaintCategory[keyof typeof ComplaintCategory];

export interface IComplaint {
  _id: string;                // MongoDB ID (for API calls)
  complaintCode: string;      // Business ID (for UI)
  title: string;
  description?: string;

  category: ComplaintCategory;
  status: ComplaintStatus;
  priority?: string;

  createdAt: string;
  updatedAt?: string;

  statusHistory?: any[];      // Status change history

  createdBy?: {
    _id: string;
    email: string;
    username: string;
  };

  assignedTo?: {
    _id: string;
    email: string;
    username: string;
  } | null;
}

export const ComplaintPriority = {
  LOW : "LOW",
  MEDIUM : "MEDIUM",
  HIGH : "HIGH",
  CRITICAL : "CRITICAL"
} as const;

export type ComplaintPriority = typeof ComplaintPriority[keyof typeof ComplaintPriority];