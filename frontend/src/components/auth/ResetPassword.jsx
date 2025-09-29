import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { base_url } from "../../../Hunter";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const { token } = useParams(); // get token from URL
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = passwords;

    if (!password || !confirmPassword) {
      return toast.error("All fields are required!");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    try {
      const response = await fetch(`${base_url}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Password reset successful!");
        setTimeout(() => navigate("/Login"), 2000);
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 via-purple-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={passwords.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-300 font-semibold shadow-md"
          >
            Reset Password
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remembered your password?{" "}
          <a href="/Login" className="text-purple-600 hover:text-purple-800 font-semibold">
            Back to Login
          </a>
        </p>

        <ToastContainer position="top-right" />
      </div>
    </div>
  );
}

export default ResetPassword;
