import CreateComplaintCTA from "../../components/complaints/CreateComplaintCTA";
import ComplaintList from "../../components/complaints/ComplaintList";
import NotificationPanel from "../../components/NotificationPanel";

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <CreateComplaintCTA />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ComplaintList />
        </div>

        <NotificationPanel />
      </div>
    </div>
  );
};

export default UserDashboard;
