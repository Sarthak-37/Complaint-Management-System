import {
  ComplaintPriority,
  ComplaintStatus,
  type IComplaint
} from "../../types/complaint";
import {
  updateComplaintPriority,
  updateComplaintStatus
} from "../../api/complain.api";
import toast from "react-hot-toast";
import { History, User, Tag } from "lucide-react";
import ComplaintTimeline from "../../components/complaints/ComplainTimeline";
interface Props {
  complaint: IComplaint;
  onClose: () => void;
  onUpdated: () => void;
}

const FINAL_STATES: ComplaintStatus[] = [
  ComplaintStatus.RESOLVED,
  ComplaintStatus.REJECTED,
  ComplaintStatus.CLOSED,
  ComplaintStatus.ESCALATED,
];

const AuthorityComplaintDetailsModal = ({
  complaint,
  onClose,
  onUpdated,
}: Props) => {
  const isReadOnly = FINAL_STATES.includes(complaint.status);

  const changeStatus = async (nextStatus: ComplaintStatus) => {
    try {
      await updateComplaintStatus(complaint._id, nextStatus);
      toast.success(`Complaint status updated to ${nextStatus.replace("_", " ")}`);
      onUpdated();
      onClose();
    } catch {
      toast.error("Failed to update complaint status");
    }
  };

  const changePriority = async (priority: ComplaintPriority) => {
    try {
      await updateComplaintPriority(complaint._id, priority);
      toast.success(`Complaint priority updated to ${priority}`);
      onUpdated();
    } catch {
      toast.error("Failed to update complaint priority");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-[#fcfcfc] shadow-2xl">
        
        {/* Header */}
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
          {/* Status & Priority Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-[#3186b2] border border-blue-200">
              {complaint.status.replace("_", " ")}
            </span>
            <span className="px-4 py-2 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
              {complaint.priority} PRIORITY
            </span>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
              <Tag className="h-5 w-5 text-[#4756ca]" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Category</p>
                <p className="font-semibold text-gray-800">{complaint.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
              <User className="h-5 w-5 text-[#4756ca]" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">User</p>
                <p className="font-semibold text-gray-800">{complaint.createdBy?.email}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* Actions */}
          {!isReadOnly && (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3">
                {complaint.status === ComplaintStatus.ASSIGNED && (
                  <>
                    <button
                      onClick={() => changeStatus(ComplaintStatus.IN_PROGRESS)}
                      className="px-6 py-3 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
                    >
                      Start Progress
                    </button>
                    <button
                      onClick={() => changeStatus(ComplaintStatus.REJECTED)}
                      className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                    >
                      Reject
                    </button>
                  </>
                )}

                {complaint.status === ComplaintStatus.IN_PROGRESS && (
                  <>
                    <button
                      onClick={() => changeStatus(ComplaintStatus.RESOLVED)}
                      className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => changeStatus(ComplaintStatus.ESCALATED)}
                      className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all"
                    >
                      Escalate
                    </button>
                  </>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Change Priority</label>
                  <select
                    defaultValue={complaint.priority}
                    onChange={(e) => changePriority(e.target.value as ComplaintPriority)}
                    className="border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-[#0fc9e7] focus:ring-4 focus:ring-[#0fc9e7]/20 outline-none transition-all font-medium bg-white"
                  >
                    {Object.values(ComplaintPriority).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <History className="h-5 w-5 text-[#4756ca]" />
              Status History
            </h3>
            {complaint.statusHistory?.length ? (
              <ComplaintTimeline history={complaint.statusHistory} />
            ) : (
              <div className="text-center py-12">
                <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No status history available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityComplaintDetailsModal;
