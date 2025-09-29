import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { base_url } from "../../../Hunter";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          await fetch(`${base_url}/auth/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });
        }
      } catch (_) {}
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("loggedInUser");
      toast.success("Logged out successfully!");

      setTimeout(() => navigate("/Login"), 1200);
    };

    logoutUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-50 via-purple-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Logging Out...</h1>
        <p className="text-gray-600">Please wait while we log you out.</p>
        <ToastContainer position="top-right" />
      </div>
    </div>
  );
}

export default Logout;
