import CreateComplaintCTA from "../../components/complaints/CreateComplaintCTA";
import ComplaintList from "../../components/complaints/ComplaintList";

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <CreateComplaintCTA />
        <div className="lg:col-span-2">
          <ComplaintList />
        </div>
    </div>
  );
};

export default UserDashboard;
