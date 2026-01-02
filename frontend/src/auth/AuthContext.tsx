import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import type { AuthUser } from "../types/auth";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= HYDRATE USER ON REFRESH ================= */
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        const data = res.data;

        if (!data?.id || !data?.role) {
          throw new Error("Invalid auth payload");
        }

        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
          categories: data.categories ?? [],
        });
      })
      .catch(() => {
        toast.error("Your session has expired. Please log in again.");
        logout();
        window.location.href = "/login?session=expired";
      })
      .finally(() => setLoading(false));
  }, [token]);

  /* ================= LOGIN ================= */
  async function login(email: string, password: string): Promise<AuthUser> {
    try {
      // clear any previous session
      localStorage.removeItem("token");
      setUser(null);

      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      if (!user?.id || !user?.role) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", token);
      setToken(token);

      const normalizedUser: AuthUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        categories: user.categories ?? [],
      };

      setUser(normalizedUser);
      toast.success(`Welcome back, ${normalizedUser.username || normalizedUser.email}!`);
      return normalizedUser; // ✅ IMPORTANT
    } catch (error) {
      toast.error("Login failed. Please check your credentials and try again.");
      throw error; // Re-throw to maintain existing error handling
    }
  }

  /* ================= LOGOUT ================= */
  function logout() {
    toast.success("You have been logged out successfully.");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
