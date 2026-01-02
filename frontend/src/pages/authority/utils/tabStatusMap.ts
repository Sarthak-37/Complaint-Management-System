import type { ComplaintStatus } from "../../../types/complaint";

export const TAB_STATUS_MAP: Readonly<
  Record<string, readonly ComplaintStatus[]>
> = {
  ALL: [
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
  ],

  ASSIGNED: ["ASSIGNED"],
  IN_PROGRESS: ["IN_PROGRESS"],

  ARCHIVE: ["RESOLVED", "CLOSED", "REJECTED"],
};

export type TabKey = "ALL" | "ASSIGNED" | "IN_PROGRESS" | "ARCHIVE";
