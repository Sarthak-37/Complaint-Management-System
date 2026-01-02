import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/useAuth";
import { LogOut, User, ChevronDown, Shield, UserCircle } from "lucide-react";

interface NavbarProps {
  title: string;
  onLogout: () => void;
}

const Navbar = ({ title, onLogout }: NavbarProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!user) return null;

  // Get role color based on user role
  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "from-[#4756ca] to-[#3186b2]";
      case "AUTHORITY":
        return "from-[#3186b2] to-[#0fc9e7]";
      case "USER":
        return "from-[#0fc9e7] to-[#3186b2]";
      default:
        return "from-gray-600 to-gray-700";
    }
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return Shield;
      case "AUTHORITY":
        return UserCircle;
      case "USER":
        return User;
      default:
        return User;
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* LEFT - Title Section */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-linear-to-br from-[#0fc9e7] to-[#4756ca] flex items-center justify-center">
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-lg text-gray-900">{title}</h1>
          <p className="text-xs text-gray-500">
            Complaint Management System
          </p>
        </div>
      </div>

      {/* RIGHT - User Profile */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 transition-all duration-200 hover:border-[#4756ca] group"
        >
          {/* Avatar with gradient */}
          <div className={`h-9 w-9 rounded-full bg-linear-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-shadow`}>
            {(user.username || user.email || "U")[0].toUpperCase()}
          </div>
          
          {/* User Info */}
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-semibold text-gray-900 leading-tight">
              {user.username || user.email?.split('@')[0]}
            </span>
            <span className="text-xs text-gray-500 leading-tight">
              {user.role}
            </span>
          </div>

          {/* Chevron Icon */}
          <ChevronDown 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`} 
          />
        </button>

        {/* DROPDOWN MENU */}
        {open && (
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info Header */}
            <div className="p-4 bg-linearto-br from-gray-50 to-blue-50 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <div className={`h-12 w-12 rounded-full bg-linear-to-br ${getRoleColor(user.role)} flex items-center justify-center text-white font-bold shadow-md shrink-0`}>
                  {(user.username || user.email || "U")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.username || user.email?.split('@')[0]}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {user.email}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-full border border-gray-200">
                    <RoleIcon className="w-3.5 h-3.5 text-[#4756ca]" />
                    <span className="text-xs font-medium text-gray-700">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150 group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Sign out</p>
                  <p className="text-xs text-red-500">End your session</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;