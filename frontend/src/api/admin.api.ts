import api from "./axios";
import type { IUser } from "../types/user";
import type { ComplaintCategory, IComplaint } from "../types/complaint";
import { ComplaintStatus } from "../types/complaint";

export async function fetchUsers(role: "USER" | "AUTHORITY") {
  const res = await api.get<IUser[]>("/admin/users", {
    params: { role },
  });
  return res.data;
}

export async function inviteAuthority(payload: {
  email: string;
  categories: ComplaintCategory[];
  instructions?: string;
}) {
  return api.post("/admin/invite-authority", payload);
}

export async function updateUserStatus(
  id: string,
  action: "ACTIVATE" | "SUSPEND"
) {
  return api.patch(`/admin/users/${id}/status`, { action });
}

/**
 * Fetch complaints for Admin Dashboard
 * Uses: GET /api/complaints/admin
 */
export async function fetchAdminComplaints(params?: {
  status?: ComplaintStatus;
  category?: ComplaintCategory;
}) {
  const res = await api.get<IComplaint[]>("/complaints/admin", {
    params
  });
  return res.data;
}

//change complaintStatus
export async function transitionComplaintStatus(
  complaintId: string,
  nextStatus: ComplaintStatus
) {
  return api.patch(`/complaints/${complaintId}/status`, {
    nextStatus
  });
}

//assign complaints to authority
export async function assignComplaint(payload: {
  complaintId: string;
  authorityId: string;
}) {
  return api.post("/admin/assign-complaint", payload);
}

//fetch authorities by Category
export async function fetchAuthoritiesByCategory(
  category: ComplaintCategory
) {
  const res = await api.get<IUser[]>("/admin/users", {
    params: { role: "AUTHORITY", category }
  });
  return res.data;
}
