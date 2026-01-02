import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { 
  ShieldCheck, 
  Gavel, 
  FileText, 
  Lock, 
  CheckCircle2, 
  X 
} from "lucide-react";

// --- STATIC CONTENT DATA (The text we discussed) ---
const AUTHORITY_INFO = [
  {
    icon: ShieldCheck,
    title: "Authorized Jurisdiction",
    desc: "Access complaints strictly within your assigned categories.",
  },
  {
    icon: Gavel,
    title: "Resolution Power",
    desc: "Update status, change priority, and resolve grievances.",
  },
  {
    icon: FileText,
    title: "Audit Trail",
    desc: "All your actions are time-stamped and recorded for transparency.",
  },
];

const TERMS_CONTENT = [
  {
    title: "1. Confidentiality & Data Privacy",
    text: "You acknowledge that you will have access to sensitive user data. You agree to use this data strictly for the purpose of complaint resolution. Sharing or exporting data is a violation.",
  },
  {
    title: "2. Impartiality & Integrity",
    text: "You agree to handle all complaints with objectivity. You will not let personal bias influence the priority, status, or outcome of a complaint.",
  },
  {
    title: "3. Account Security",
    text: "Your Authority account is non-transferable. You are responsible for maintaining the security of your credentials.",
  },
];

const AcceptInvite = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  /* ----------------------------- State ----------------------------- */
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // UI State for Modal
  const [showTerms, setShowTerms] = useState(false);

  /* --------------------- Optional Token Verification --------------------- */
  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link");
      setLoading(false);
      return;
    }

    api
      .get("/auth/verify-invite", { params: { token } })
      .then((res) => {
        if (res.data?.email) {
          setEmail(res.data.email);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [token]);

  /* ----------------------------- Submit ----------------------------- */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!token) {
      setError("Missing invitation token");
      return;
    }

    if (!agree) {
      setError("You must accept the terms and conditions");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      console.log({ token, username, password });

      await api.post("/auth/accept-invite", {
        token,
        username,
        password,
      });
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invitation acceptance failed. Token may be expired."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ----------------------------- Render ----------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#4756ca] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Validating invitation secure token...</p>
        </div>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] text-red-600 font-medium">
        <ShieldCheck className="w-6 h-6 mr-2" /> {error}
      </div>
    );
  }

  return (
    // Applied First Color (#fcfcfc)
    <div className="min-h-screen flex bg-[#fcfcfc]">
      
      {/* LEFT SIDE: Applied Fourth Color (#4756ca) as background */}
      <div className="hidden lg:flex w-1/2 bg-[#4756ca] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} 
        />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              {/* Applied Second Color (#0fc9e7) to icon */}
              <ShieldCheck className="w-8 h-8 text-[#0fc9e7]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Authority Access</h1>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold leading-tight">
              Welcome to the <br/> 
              {/* Applied Second Color (#0fc9e7) to highlight */}
              <span className="text-[#0fc9e7]">Official Governance</span> Portal.
            </h2>
            
            <div className="space-y-6">
              {AUTHORITY_INFO.map((info, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  {/* Applied Second Color (#0fc9e7) to icons */}
                  <info.icon className="w-6 h-6 text-[#0fc9e7] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-white">{info.title}</h3>
                    <p className="text-sm text-gray-200 mt-1 leading-relaxed">{info.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-gray-300">
          Secure Environment • SSL Encrypted • Role-Based Access
        </div>
      </div>

      {/* RIGHT SIDE: The Functional Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Setup Account</h2>
            <p className="mt-2 text-gray-600">Complete your profile to access the dashboard.</p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            
            {/* Email Field (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  value={email || "Verifying..."}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-500 text-sm focus:ring-0 cursor-not-allowed"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Username - Applied LoginView Input Styles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Official Username <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="e.g. auth_sanitation_dept"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4756ca] focus:border-transparent transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-gray-500">This will be visible in complaint logs.</p>
            </div>

            {/* Password Fields - Applied LoginView Input Styles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Min 8 chars"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4756ca] focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                <input
                  type="password"
                  placeholder="Repeat password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4756ca] focus:border-transparent transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-[#fcfcfc] rounded-lg border border-gray-100">
              <input
                type="checkbox"
                id="terms-check"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#4756ca] border-gray-300 rounded focus:ring-[#4756ca]"
              />
              <label htmlFor="terms-check" className="text-sm text-gray-600">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-[#4756ca] font-medium hover:text-[#3186b2] hover:underline focus:outline-none transition-colors"
                >
                  Authority Code of Conduct
                </button>
                {" "}and accept responsibility for this account.
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button - Applied LoginView Gradient */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white font-medium rounded-md hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Complete Setup & Join"
              )}
            </button>
          </form>
          </div>
        </div>
      </div>

      {/* --- TERMS MODAL --- */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold flex items-center gap-2 text-[#4756ca]">
                <FileText className="w-5 h-5" /> Authority Code of Conduct
              </h3>
              <button 
                onClick={() => setShowTerms(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <p className="text-sm text-gray-500">
                By accepting this invitation, you agree to the following binding terms:
              </p>
              {TERMS_CONTENT.map((term, i) => (
                <div key={i} className="space-y-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{term.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{term.text}</p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => {
                  setAgree(true);
                  setShowTerms(false);
                }}
                className="bg-[#4756ca] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#3186b2] transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcceptInvite;