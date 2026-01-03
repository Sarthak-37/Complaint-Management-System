import type { IUser } from "../../types/user";
import UserStatusAction from "./UserStatusAction";

interface Props {
  users: IUser[];
  onRefetch: () => void;
}

export default function AuthorityTable({
  users,
  onRefetch
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Email</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Categories</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Status</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-gray-700">{u.email}</td>
              <td className="px-6 py-4">
                <div className="flex gap-2 flex-wrap">
                  {u.categories?.map((c) => (
                    <span
                      key={c}
                      className="px-3 py-1 text-xs rounded-full bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white font-semibold"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    u.accountStatus === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {u.accountStatus}
                </span>
              </td>
              <td className="px-6 py-4">
                <UserStatusAction
                  user={u}
                  onUpdated={onRefetch}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
