import { useEffect, useState } from "react";
import { getNotifications, markNotificationsRead } from "../api/notification.api";
import { Bell, Check } from "lucide-react";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const refreshNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    refreshNotifications();
  }, []);

  const handleMarkAsRead = async (complaintId: string) => {
    try {
      await markNotificationsRead(complaintId);
      refreshNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-linear-to-r from-[#3186b2] to-[#4756ca] rounded-lg">
          <Bell className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
      </div>

      {!notifications.length && (
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">
            No notifications
          </p>
        </div>
      )}

      <ul className="space-y-3">
        {notifications.map((n, index) => (
          <li key={n._id || index} className="group flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-all">
            <span className="text-sm text-gray-700 font-medium">{n.message}</span>
            <button
              onClick={() => handleMarkAsRead(n.complaintId)}
              className="flex items-center gap-1 px-3 py-1.5 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
            >
              <Check className="h-3 w-3" />
              Mark as read
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPanel;
