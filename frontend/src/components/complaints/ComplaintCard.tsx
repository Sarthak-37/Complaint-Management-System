import { Eye, Trash2, Calendar, AlertCircle } from "lucide-react";
import { deleteComplaint } from "../../api/complain.api";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  complaint: any;
  onView: (complaint: any) => void;
  onDeleted?: () => void;
}

const ComplaintCard = ({ complaint, onView, onDeleted }: Props) => {
  const [deleting, setDeleting] = useState(false);
  const canDelete = complaint.status === "SUBMITTED";

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    
    setDeleting(true);
    try {
      await deleteComplaint(complaint._id);
      toast.success("Complaint deleted successfully.");
      onDeleted?.();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to delete complaint.");
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      SUBMITTED: "bg-blue-50 text-[#3186b2] border-blue-200",
      IN_PROGRESS: "bg-cyan-50 text-[#0fc9e7] border-cyan-200",
      RESOLVED: "bg-green-50 text-green-600 border-green-200",
      REOPENED: "bg-orange-50 text-orange-600 border-orange-200",
      CLOSED: "bg-gray-100 text-gray-600 border-gray-300"
    };
    return statusMap[status] || "bg-gray-100 text-gray-600 border-gray-300";
  };

  const getPriorityColor = (priority: string) => {
    const priorityMap: Record<string, string> = {
      LOW: "bg-green-100 text-green-700 border-green-200",
      MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
      HIGH: "bg-red-100 text-red-700 border-red-200"
    };
    return priorityMap[priority] || "bg-gray-100 text-gray-600 border-gray-200";
  };

  return (
    <div className="group relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-xl hover:border-[#0fc9e7] transition-all duration-300">
      
      {/* Status Badge - Top Right */}
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
          {complaint.status.replace("_", " ")}
        </span>
      </div>

      {/* Complaint Code */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-6 bg-linear-to-b from-[#0fc9e7] to-[#3186b2] rounded-full"></div>
        <span className="font-bold text-[#4756ca] text-sm tracking-wide">
          {complaint.complaintCode}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-2 font-bold text-lg text-gray-800 line-clamp-1 pr-24 group-hover:text-[#4756ca] transition-colors">
        {complaint.title}
      </h3>

      {/* Category + Priority */}
      <div className="flex items-center gap-3 mt-3">
        <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg font-medium">
          {complaint.category}
        </span>
        <span className={`text-xs font-bold px-3 py-1 rounded-lg border flex items-center gap-1 ${getPriorityColor(complaint.priority)}`}>
          <AlertCircle className="h-3 w-3" />
          {complaint.priority}
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-gray-600 leading-relaxed line-clamp-2">
        {complaint.description}
      </p>

      {/* Divider */}
      <div className="mt-4 mb-4 border-t border-gray-100"></div>

      {/* Bottom Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="h-3.5 w-3.5" />
          <span>{new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(complaint)}
            className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Eye className="h-4 w-4" /> 
            View
          </button>

          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete complaint"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;