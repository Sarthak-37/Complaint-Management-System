import CreateComplaintCTA from "../../components/complaints/CreateComplaintCTA";
import ComplaintList from "../../components/complaints/ComplaintList";

const UserDashboard = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-6">
      
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CTA Section */}
        <div className="lg:col-span-1">
          <div className="
            h-full
            bg-white dark:bg-zinc-900
            rounded-xl
            border border-zinc-200 dark:border-zinc-800
            shadow-sm
            p-4 sm:p-5
          ">
            <CreateComplaintCTA />
          </div>
        </div>

        {/* Complaint List Section */}
        <div className="lg:col-span-2">
          <div className="
            h-full
            bg-white dark:bg-zinc-900
            rounded-xl
            border border-zinc-200 dark:border-zinc-800
            shadow-sm
            p-4 sm:p-5
          ">
            <ComplaintList />
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
