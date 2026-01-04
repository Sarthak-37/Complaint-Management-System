import { useState } from "react";
import { X, RefreshCw, CheckCircle, FileText, History } from "lucide-react";
import ComplaintTimeline from "./ComplainTimeline";
import { userResolveAction } from "../../api/complain.api";
import toast from "react-hot-toast";

interface Props {
  complaint: any;
  isOpen: boolean;
  onClose: () => void;
}

const ComplaintDetailsModal = ({ complaint, isOpen, onClose }: Props) => {
  const [activeTab, setActiveTab] = useState<"details" | "timeline">("details");
  const [actionLoading, setActionLoading] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleUserAction = async (nextStatus: "REOPENED" | "CLOSED") => {
    try {
      setActionLoading(true);
      await userResolveAction(complaint._id, nextStatus);
      toast.success(`Complaint ${nextStatus.toLowerCase()} successfully.`);
      onClose();
    } catch (e: any) {
      toast.error(e.response?.data?.message || `Failed to ${nextStatus.toLowerCase()} complaint.`);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      SUBMITTED: "bg-blue-100 text-[#3186b2]",
      IN_PROGRESS: "bg-cyan-100 text-[#0fc9e7]",
      RESOLVED: "bg-green-100 text-green-700",
      REOPENED: "bg-orange-100 text-orange-700",
      CLOSED: "bg-gray-200 text-gray-700"
    };
    return statusMap[status] || "bg-gray-200 text-gray-700";
  };

  const getPriorityColor = (priority: string) => {
    const priorityMap: Record<string, string> = {
      LOW: "bg-green-100 text-green-700",
      MEDIUM: "bg-yellow-100 text-yellow-700",
      HIGH: "bg-red-100 text-red-700"
    };
    return priorityMap[priority] || "bg-gray-200 text-gray-700";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative max-h-[70vh] w-full max-w-2xl overflow-auto rounded-2xl bg-[#fcfcfc] shadow-2xl">
        
        {/* Header with linear */}
        <div className="sticky top-0 z-10 bg-linear-to-r from-[#3186b2] to-[#4756ca] p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-2xl font-bold text-white mb-2">{complaint.title}</h2>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {complaint.complaintCode}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 bg-white/20 hover:bg-white/30 text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Status + Priority Pills */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(complaint.status)}`}>
              {complaint.status.replace("_", " ")}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${getPriorityColor(complaint.priority)}`}>
              {complaint.priority} PRIORITY
            </span>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-3 px-4 font-semibold transition-all flex items-center gap-2 ${
                activeTab === "details"
                  ? "border-b-4 border-[#4756ca] text-[#4756ca] -mb-0.5"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="h-4 w-4" />
              Details
            </button>

            <button
              onClick={() => setActiveTab("timeline")}
              className={`pb-3 px-4 font-semibold transition-all flex items-center gap-2 ${
                activeTab === "timeline"
                  ? "border-b-4 border-[#4756ca] text-[#4756ca] -mb-0.5"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <History className="h-4 w-4" />
              Timeline
            </button>
          </div>

          {/* Content */}
          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                  Description
                </label>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {complaint.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                    Category
                  </label>
                  <p className="text-gray-800 font-semibold text-lg">{complaint.category}</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                    Created Date
                  </label>
                  <p className="text-gray-800 font-semibold text-lg">
                    {new Date(complaint.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              {complaint.statusHistory?.length ? (
                <ComplaintTimeline history={complaint.statusHistory} />
              ) : (
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No status history available</p>
                </div>
              )}
            </div>
          )}

          {/* User Actions */}
          {complaint.status === "RESOLVED" && (
            <div className="flex gap-3 mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <button
                disabled={actionLoading}
                onClick={() => handleUserAction("REOPENED")}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-[#3186b2] text-[#3186b2] rounded-xl font-bold hover:bg-[#3186b2] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="h-4 w-4" />
                Reopen Complaint
              </button>

              <button
                disabled={actionLoading}
                onClick={() => handleUserAction("CLOSED")}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="h-4 w-4" />
                Close Complaint
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailsModal;