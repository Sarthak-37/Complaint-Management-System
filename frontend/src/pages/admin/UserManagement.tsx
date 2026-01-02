import { useEffect, useState } from "react";
import { fetchUsers } from "../../api/admin.api";
import type { IUser } from "../../types/user";
import UserTabs from "../../components/admin/UserTabs";
import UserTable from "../../components/admin/UserTable";
import AuthorityTable from "../../components/admin/AuthorityTable";
import InviteAuthorityModal from "../../components/admin/InviteAuthorityModal";

export default function UserManagement() {
  const [activeTab, setActiveTab] =
    useState<"USER" | "AUTHORITY">("USER");
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  // ✅ single source of truth
  const loadUsers = async (role: "USER" | "AUTHORITY") => {
    setLoading(true);
    try {
      const data = await fetchUsers(role);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  // ✅ fetch when tab changes
  useEffect(() => {
    loadUsers(activeTab);
  }, [activeTab]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        User Management
      </h1>

      <div className="flex items-center justify-between mb-6">
        <UserTabs active={activeTab} onChange={setActiveTab} />

        {activeTab === "AUTHORITY" && (
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
          >
            <span>Invite Authority</span>
          </button>
        )}
      </div>

      <InviteAuthorityModal
        open={showInvite}
        onClose={() => setShowInvite(false)}
        onSuccess={() => loadUsers("AUTHORITY")}
      />

      {loading ? (
        <div className="text-center py-8">
          <div className="h-8 w-8 border-4 border-[#3186b2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : activeTab === "USER" ? (
        <UserTable
          users={users}
          onRefetch={() => loadUsers("USER")}
        />
      ) : (
        <AuthorityTable
          users={users}
          onRefetch={() => loadUsers("AUTHORITY")}
        />
      )}
    </div>
  );
}
