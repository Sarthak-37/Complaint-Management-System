import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';
import DemoCredentialsCard from './DemoCredentialsCard';

interface LoginViewProps {
  onSwitchToRegister: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // ✅ Handle session expiration
  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      setError("Your session has expired. Please login again.");
    }
  }, [searchParams]);

  const handleCredentialSelect = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);

      console.log("Logged in user:", user);

      // ✅ ROLE-BASED REDIRECT (SOURCE OF TRUTH)
      switch (user.role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "AUTHORITY":
          navigate("/authority/dashboard");
          break;
        case "USER":
          navigate("/user/dashboard");
          break;
        default:
          navigate("/auth");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    setShowForgotPassword(false);
    setError('');
    
    // TODO: Add your password reset API call here
    // Example:
    // try {
    //   await api.post("/auth/forgot-password", { email });
    //   alert("Password reset link sent to your email");
    // } catch (err) {
    //   setError("Failed to send reset link");
    // }
  };

  if (showForgotPassword) {
    return (
      <div className="w-full max-w-md mx-auto animate-in fade-in duration-300">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-sm text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4756ca] focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleForgotPassword(e);
              }}
              className="w-full py-2.5 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              Send Reset Link
            </button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to your dashboard</p>
        </div>

        <div className="space-y-4">
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

          {/* <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#4756ca] focus:ring-[#4756ca]" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-[#4756ca] hover:text-[#3186b2] font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div> */}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogin(e);
            }}
            disabled={isLoading}
            className="w-full py-2.5 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white font-medium rounded-md hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-[#4756ca] hover:text-[#3186b2] font-medium transition-colors"
            >
              Create one now
            </button>
          </p>
        </div>
      </div>
        <DemoCredentialsCard onCredentialSelect={handleCredentialSelect} />
    </div>
  );
};

export default LoginView;