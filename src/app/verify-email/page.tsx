"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const VerifyEmail: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [showLoginButton, setShowLoginButton] = useState(false);

  // Fetch the verification code from the URL parameters
  const verificationCode = searchParams.get("code");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!verificationCode) {
        setMessage("Invalid or missing verification code.");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verification/${verificationCode}`, {
          method: "GET",
        });

        if (response.ok) {
          setMessage("Email verified successfully.");
          setShowLoginButton(true); // Show the login button after successful verification
        } else {
          setMessage("Failed to verify email. Please try again.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setMessage("An error occurred during email verification.");
      }
    };

    verifyEmail();
  }, [verificationCode]);

  return (
    <div className="h-92 flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm">
        <h1 className="text-2xl font-semibold mb-4">Email Verification</h1>
        <p className="text-lg">{message}</p>
        {showLoginButton && (
          <button
            onClick={() => router.push("/login")}
            className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;