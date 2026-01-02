import api from "./axios";

export const getMyComplaints = async () => {
  const res = await api.get("/complaints/my");
  return res.data;
};

export const createComplaint = async (data: {
  title: string;
  description: string;
  category: string;
  priority?: string;
}) => {
  const res = await api.post("/complaints", data);
  return res.data;
};

export const deleteComplaint = async (id: string) => {
  await api.delete(`/complaints/${id}`);
};

export const userResolveAction = async (
  id: string,
  status: "REOPENED" | "CLOSED"
) => {
  const res = await api.patch(`/complaints/${id}/user-action`, { status });
  return res.data;
};


import { ComplaintPriority, ComplaintStatus } from "../types/complaint";

export const getComplaintHistory = async (id: string) => {
  const res = await api.get(`/complaints/${id}/history`);

  return res.data.map((h: any) => ({
    ...h,

    actor: typeof h.changedBy === "string"
      ? {
          id: "SYSTEM",
          name: "System",
          role: "SYSTEM",
        }
      : {
          id: h.changedBy._id ?? h.changedBy,
          name: h.changedBy.name ?? "User",
          role: h.changedBy.role ?? "UNKNOWN",
        }
  }));
};

export const updateComplaintStatus = (
  id: string,
  nextStatus: ComplaintStatus
) =>
  api.patch(`/complaints/${id}/status`, { nextStatus }).then(res => res.data);

export const updateComplaintPriority = (
  id: string,
  priority: ComplaintPriority
) =>
  api.patch(`/complaints/${id}/priority`, { priority }).then(res => res.data);
