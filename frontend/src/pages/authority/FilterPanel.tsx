import { useAuth } from "../../auth/useAuth";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
}

const AuthorityFilterPanel = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: Props) => {
  const { user } = useAuth();
  const categories = user?.categories ?? [];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Search */}
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by ID, title, or category..."
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#0fc9e7] focus:ring-4 focus:ring-[#0fc9e7]/20 outline-none transition-all font-medium"
        />

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#0fc9e7] focus:ring-4 focus:ring-[#0fc9e7]/20 outline-none transition-all font-medium bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AuthorityFilterPanel;
