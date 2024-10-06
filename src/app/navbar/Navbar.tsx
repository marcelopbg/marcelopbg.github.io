"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useLogin,  } from "../context/LoginContext";

const NavBar: React.FC = () => {
  // const pathname = usePathname();
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();
  const loginContext = useLogin();

  const handleLogout = () => {
    loginContext.logout();
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md" style={{height: '6vh'}}>
      <div className="container mx-auto flex justify-between items-center">
        <div>
          {/* Home button, navigates to the homepage */}
          <button
            onClick={() => router.push("/")}
            className="text-white font-bold text-lg hover:underline"
          >
            Force AI Mock Exams
          </button>
        </div>
        <div className="space-x-4">
          {loginContext.isLoggedIn ? (
            // Logged-in user options: Questions and Logout
            <>
              <button
                onClick={() => router.push("/question")}
                className="text-white font-medium hover:underline"
              >
                Questions
              </button>
              <button
                onClick={handleLogout}
                className="text-white font-medium hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            // Non-logged-in user options: Register and Login
            <>
              <button
                onClick={() => router.push("/registration")}
                className="text-white font-medium hover:underline"
              >
                Register
              </button>
              <button
                onClick={() => router.push("/login")}
                className="text-white font-medium hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
