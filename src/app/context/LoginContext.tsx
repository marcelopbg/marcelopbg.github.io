"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { toastSuccessDefault } from "../common/toast-default-option";

interface LoginContextProps {
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();

    // Check if the user is logged in by looking for the token in localStorage
    useEffect(() => {
        const token = localStorage.getItem("exam-prep-tk");
        setIsLoggedIn(!!token);
    }, []);

    // Update the logged-in state whenever the pathname changes
    useEffect(() => {
        const token = localStorage.getItem("exam-prep-tk");
        setIsLoggedIn(!!token);
    }, [pathname]);

    const login = (token: string) => {
        localStorage.setItem("exam-prep-tk", token);
        setIsLoggedIn(true);
        toast.success("Logged in successfully",
            toastSuccessDefault
        );
        router.push("/question"); // Redirect to home or another authenticated route
    };

    const logout = () => {
        localStorage.removeItem("exam-prep-tk");
        setIsLoggedIn(false);
        toast.success("Logged out successfully",
            toastSuccessDefault
        );
        router.push("/login"); // Redirect to login or public page
    };

    return (
        <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

// Custom hook to use the LoginContext
export const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error("useLogin must be used within a LoginProvider");
    }
    return context;
};
