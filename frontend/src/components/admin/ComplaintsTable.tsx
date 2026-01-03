import type { IComplaint } from "../../types/complaint";
import { ComplaintStatus } from "../../types/complaint";

interface Props {
  complaints: IComplaint[];
  onView: (complaint: IComplaint) => void;
  onReview?: (id: string) => void;
  onReject?: (id: string) => void;
  onAssign?: (complaint: IComplaint) => void;
}

export default function AdminComplaintsTable({
  complaints,
  onView,
  onReview,
  onReject,
  onAssign
}: Props) {
  if (!complaints.length) {
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
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Code</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Title</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Category</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Status</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Created</th>
            <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map((c) => (
            <tr
              key={c._id}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 font-mono font-semibold text-gray-800">
                {c.complaintCode}
              </td>

              <td className="px-6 py-4 text-gray-800 font-medium">{c.title}</td>
              <td className="px-6 py-4 text-gray-700">{c.category}</td>

              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                  {c.status.replace("_", " ")}
                </span>
              </td>

              <td className="px-6 py-4 text-gray-600">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>

              <td className="px-6 py-4 space-x-3">
                {/* VIEW (always available) */}
                <button
                  onClick={() => onView(c)}
                  className="px-4 py-2 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  View
                </button>

                {/* SUBMITTED */}
                {c.status === ComplaintStatus.SUBMITTED && (
                  <>
                    <button
                      onClick={() => onReview?.(c._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
                    >
                      Review
                    </button>
                  </>
                )}

                {/* UNDER REVIEW */}
                {c.status === ComplaintStatus.UNDER_REVIEW && (
                  <>
                    <button
                      onClick={() => onAssign?.(c)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all"
                    >
                      Assign
                    </button>

                    <button
                      onClick={() => onReject?.(c._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* ESCALATED */}
                {c.status === ComplaintStatus.ESCALATED && (
                  <>
                    <button
                      onClick={() => onReview?.(c._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
                    >
                      Resolve
                    </button>

                    <button
                      onClick={() => onReject?.(c._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* REOPENED */}
                {c.status === ComplaintStatus.REOPENED && (
                  <>
                    <button
                      onClick={() => onAssign?.(c)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all"
                    >
                      Assign
                    </button>

                    <button
                      onClick={() => onReject?.(c._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
