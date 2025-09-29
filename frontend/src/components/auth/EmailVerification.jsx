import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base_url } from "../../../Hunter";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EmailVerification() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${base_url}/auth/verify-email/${token}`);
        const result = await response.json();

        if (response.ok) {
          toast.success(result.message || "Email verified successfully!");
          setTimeout(() => navigate("/Login"), 2000);
        } else {
          toast.error(result.message || "Email verification failed");
        }
      } catch (err) {
        console.error("Email verification error:", err);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 via-purple-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Email Verification
        </h1>

        {loading ? (
          <p className="text-gray-600">Verifying your email, please wait...</p>
        ) : (
          <p className="text-gray-600">
            Check notifications for verification status.
          </p>
        )}

        <ToastContainer position="top-right" />
      </div>
    </div>
  );
}

export default EmailVerification;
