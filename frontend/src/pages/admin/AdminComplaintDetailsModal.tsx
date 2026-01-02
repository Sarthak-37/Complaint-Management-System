import { useEffect, useState } from "react";
import {
  getComplaintHistory
} from "../../api/complain.api";
import { History, FileText } from "lucide-react";
import ComplaintTimeline from "../../components/complaints/ComplainTimeline";

interface Props {
  complaint: any;
  onClose: () => void;
  onUpdated: () => void;
}

const AdminComplaintDetailsModal = ({
  complaint,
  onClose,
}: Props) => {
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"details" | "timeline">("details");

  useEffect(() => {
    getComplaintHistory(complaint._id).then(setHistory);
  }, [complaint._id]);

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

          {/* Tabs */}
          <div className="flex gap-2 bg-gray-100 p-2 rounded-2xl shadow-sm">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "details"
                  ? "bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800 hover:bg-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              Details
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === "timeline"
                  ? "bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800 hover:bg-white"
              }`}
            >
              <History className="w-4 h-4" />
              Timeline
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "details" && (
            <>
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
            </>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <History className="h-5 w-5 text-[#4756ca]" />
                Status History
              </h3>
              {history.length ? (
                <ComplaintTimeline history={history} />
              ) : (
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No status history available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetailsModal;
