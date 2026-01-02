interface Props {
  active: "ANALYTICS" | "COMPLAINTS" | "USERS";
  onChange: (tab: "ANALYTICS" | "COMPLAINTS" | "USERS") => void;
}

export default function AdminTabs({ active, onChange }: Props) {
  const base =
    "px-6 py-3 rounded-xl text-sm font-semibold transition-all";

  return (
    <div className="flex gap-2 bg-gray-100 p-2 rounded-2xl shadow-sm">
      <button
        onClick={() => onChange("ANALYTICS")}
        className={`${base} ${
          active === "ANALYTICS"
            ? "bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white shadow-lg"
            : "text-gray-600 hover:text-gray-800 hover:bg-white"
        }`}
      >
        📊 Analytics
      </button>

      <button
        onClick={() => onChange("COMPLAINTS")}
        className={`${base} ${
          active === "COMPLAINTS"
            ? "bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white shadow-lg"
            : "text-gray-600 hover:text-gray-800 hover:bg-white"
        }`}
      >
        📂 Complaints
      </button>

      <button
        onClick={() => onChange("USERS")}
        className={`${base} ${
          active === "USERS"
            ? "bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white shadow-lg"
            : "text-gray-600 hover:text-gray-800 hover:bg-white"
        }`}
      >
        👥 User Management
      </button>
    </div>
  );
}
