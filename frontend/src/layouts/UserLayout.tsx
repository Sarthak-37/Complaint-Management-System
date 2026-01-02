import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Navbar from "../components/layout/Navbar";


const UserLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen">


      <div className="flex-1 flex flex-col">
        <Navbar
          title="User Dashboard"
          onLogout={logout}
        />

        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
