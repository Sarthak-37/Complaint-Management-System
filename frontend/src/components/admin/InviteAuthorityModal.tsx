import { useState } from "react";
import { ComplaintCategory } from "../../types/complaint";
import { inviteAuthority } from "../../api/admin.api";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  POLICY_PAYMENTS: "Policy & Payments",
  CLAIMS: "Claims",
  SUPPORT_APP: "Support / App",
  OTHER: "Other"
};

export default function InviteAuthorityModal({
  open,
  onClose,
  onSuccess
}: Props) {
  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const toggleCategory = (cat: ComplaintCategory) => {
    setCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const submit = async () => {
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (categories.length === 0) {
      setError("Select at least one category");
      return;
    }

    try {
      setLoading(true);

      await inviteAuthority({
        email,
        categories,
        instructions: instructions || undefined
      });

      toast.success("Authority invitation sent successfully.");
      onSuccess();
      onClose();

      setEmail("");
      setCategories([]);
      setInstructions("");
    } catch {
      toast.error("Failed to send invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#fcfcfc] w-full max-w-md rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-linear-to-r from-[#3186b2] to-[#4756ca] rounded-lg">
            <span className="text-white text-lg">📧</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Invite Authority</h2>
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Authority email"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#0fc9e7] focus:ring-4 focus:ring-[#0fc9e7]/20 outline-none transition-all font-medium"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Categories */}
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3">
            Assign Categories
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.values(ComplaintCategory).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  categories.includes(cat)
                    ? "bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white border-transparent"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#0fc9e7]"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions (optional) */}
        <textarea
          placeholder="Instructions (optional)"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#0fc9e7] focus:ring-4 focus:ring-[#0fc9e7]/20 outline-none transition-all font-medium resize-none"
          rows={3}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg p-3">{error}</p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-6 py-3 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}
