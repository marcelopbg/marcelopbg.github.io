"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { usePerformance } from "../context/PerformanceContext";

interface QuestionResponse {
    createdDate: Date;
    id: number;
    topic: string;
    exam: string;
    questionStem: string;
    choices: { choiceText: string; choiceLetter: string }[];
    isMultipleChoice: boolean;
    correctAnswers: string[];
    answerExplanation: string;
}

interface PerformanceResponse {
    correctAnswers: QuestionResponse[];
    incorrectAnswers: QuestionResponse[];
}

const PerformancePage: React.FC = () => {
    // const [performance, setPerformance] = useState<PerformanceResponse | null>(null);
    const [todayCorrectPercentage, setTodayCorrectPercentage] = useState<number | null>(null);
    const [weeklyCorrectPercentage, setWeeklyCorrectPercentage] = useState<number | null>(null);
    const [monthlyCorrectPercentage, setMonthlyCorrectPercentage] = useState<number | null>(null);
    const [chartData, setChartData] = useState<unknown[]>([]);
    const { getPerformance } = usePerformance();
    const router = useRouter();

    const calculatePerformance = (performanceData: PerformanceResponse) => {
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);

        const totalToday =
            performanceData.correctAnswers.filter((q) => new Date(q.createdDate).toDateString() === today.toDateString()).length +
            performanceData.incorrectAnswers.filter((q) => new Date(q.createdDate).toDateString() === today.toDateString()).length;

        const correctToday = performanceData.correctAnswers.filter(
            (q) => new Date(q.createdDate).toDateString() === today.toDateString()
        ).length;

        const totalThisWeek =
            performanceData.correctAnswers.filter((q) => new Date(q.createdDate) >= oneWeekAgo).length +
            performanceData.incorrectAnswers.filter((q) => new Date(q.createdDate) >= oneWeekAgo).length;

        const correctThisWeek = performanceData.correctAnswers.filter(
            (q) => new Date(q.createdDate) >= oneWeekAgo
        ).length;

        const totalThisMonth =
            performanceData.correctAnswers.filter((q) => new Date(q.createdDate) >= oneMonthAgo).length +
            performanceData.incorrectAnswers.filter((q) => new Date(q.createdDate) >= oneMonthAgo).length;

        const correctThisMonth = performanceData.correctAnswers.filter(
            (q) => new Date(q.createdDate) >= oneMonthAgo
        ).length;

        const todayPercentage = totalToday > 0 ? (correctToday / totalToday) * 100 : 0;
        const weeklyPercentage = totalThisWeek > 0 ? (correctThisWeek / totalThisWeek) * 100 : 0;
        const monthlyPercentage = totalThisMonth > 0 ? (correctThisMonth / totalThisMonth) * 100 : 0;

        setTodayCorrectPercentage(todayPercentage);
        setWeeklyCorrectPercentage(weeklyPercentage);
        setMonthlyCorrectPercentage(monthlyPercentage);
    };

    const generateChartData = (performanceData: PerformanceResponse) => {
        const combinedAnswers = [...performanceData.correctAnswers, ...performanceData.incorrectAnswers];
        const answersByDate: { [key: string]: { correct: number; incorrect: number } } = {};

        combinedAnswers.forEach((q) => {
            const date = new Date(q.createdDate).toLocaleDateString();
            if (!answersByDate[date]) {
                answersByDate[date] = { correct: 0, incorrect: 0 };
            }

            if (performanceData.correctAnswers.includes(q)) {
                answersByDate[date].correct += 1;
            } else {
                answersByDate[date].incorrect += 1;
            }
        });

        const data = Object.keys(answersByDate).map((date) => ({
            date,
            correct: answersByDate[date].correct,
            incorrect: answersByDate[date].incorrect,
        }));

        setChartData(data);
    };

    // const fetchPerformance = async () => {
    //     const token = localStorage.getItem("exam-prep-tk");

    //     showLoading();
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/performance`, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${token}`,
    //         },
    //     });

    //     if (!response.ok) {
    //         if (response.status === 401) {
    //             localStorage.removeItem("exam-prep-tk");
    //             router.push("/login");
    //             toast.error("Session expired. Please login again", toastErrorDefault);
    //         } else {
    //             toast.error("Failed to load performance data", toastErrorDefault);
    //         }
    //         hideLoading();
    //         return;
    //     }

    //     const data: PerformanceResponse = await response.json();
    //     setPerformance(data);
    //     calculatePerformance(data);
    //     generateChartData(data);
    //     hideLoading();
    // };
    const handlePerformance = async () => {
        const data = await getPerformance();
        if(data) {
            calculatePerformance(data);
            generateChartData(data);
        }       
    }

    useEffect(() => {
        handlePerformance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getColorForPercentage = (percentage: number | null) => {
        if (percentage === null) return 'text-red-500';
        if (percentage > 70) return 'text-green-500';
        if (percentage > 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="flex flex-col items-center h-screen bg-gray-100 pt-2">
                <>
                    <div className="w-full max-w-2xl mb-4 p-4 bg-white rounded-xl shadow-md">
                        <h3 className="text-lg font-bold mb-2">Performance Metrics</h3>
                        <div className="flex justify-between">
                            <div className="w-1/3 text-center">
                                <p className="text-sm font-semibold text-gray-500 uppercase">Today</p>
                                <p className="text-3xl font-bold">
                                   <span className={getColorForPercentage(todayCorrectPercentage)}>{todayCorrectPercentage?.toFixed(1)}%</span> 
                                </p>
                            </div>
                            <div className="w-1/3 text-center">
                                <p className="text-sm font-semibold text-gray-500 uppercase">This Week</p>
                                <p className="text-3xl font-bold">
                                   <span className={getColorForPercentage(weeklyCorrectPercentage)}>{weeklyCorrectPercentage?.toFixed(1)}%</span> 
                                </p>
                            </div>
                            <div className="w-1/3 text-center">
                                <p className="text-sm font-semibold text-gray-500 uppercase">This Month</p>
                                <p className="text-3xl font-bold">
                                    <span className={getColorForPercentage(monthlyCorrectPercentage)}>{monthlyCorrectPercentage?.toFixed(1)}%</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-2xl mb-4 p-4 bg-white rounded-xl shadow-md">
                        <h3 className="text-lg font-bold mb-4">Correct vs. Incorrect Over Time</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="correct" stroke="green" />
                                <Line type="monotone" dataKey="incorrect" stroke="red" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Previously Answered Questions</h3>
                <button
                    onClick={() => router.push("/previous-questions")}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    View Answered Questions
                </button>
            </div>
        </div>
    );
};

export default PerformancePage;
