interface Props {
  active: "USER" | "AUTHORITY";
  onChange: (tab: "USER" | "AUTHORITY") => void;
}

export default function UserTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 bg-gray-100 p-2 rounded-2xl shadow-sm">
      {/* USERS TAB */}
      <button
        onClick={() => onChange("USER")}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all
          ${
            active === "USER"
              ? "bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white shadow-lg"
              : "text-gray-600 hover:text-gray-800 hover:bg-white"
          }
        `}
      >
        👤 Users
      </button>

      {/* AUTHORITIES TAB */}
      <button
        onClick={() => onChange("AUTHORITY")}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all
          ${
            active === "AUTHORITY"
              ? "bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white shadow-lg"
              : "text-gray-600 hover:text-gray-800 hover:bg-white"
          }
        `}
      >
        🏛 Authorities
      </button>
    </div>
  );
}
