import api from "./axios";

export const getNotifications = async () => {
  const res = await api.get("/complaints/notifications");
  return res.data;
};

export const markNotificationsRead = async (complaintId: string) => {
  await api.patch(`/complaints/${complaintId}/notifications/read`);
};
