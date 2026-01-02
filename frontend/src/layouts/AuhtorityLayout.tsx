import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Navbar from "../components/layout/Navbar";


const AuthorityLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="flex-1 flex flex-col">
        <Navbar
          title="Authority Dashboard"
          onLogout={logout}
        />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthorityLayout;
