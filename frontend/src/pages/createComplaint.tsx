import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createComplaint } from "../api/complain.api";
import { COMPLAINT_CATEGORIES } from "../const/complaintCategories";
import { Send, FileText, Tag, ArrowLeft } from "lucide-react";

const CreateComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createComplaint(form);
      toast.success("Complaint created successfully!");
      navigate("/user/dashboard");
    } catch {
      toast.error("Failed to create complaint. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fcfcfc] via-[#0fc9e7]/5 to-[#4756ca]/5 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#4756ca] mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="bg-linear-to-r from-[#3186b2] to-[#4756ca] rounded-2xl p-8 mb-6 shadow-xl">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Complaint</h1>
          <p className="text-white/80 text-sm">Fill in the details below to submit your complaint</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <form onSubmit={submit} className="space-y-6">
            
            {/* Title Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide">
                <FileText className="h-4 w-4 text-[#4756ca]" />
                Complaint Title
              </label>
              <input
                placeholder="Enter a brief title for your complaint"
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#0fc9e7] focus:ring-4 focus:ring-[#0fc9e7]/20 outline-none transition-all font-medium"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide">
                <FileText className="h-4 w-4 text-[#4756ca]" />
                Description
              </label>
              <textarea
                placeholder="Provide detailed information about your complaint..."
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#0fc9e7] focus:ring-4 focus:ring-[#0fc9e7]/20 outline-none transition-all min-h-37.5 font-medium resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            {/* Category + Priority Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Category Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide">
                  <Tag className="h-4 w-4 text-[#4756ca]" />
                  Category
                </label>
                <select
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#0fc9e7] focus:ring-4 focus:ring-[#0fc9e7]/20 outline-none transition-all font-medium bg-white"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {COMPLAINT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Field */}
              {/* <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide">
                  <AlertCircle className="h-4 w-4 text-[#4756ca]" />
                  Priority Level
                </label>
                <select
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-[#0fc9e7] focus:ring-4 focus:ring-[#0fc9e7]/20 outline-none transition-all font-medium bg-white"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div> */}
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-100"></div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading || !form.title || !form.description || !form.category}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Submit Complaint
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;
