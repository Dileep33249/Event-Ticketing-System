import { useState } from "react";
import { base_url } from "../../../Hunter";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required!");

    try {
      const response = await fetch(`${base_url}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Reset token generated. Check your email.");
      } else {
        toast.error(result.message || "Failed to generate reset token");
      }
    } catch (err) {
      console.error("Forgot Password error:", err);
      toast.error("Something went wrong. Try again!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-50 via-purple-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Enter your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter registered email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-300 font-semibold shadow-md"
          >
            Send Reset Link
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <a href="/Login" className="text-purple-600 hover:text-purple-800 font-semibold">
            Back to Login
          </a>
        </p>

        <ToastContainer position="top-right" />
      </div>
    </div>
  );
}

export default ForgotPassword;
