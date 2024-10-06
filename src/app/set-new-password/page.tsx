"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SetNewPassword: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resetToken = searchParams.get("token");

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/set-new-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, token: resetToken }),
      });

      if (response.ok) {
        setMessage("Password updated successfully. Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while resetting the password.");
    }
  };

  return (
    <div className="h-94 flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm">
        <h1 className="text-2xl font-semibold mb-4">Set New Password</h1>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleNewPassword}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            className="w-full px-4 py-2 mb-4 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetNewPassword;
