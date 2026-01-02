import React, { useState, } from "react";
import { Lock, Mail, User } from "lucide-react";
import { AxiosError } from "axios";
import api from "../../api/axios";

interface RegisterViewProps {
  onSwitchToLogin: () => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState<"form" | "verify">("form");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /* -------------------------------------------------------
   🔥 Restore verification state on refresh
  ------------------------------------------------------- */
//   useEffect(() => {
//     const pending = localStorage.getItem("pendingVerification");
//     const savedEmail = localStorage.getItem("pendingEmail");

//     if (pending === "true" && savedEmail) {
//       setEmail(savedEmail);
//       setStep("verify");
//     }
//   }, []);

  /* -------------------------------------------------------
   REGISTER HANDLER
  ------------------------------------------------------- */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (username.length > 30) {
      setError("Username must not exceed 30 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError(
        "Username can only contain letters, numbers, underscores, and hyphens"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/auth/register", {
        username,
        email,
        password,
      });

      // ✅ Persist verification state on SUCCESS
      localStorage.setItem("pendingVerification", "true");
      localStorage.setItem("pendingEmail", email);

      setStep("verify");
    } catch (err) {
      const error = err as AxiosError<any>;

      // ✅ User exists but NOT verified → resume verification flow
      if (error.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        localStorage.setItem("pendingVerification", "true");
        localStorage.setItem("pendingEmail", email);
        setStep("verify");
        setError("");
        return;
      }

      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  /* -------------------------------------------------------
   RESEND VERIFICATION
  ------------------------------------------------------- */
  const handleResendVerification = async () => {
    try {
      await api.post("/auth/resend-verification", { email });
      alert("Verification email resent");
    } catch {
      alert("Failed to resend verification email");
    }
  };

  /* -------------------------------------------------------
   VERIFY STEP UI
  ------------------------------------------------------- */
  if (step === "verify") {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="w-16 h-16 bg-linear-to-br from-[#0fc9e7] to-[#4756ca] rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to{" "}
            <span className="font-semibold">{email}</span>.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleResendVerification}
              className="w-full py-2 border rounded"
            >
              Resend Verification Email
            </button>
             <button
                onClick={() => {
                localStorage.removeItem("pendingVerification");
                localStorage.removeItem("pendingEmail");
                setStep("form");
                setError("");
                }}
                className="w-full py-2.5 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
                Back to Registration
            </button>
            <button
              onClick={onSwitchToLogin}
              className="w-full py-2 bg-[#4756ca] text-white rounded"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
   REGISTER FORM UI
  ------------------------------------------------------- */
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-600">Join us and start your journey</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourusername"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4756ca] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4756ca] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4756ca] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4756ca] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white font-medium rounded-md hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-[#4756ca] font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterView;
