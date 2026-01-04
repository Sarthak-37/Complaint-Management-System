import CreateComplaintCTA from "../../components/complaints/CreateComplaintCTA";
import ComplaintList from "../../components/complaints/ComplaintList";

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <CreateComplaintCTA />
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:col-span-4 gap-2">
          <ComplaintList />
        </div>
    </div>
  );
};

export default UserDashboard;
