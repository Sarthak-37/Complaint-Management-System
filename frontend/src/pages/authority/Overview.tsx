import { useAuth } from "../../auth/useAuth";

const AuthorityOverview = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Authority Overview
      </h2>

      <div className="grid md:grid-cols-3 gap-6 text-sm">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-600 font-medium mb-1">Name</p>
          <p className="font-bold text-gray-800">{user?.username}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-600 font-medium mb-1">Email</p>
          <p className="font-bold text-gray-800">{user?.email}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-gray-600 font-medium mb-1">Categories</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {user?.categories?.length ? (
              user.categories.map((cat: string) => (
                <span
                  key={cat}
                  className="px-3 py-1 text-xs rounded-full bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white font-semibold"
                >
                  {cat}
                </span>
              ))
            ) : (
              <span className="text-gray-500 font-medium">
                Not assigned
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityOverview;
