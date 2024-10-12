"use client";
import { createContext, useContext, useState } from "react";
import { toastErrorDefault } from "../common/toast-default-option";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useLoading } from "./LoadingContext";
import { PerformanceResponse, QuestionResponse } from "../interfaces/interfaces";

interface PerformanceProviderProps {
    getPerformance: () => Promise<PerformanceResponse | null>;
    addAnswer: (answer: QuestionResponse) =>Promise<void>;
}


const PerformanceContext = createContext<PerformanceProviderProps | undefined>(undefined);


export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const router = useRouter();
    const [performance, setPerformance] = useState<PerformanceResponse | null>(null);
    const { showLoading, hideLoading } = useLoading();

    const fetchPerformance = async () :  Promise<PerformanceResponse | null> => {
        const token = localStorage.getItem("exam-prep-tk");

        showLoading();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/performance`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("exam-prep-tk");
                router.push("/login");
                toast.error("Session expired. Please login again", toastErrorDefault);
            } else {
                toast.error("Failed to load performance data", toastErrorDefault);
            }
            hideLoading();
            return null;
        }

        const data: PerformanceResponse = await response.json();
        hideLoading();
        setPerformance(data);
        return data;
    };

    const getPerformance = async () => {
        if(!performance) {
            return await fetchPerformance();
        }
        return performance;
    }

    const addAnswer = async (answer: QuestionResponse) => {
        const isCorrect = answer.correctAnswers?.sort().toString() === answer.answer?.sort().toString();
        await getPerformance();

        if(performance) {
            const perfCopy : PerformanceResponse | null= { ...performance };
            if(perfCopy && perfCopy?.correctAnswers )
            if(isCorrect) {
                perfCopy.correctAnswers.push(answer);
            } else {
                perfCopy.incorrectAnswers.push(answer);
            }
            setPerformance(perfCopy);
        }
    }

    return (
        <PerformanceContext.Provider value={{ getPerformance, addAnswer }}>
            {children}
        </PerformanceContext.Provider>
    )
}

export const usePerformance = () => {
    const context = useContext(PerformanceContext);
    if(!context) {
        throw new Error("usePerformance must be used within a PerformanceProvider");
    }
    return context;
}