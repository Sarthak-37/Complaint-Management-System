import { updateUserStatus } from "../../api/admin.api";
import type { IUser } from "../../types/user";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  user: IUser;
  onUpdated: () => void;
}

export default function UserStatusAction({ user, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);

  const isActive = user.accountStatus === "ACTIVE";
  const action = isActive ? "SUSPEND" : "ACTIVATE";

  const handleClick = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to ${action.toLowerCase()} this account?`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await updateUserStatus(user._id, action);
      toast.success(`User account ${action.toLowerCase()}d successfully.`);
      onUpdated(); // 🔁 refetch list
    } catch {
      toast.error("Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleClick}
      className={`px-4 py-2 rounded-xl font-bold transition-all ${
        isActive 
          ? "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:scale-105" 
          : "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg hover:scale-105"
      } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
    >
      {loading ? "Updating..." : action}
    </button>
  );
}
