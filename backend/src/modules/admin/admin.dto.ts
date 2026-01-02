import { ComplaintCategory } from "../complaint/complaintCategory.enum.js";

export interface InviteAuthorityDto {
  email: string;
  categories: ComplaintCategory[];
}

export interface AssignComplaintDto {
  complaintId: string;
  authorityId: string;
}

export type UserStatusAction = "ACTIVATE" | "SUSPEND";
