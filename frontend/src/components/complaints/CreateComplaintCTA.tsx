import { useNavigate } from "react-router-dom";
import { Plus, FileText } from "lucide-react";

const CreateComplaintCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-linear-to-r from-[#3186b2] to-[#4756ca] rounded-xl">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Create a Complaint</h2>
            <p className="text-sm text-gray-600 font-medium">
              Report an issue or request assistance
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/user/complaints/new")}
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
        >
          <Plus className="h-5 w-5" />
          New Complaint
        </button>
        
      </div>
    </div>
  );
};

export default CreateComplaintCTA;
