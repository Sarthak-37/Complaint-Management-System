import { useState } from "react";
import AdminTabs from "./AdminTabs";
import UserManagement from "./UserManagement";
import AdminComplaints from "./AdminComplaints";
import AdminAnalytics from "./analytics/AdminAnalytics";
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<
    "ANALYTICS" | "COMPLAINTS" | "USERS"
  >("ANALYTICS");

  return (
    <div className="space-y-8">
      <div className="bg-linear-to-r from-[#3186b2] to-[#4756ca] rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      </div>

      <AdminTabs
        active={activeTab}
        onChange={setActiveTab}
      />

      {/* CONTENT */}
      {activeTab === "ANALYTICS" && <AdminAnalytics />}

      {activeTab === "COMPLAINTS" && <AdminComplaints />}

      {activeTab === "USERS" && (
        <UserManagement />
      )}
    </div>
  );
};

export default AdminDashboard;
