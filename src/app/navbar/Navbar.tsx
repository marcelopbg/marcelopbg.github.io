"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useLogin } from "../context/LoginContext";
import { usePathname } from "next/navigation";

const NavBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const router = useRouter();
  const loginContext = useLogin();

  const activeTab = usePathname();

  const handleLogout = () => {
    loginContext.logout();
  };

  const isActive = (path: string) => activeTab === path;

  const navItemClasses = (path: string) => {
    return `rounded-md px-3 py-2 text-sm font-medium w-full text-left ${isActive(path)
        ? `bg-white text-blue-600 ${isMobileMenuOpen ? 'font-semibold' : ''} ` // Updated active link styles
        : "text-white hover:bg-blue-500 hover:text-white" // Default link styles
      }`;
  };

  return (
    <nav className="bg-blue-600">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-4">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button className="text-white text-xl font-bold" onClick={() => router.push('/')}>Force Mock Exams</button>
          </div>
          <div className="absolute right-0 flex items-center sm:hidden">
            {/* Mobile menu button aligned to the right */}
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-2">
              {loginContext.isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      router.push("/question");
                    }}
                    className={navItemClasses("/question")}
                  >
                    Questions
                  </button>
                  <button
                    onClick={() => {
                      router.push("/performance");
                      setIsMobileMenuOpen(false);
                    }}
                    className={navItemClasses("/performance")}
                  >
                    Performance
                  </button>
                  <button
                    onClick={() => {
                      router.push("/plans");
                    }}
                    className={navItemClasses("/plans")}
                  >
                    Plans
                  </button>
                  <button
                    onClick={handleLogout}
                    className="rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      router.push("/plans");
                    }}
                    className={navItemClasses("/plans")}
                  >
                    Plans
                  </button>
                  <button
                    onClick={() => {
                      router.push("/registration");
                    }}
                    className={navItemClasses("/registration")}
                  >
                    Register
                  </button>
                  <button
                    onClick={() => {
                      router.push("/login");
                    }}
                    className={navItemClasses("/login")}
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} sm:hidden`} id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {loginContext.isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  router.push("/question");
                  setIsMobileMenuOpen(false);
                }}
                className={navItemClasses("/question")}
              >
                Questions
              </button>
              <hr className="border-gray-400" /> {/* Separator */}
              <button
                onClick={() => {
                  router.push("/performance");
                  setIsMobileMenuOpen(false);
                }}
                className={navItemClasses("/performance")}
              >
                Performance
              </button>
              <button
                onClick={() => {
                  router.push("/plans");
                  setIsMobileMenuOpen(false);
                }}
                className={navItemClasses("/plans")}
              >
                Plans
              </button>
              <hr className="border-gray-400" /> {/* Separator */}
              <button
                onClick={handleLogout}
                className="block rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  router.push("/plans");
                  setIsMobileMenuOpen(false);
                }}
                className={navItemClasses("/plans")}
              >
                Plans
              </button>
              <hr className="border-gray-400" /> {/* Separator */}
              <button
                onClick={() => {
                  router.push("/registration");
                  setIsMobileMenuOpen(false);
                }}
                className={navItemClasses("/registration")}
              >
                Register
              </button>
              <hr className="border-gray-400" /> {/* Separator */}
              <button
                onClick={() => {
                  router.push("/login");
                  setIsMobileMenuOpen(false);
                }}
                className={navItemClasses("/login")}
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
