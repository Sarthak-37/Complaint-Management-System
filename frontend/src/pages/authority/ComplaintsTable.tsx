import { Eye } from "lucide-react";

interface Props {
  data: any[];
  onView?: (complaint: any) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    ASSIGNED: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    ESCALATED: "bg-orange-100 text-orange-700",
    RESOLVED: "bg-green-100 text-green-700",
    CLOSED: "bg-gray-100 text-gray-700",
    REJECTED: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${map[status] ?? ""}`}>
      {status.replace("_", " ")}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const map: Record<string, string> = {
    LOW: "bg-gray-100 text-gray-700",
    MEDIUM: "bg-blue-100 text-blue-700",
    HIGH: "bg-orange-100 text-orange-700",
    CRITICAL: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${map[priority] ?? ""}`}>
      {priority}
    </span>
  );
};

const AuthorityComplaintsTable = ({ data, onView }: Props) => {
  if (!data.length) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500 font-medium">No complaints found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">ID</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Category</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Title & Description</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Status</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Priority</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((c) => (
            <tr key={c._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
              {/* ID */}
              <td className="px-6 py-4 font-medium text-gray-800">
                {c.complaintCode ?? c._id.slice(-6)}
              </td>

              {/* Category */}
              <td className="px-6 py-4 text-gray-700">{c.category}</td>

              {/* Title & Description */}
              <td className="px-6 py-4 max-w-xl">
                <div className="font-semibold text-gray-800">{c.title}</div>
                <div className="text-gray-600 line-clamp-2 mt-1">
                  {c.description}
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <StatusBadge status={c.status} />
              </td>

              {/* Priority */}
              <td className="px-6 py-4">
                <PriorityBadge priority={c.priority} />
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <button
                  onClick={() => onView?.(c)}
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  <Eye className="h-4 w-4" /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuthorityComplaintsTable;
