type TabKey =
  | "ALL"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "ARCHIVE";

interface Props {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "ASSIGNED", label: "Assigned" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "ARCHIVE", label: "Archive" },
];

const AuthorityTabs = ({ activeTab, onChange }: Props) => {
  return (
    <div className="mb-6 flex gap-2 border-b-2 border-gray-200">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`pb-3 px-4 font-semibold transition-all flex items-center gap-2 ${
            activeTab === t.key
              ? "border-b-4 border-[#4756ca] text-[#4756ca] -mb-0.5"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default AuthorityTabs;
