import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      toast.error("Invalid verification link");
      navigate("/auth");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/verify-email?token=${token}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        let data: any = null;
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          data = await res.json();
        }

        // ❌ Real failure cases
        if (!res.ok) {
          // 👇 treat reused / expired token as SUCCESS
          if (
            data?.message === "Invalid or expired verification token" ||
            data?.message === "Email already verified"
          ) {
            toast.success("Email already verified 🎉");
            navigate("/auth");
            return;
          }

          throw new Error(data?.message || "Verification failed");
        }

        // ✅ Success case
        localStorage.removeItem("pendingVerification");
        localStorage.removeItem("pendingEmail");

        toast.success(data?.message || "Email verified successfully 🎉");
        setTimeout(() => navigate("/auth"), 1200);

      } catch (error: any) {
        // ❌ Only real failures reach here
        toast.error(error.message || "Verification failed");
        setTimeout(() => navigate("/auth"), 1500);
      }
    };


    verifyEmail();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600 text-sm">
        Verifying your email, please wait…
      </p>
    </div>
  );
};

export default VerifyEmail;
