import { useEffect, useMemo, useState } from "react";
import AuthorityOverview from "./Overview";
import AuthorityFilterPanel from "./FilterPanel";
import AuthorityTabs from "./AuthorityTabs";
import { TAB_STATUS_MAP } from "./utils/tabStatusMap";
import { getMyComplaints } from "../../api/complain.api";
import AuthorityComplaintsTable from "./ComplaintsTable";
import { ComplaintStatus} from "../../types/complaint";
import type { TabKey } from "./utils/tabStatusMap";
import AuthorityComplaintDetailsModal from "./AuthorityComplaintDetailsModal";

interface Complaint {
  _id: string;
  complaintCode: string;
  title: string;
  status: ComplaintStatus;
  category: string;
  [key: string]: any;
}

const AuthorityDashboard = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] =
    useState<TabKey>("ALL");
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);

  useEffect(() => {
    getMyComplaints().then((data) => setComplaints(data));
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesTab =
        TAB_STATUS_MAP[activeTab].includes(c.status);

      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        c.complaintCode?.toLowerCase().includes(q) ||
        c.title?.toLowerCase().includes(q);

      const matchesCategory =
        !category || c.category === category;

      return matchesTab && matchesSearch && matchesCategory;
    });
  }, [complaints, activeTab, search, category]);

  return (
    <div>
      <AuthorityOverview />

      <AuthorityFilterPanel
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
      />

      <AuthorityTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <AuthorityComplaintsTable
        data={filteredComplaints}
        onView={(c) => {
          setSelectedComplaint(c)
        }}
      />

          {selectedComplaint && (
        <AuthorityComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onUpdated={() =>
            getMyComplaints().then(setComplaints)
          }
        />
      )}

    </div>
  );
};

export default AuthorityDashboard;

// inside component render

