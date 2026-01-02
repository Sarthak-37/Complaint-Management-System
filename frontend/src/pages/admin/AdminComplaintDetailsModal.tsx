import { useEffect, useState } from "react";
import {
  ComplaintPriority,
  ComplaintStatus
} from "../../types/complaint";
import {
  getComplaintHistory,
  updateComplaintPriority,
  updateComplaintStatus
} from "../../api/complain.api";
import toast from "react-hot-toast";

interface Props {
  complaint: any;
  onClose: () => void;
  onUpdated: () => void;
  readOnly?: boolean; // for archive usage
}

const FINAL_STATES = [
  ComplaintStatus.RESOLVED,
  ComplaintStatus.REJECTED,
  ComplaintStatus.CLOSED
];

const AdminComplaintDetailsModal = ({
  complaint,
  onClose,
  onUpdated,
  readOnly = false
}: Props) => {
  const [history, setHistory] = useState<any[]>([]);
  const isReadOnly =
    readOnly || FINAL_STATES.includes(complaint.status);

  useEffect(() => {
    getComplaintHistory(complaint._id).then(setHistory);
  }, [complaint._id]);

  const changeStatus = async (nextStatus: ComplaintStatus) => {
    try {
      await updateComplaintStatus(complaint._id, nextStatus);
      const action = nextStatus === ComplaintStatus.RESOLVED ? "resolved" : "rejected";
      toast.success(`Complaint ${action} successfully.`);
      onUpdated();
      onClose();
    } catch {
      const action = nextStatus === ComplaintStatus.RESOLVED ? "resolve" : "reject";
      toast.error(`Failed to ${action} complaint.`);
    }
  };

  const changePriority = async (priority: ComplaintPriority) => {
    await updateComplaintPriority(complaint._id, priority);
    onUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-[#fcfcfc] shadow-2xl">
        
        {/* Header with linear */}
        <div className="sticky top-0 z-10 bg-linear-to-r from-[#3186b2] to-[#4756ca] p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-white mb-2">Complaint {complaint.complaintCode}</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 bg-white/20 hover:bg-white/30 text-white transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status + Priority Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-[#3186b2]`}>
              {complaint.status.replace("_", " ")}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700`}>
              {complaint.priority} PRIORITY
            </span>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 rounded-xl p-4">
            <div><b className="text-gray-700">Category:</b> <span className="font-medium">{complaint.category}</span></div>
            <div><b className="text-gray-700">User:</b> <span className="font-medium">{complaint.createdBy?.email}</span></div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <b className="text-gray-800">Description</b>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* ADMIN ACTIONS */}
          {!isReadOnly && (
            <div className="flex flex-wrap gap-3">
              {/* SUBMITTED */}
              {complaint.status === ComplaintStatus.SUBMITTED && (
                <>
                  <button
                    onClick={() =>
                      changeStatus(ComplaintStatus.UNDER_REVIEW)
                    }
                    className="px-4 py-2 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Move to Review
                  </button>
                </>
              )}

              {/* UNDER REVIEW */}
              {complaint.status === ComplaintStatus.UNDER_REVIEW && (
                <>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                    Assign from list
                  </span>

                  <button
                    onClick={() =>
                      changeStatus(ComplaintStatus.REJECTED)
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                  >
                    Reject
                  </button>
                </>
              )}

              {/* ESCALATED */}
              {complaint.status === ComplaintStatus.ESCALATED && (
                <>
                  <button
                    onClick={() =>
                      changeStatus(ComplaintStatus.RESOLVED)
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all"
                  >
                    Resolve
                  </button>

                  <button
                    onClick={() =>
                      changeStatus(ComplaintStatus.REJECTED)
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                  >
                    Reject
                  </button>
                </>
              )}

              {/* Priority (optional for admin) */}
              <select
                defaultValue={complaint.priority}
                onChange={(e) =>
                  changePriority(
                    e.target.value as ComplaintPriority
                  )
                }
                className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-[#0fc9e7] focus:ring-4 focus:ring-[#0fc9e7]/20 outline-none transition-all font-medium bg-white"
              >
                {Object.values(ComplaintPriority).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <b className="text-gray-800">Status History</b>
            <ul className="text-sm mt-3 space-y-2">
              {history.map((h, i) => (
                <li key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">{h.from} → {h.to}</span>
                  <span className="text-gray-500">({new Date(h.changedAt).toLocaleString()})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetailsModal;
