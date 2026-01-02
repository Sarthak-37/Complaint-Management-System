import { useEffect, useMemo, useState } from "react";
import StatCard from "./StatCard";
import ComplaintsByStatus from "./charts/ComplaintsByStatus";
import ComplaintsByCategory from "./charts/ComplaintsByCategory";
import UsersByRole from "./charts/UsersByRole";
import { fetchUsers } from "../../../api/admin.api";
import { getMyComplaints } from "../../../api/complain.api";

const AdminAnalytics = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetchUsers("USER"),
      fetchUsers("AUTHORITY"),
      getMyComplaints(), // admin should see all complaints later
    ]).then(([users, authorities, complaints]) => {
      setUsers([...users, ...authorities]);
      setComplaints(complaints);
    });
  }, []);

  const stats = useMemo(() => {
    const totalComplaints = complaints.length;
    const activeComplaints = complaints.filter(
      (c) => !["RESOLVED", "CLOSED"].includes(c.status)
    ).length;

    return {
      totalUsers: users.filter((u) => u.role === "USER").length,
      totalAuthorities: users.filter((u) => u.role === "AUTHORITY").length,
      totalComplaints,
      activeComplaints,
    };
  }, [users, complaints]);

  const complaintsByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    complaints.forEach((c) => {
      map[c.status] = (map[c.status] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [complaints]);

  const complaintsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    complaints.forEach((c) => {
      map[c.category] = (map[c.category] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [complaints]);

  const usersByRole = useMemo(() => {
    return [
      { name: "Users", value: stats.totalUsers },
      { name: "Authorities", value: stats.totalAuthorities },
    ];
  }, [stats]);

  return (
    <div className="space-y-8">
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Authorities" value={stats.totalAuthorities} />
        <StatCard label="Total Complaints" value={stats.totalComplaints} />
        <StatCard label="Active Complaints" value={stats.activeComplaints} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ComplaintsByStatus data={complaintsByStatus} />
        <UsersByRole data={usersByRole} />
      </div>

      <ComplaintsByCategory data={complaintsByCategory} />
    </div>
  );
};

export default AdminAnalytics;
