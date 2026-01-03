import { useEffect, useState } from "react";
import {
  fetchAdminComplaints,
  transitionComplaintStatus
} from "../../api/admin.api";
import type { IComplaint } from "../../types/complaint";
import toast from "react-hot-toast";

/* TABLE + MODALS */
import AdminComplaintsTable from "../../components/admin/ComplaintsTable";
import AssignAuthorityModal from "../../components/admin/AssignAuthorityModal";
import AdminComplaintDetailsModal from "./AdminComplaintDetailsModal";

const AdminComplaints = () => {
  const [submitted, setSubmitted] = useState<IComplaint[]>([]);
  const [underReview, setUnderReview] = useState<IComplaint[]>([]);
  const [escalated, setEscalated] = useState<IComplaint[]>([]);
  const [reopened, setReopened] = useState<IComplaint[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- ASSIGN MODAL STATE ---------------- */
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] =
    useState<IComplaint | null>(null);

  /* ---------------- VIEW DETAILS MODAL STATE ---------------- */
  const [viewOpen, setViewOpen] = useState(false);
  const [viewComplaint, setViewComplaint] =
    useState<IComplaint | null>(null);

  /* ---------------- FETCH COMPLAINTS ---------------- */
  const loadComplaints = async () => {
    setLoading(true);
    try {
      const [
        submittedData,
        underReviewData,
        escalatedData,
        reopenedData
      ] = await Promise.all([
        fetchAdminComplaints({ status: "SUBMITTED" }),
        fetchAdminComplaints({ status: "UNDER_REVIEW" }),
        fetchAdminComplaints({ status: "ESCALATED" }),
        fetchAdminComplaints({ status: "REOPENED" })
      ]);

      setSubmitted(submittedData);
      setUnderReview(underReviewData);
      setEscalated(escalatedData);
      setReopened(reopenedData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  /* ---------------- ACTION HANDLERS ---------------- */
  const moveToReview = async (id: string) => {
    try {
      await transitionComplaintStatus(id, "UNDER_REVIEW");
      toast.success("Complaint moved to review successfully.");
      loadComplaints();
    } catch {
      toast.error("Failed to move complaint to review.");
    }
  };

  const rejectComplaint = async (id: string) => {
    try {
      await transitionComplaintStatus(id, "REJECTED");
      toast.success("Complaint rejected successfully.");
      loadComplaints();
    } catch {
      toast.error("Failed to reject complaint.");
    }
  };

  const resolveEscalated = async (id: string) => {
    try {
      await transitionComplaintStatus(id, "RESOLVED");
      toast.success("Escalated complaint resolved successfully.");
      loadComplaints();
    } catch {
      toast.error("Failed to resolve escalated complaint.");
    }
  };

  const openAssign = (complaint: IComplaint) => {
    setSelectedComplaint(complaint);
    setAssignOpen(true);
  };

  const closeAssign = () => {
    setAssignOpen(false);
    setSelectedComplaint(null);
  };

  const openView = (complaint: IComplaint) => {
    setViewComplaint(complaint);
    setViewOpen(true);
  };

  const closeView = () => {
    setViewOpen(false);
    setViewComplaint(null);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Complaints</h2>

      {loading ? (
        <p>Loading complaints...</p>
      ) : (
        <>
          {/* ---------------- SUBMITTED ---------------- */}
          <section>
            <h3 className="font-medium mb-3">
              Submitted Complaints
            </h3>

            <AdminComplaintsTable
              complaints={submitted}
              onView={openView}
              onReview={moveToReview}
            />
          </section>

          {/* ---------------- UNDER REVIEW ---------------- */}
          <section>
            <h3 className="font-medium mb-3">
              Under Review Complaints
            </h3>

            <AdminComplaintsTable
              complaints={underReview}
              onView={openView}
              onAssign={openAssign}
              onReject={rejectComplaint}
            />
          </section>

          {/* ---------------- ESCALATED (ADMIN FINAL) ---------------- */}
          <section>
            <h3 className="font-medium mb-3 text-orange-600">
              Escalated Complaints
            </h3>

            <AdminComplaintsTable
              complaints={escalated}
              onView={openView}
              onReview={resolveEscalated} // reuse Review slot as Resolve
              onReject={rejectComplaint}
            />
          </section>

          {/* ---------------- REOPENED ---------------- */}
          <section>
            <h3 className="font-medium mb-3 text-purple-600">
              Reopened Complaints
            </h3>

            <AdminComplaintsTable
              complaints={reopened}
              onView={openView}
              onAssign={openAssign}
              onReject={rejectComplaint}
            />
          </section>
        </>
      )}

      {/* ---------------- ASSIGN AUTHORITY MODAL ---------------- */}
      <AssignAuthorityModal
        open={assignOpen}
        complaint={selectedComplaint}
        onClose={closeAssign}
        onSuccess={loadComplaints}
      />

      {/* ---------------- VIEW DETAILS MODAL ---------------- */}
      {viewOpen && viewComplaint && (
        <AdminComplaintDetailsModal
          complaint={viewComplaint}
          onClose={closeView}
          onUpdated={loadComplaints}
        />
      )}
    </div>
  );
};

export default AdminComplaints;
