import { useEffect, useState } from "react";
import type { IComplaint } from "../../types/complaint";
import type { IUser } from "../../types/user";
import {
  fetchAuthoritiesByCategory,
  assignComplaint
} from "../../api/admin.api";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  complaint: IComplaint | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignAuthorityModal({
  open,
  complaint,
  onClose,
  onSuccess
}: Props) {
  const [authorities, setAuthorities] = useState<IUser[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !complaint) return;
    setLoading(true);
    fetchAuthoritiesByCategory(complaint.category)
      .then(setAuthorities)
      .finally(() => setLoading(false));
  }, [open, complaint]);

  if (!open || !complaint) return null;

  const submit = async () => {
    if (!selected) {
      setError("Select an authority");
      return;
    }
    try {
      setLoading(true);
      await assignComplaint({
        complaintId: complaint._id,
        authorityId: selected
      });
      toast.success("Complaint assigned to authority successfully.");
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to assign complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#fcfcfc] w-full max-w-lg rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-linear-to-r from-[#3186b2] to-[#4756ca] rounded-lg">
            <span className="text-white text-lg">👤</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Assign Authority</h3>
        </div>

        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          Complaint: <span className="font-mono font-semibold text-gray-800">{complaint.complaintCode}</span>
        </p>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {authorities.map((a) => (
            <div
              key={a._id}
              className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${
                selected === a._id
                  ? "border-[#0fc9e7] bg-[#0fc9e7]/10"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => setSelected(a._id)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{a.name || a.email}</span>
                <div className="flex flex-wrap gap-1">
                  {a.categories && a.categories.length > 0 ? (
                    a.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                      >
                        {cat}
                      </span>
                    ))
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-6 py-3 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            onClick={submit}
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
