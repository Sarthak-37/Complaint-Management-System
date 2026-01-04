import { useEffect, useState } from "react";
import { getMyComplaints } from "../../api/complain.api";
import ComplaintCard from "./ComplaintCard";
import ComplaintDetailsModal from "./ComplaintDetailsModal";
import { Loader2, FolderOpen } from "lucide-react";

const ComplaintList = () => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await getMyComplaints();
      setComplaints(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleView = (complaint: any) => {
    setSelectedComplaint(complaint);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedComplaint(null);
    fetchComplaints();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-[#0fc9e7] mb-4" />
        <p className="text-gray-600 font-medium">Loading your complaints...</p>
      </div>
    );
  }

  if (!complaints.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="bg-linear-to-br from-[#0fc9e7]/10 to-[#4756ca]/10 p-8 rounded-3xl mb-4">
          <FolderOpen className="h-16 w-16 text-gray-400 mx-auto" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No Complaints Yet</h3>
        <p className="text-gray-500 text-center max-w-md">
          You haven't submitted any complaints. Create your first complaint to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Complaints</h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {complaints.length} {complaints.length === 1 ? 'complaint' : 'complaints'}
          </p>
        </div>
      </div>

      {/* Complaints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols gap-4">
        {complaints.map((c) => (
          <ComplaintCard
            key={c._id}
            complaint={c}
            onView={handleView}
            onDeleted={fetchComplaints}
          />
        ))}
      </div>

      {/* Modal */}
      <ComplaintDetailsModal
        complaint={selectedComplaint}
        isOpen={modalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default ComplaintList;