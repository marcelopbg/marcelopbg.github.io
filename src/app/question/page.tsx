"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { toastErrorDefault, toastSuccessDefault } from "../common/toast-default-option";
import { useRouter } from "next/navigation";
import { useLoading } from "../context/LoadingContext";
import LimitExceededModal from "../components/LimitExceededModal";

// Define the options for the exam selector
const examOptions = [
  { value: 'Associate', label: 'Associate' },
  { value: 'AI Associate', label: 'AI Associate' },
  { value: 'Administrator', label: 'Administrator' },
  { value: 'Advanced Administrator', label: 'Advanced Administrator' },
  { value: 'Platform Developer I', label: 'Platform Developer I' },
  { value: 'Platform Developer II', label: 'Platform Developer II' },
];

interface Choice {
  choiceText: string;
  choiceLetter: string;
}

interface QuestionResponse {
  id: number;
  topic: string;
  exam: string;
  questionStem: string;
  choices: Choice[];
  isMultipleChoice: boolean;
  correctAnswers: string[];
  answerExplanation: string;
}

interface PerformanceResponse {
  correctAnswers: QuestionResponse[];
  incorrectAnswers: QuestionResponse[];
}

const QuestionPage: React.FC = () => {
  const [questionData, setQuestionData] = useState<QuestionResponse | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [wasQuestionSubmitted, setWasQuestionSubmitted] = useState<boolean>(false);
  const [performance, setPerformance] = useState<PerformanceResponse | null>(null);
  const [selectedExams, setSelectedExams] = useState<{ value: string; label: string }[]>([]);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState<boolean>(false);

  const closeLimitModal = () => {
    setIsLimitModalOpen(false);
  }

  const { showLoading, hideLoading, isLoading } = useLoading();
  const loadingAnswer = isLoading;
  const router = useRouter();

  const fetchPerformance = async () => {
    const token = localStorage.getItem("exam-prep-tk");

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/performance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data: PerformanceResponse = await response.json();
    setPerformance(data);

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("exam-prep-tk");
        router.push('/login')
        toast.error("Session expired. Please login again", toastErrorDefault);
        return;
      }
      toast.error("Failed to load performance data", toastErrorDefault);
    }
  };

  useEffect(() => {
    fetchPerformance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateQuestion = async () => {
    showLoading();
    setShowResult(false);
    setWasQuestionSubmitted(false);
    setSelectedAnswers([]);
    setIsCorrect(null);

    const token = localStorage.getItem("exam-prep-tk");

    // try {
    // Get the selected exams' values to pass in the request body
    const selectedExamValues = selectedExams.map((exam) => exam.value);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question`, {
      method: "POST", // Use POST method instead of GET
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ exams: selectedExamValues }), // Include the selected exams in the request body
    });

    if (response.status === 422) {
      hideLoading();
      const errorData = await response.json();
      // console.log(errorData)
      if (errorData.message === 'Questions limit exceeded. Please try again tomorrow.') {
        setIsLimitModalOpen(true);
        return;
      }
    }
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to fetch question", errorData);
      toast.error("Failed to generate a new question", toastErrorDefault);
      hideLoading();
      return;
    }
    const data: QuestionResponse = await response.json();
    setQuestionData(data);
    hideLoading();
  };

  const handleAnswerChange = (choice: string) => {
    if (questionData?.isMultipleChoice) {
      setSelectedAnswers((prev) =>
        prev.includes(choice) ? prev.filter((ans) => ans !== choice) : [...prev, choice]
      );
    } else {
      setSelectedAnswers([choice]);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!questionData || loadingAnswer) return;

    showLoading();
    const token = localStorage.getItem("exam-prep-tk");

    const correct =
      selectedAnswers.every((ans) => questionData.correctAnswers.includes(ans)) &&
      selectedAnswers.length === questionData.correctAnswers.length;

    setIsCorrect(correct);
    setShowResult(true);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ questionNumber: questionData.id, chosenOptions: selectedAnswers }),
      });
      setWasQuestionSubmitted(true);
      toast.success("Answer submitted successfully!", toastSuccessDefault);
      await fetchPerformance();
    } catch (error) {
      console.error("Failed to submit answer", error);
      toast.error("Failed to submit answer", toastErrorDefault);
    } finally {
      hideLoading();
    }
  };

  // if(isLimitModalOpen) {
  //   return <LimitExceededModal isOpen={isLimitModalOpen} onClose={closeLimitModal}></LimitExceededModal>
  // } else

  return (

    <div className="flex flex-col items-center h-92 bg-gray-100 pt-5">
      {isLimitModalOpen && (
        <LimitExceededModal isOpen={isLimitModalOpen} onClose={closeLimitModal}></LimitExceededModal>
      )}
      {/* Sleek Dashboard Performance Card */}
      {performance && (performance.correctAnswers && performance.incorrectAnswers) && (
        <div className="w-full max-w-2xl mb-6 p-6 bg-white rounded-xl shadow-md flex justify-between items-center space-x-4">
          <div className="w-1/2 p-4 text-center">
            <p className="text-sm font-semibold text-gray-500 uppercase">Correct Answers</p>
            <p className="mt-1 text-3xl font-bold text-green-600">{performance.correctAnswers.length}</p>
          </div>
          <div className="w-px h-16 bg-gray-300"></div>
          <div className="w-1/2 p-4 text-center">
            <p className="text-sm font-semibold text-gray-500 uppercase">Incorrect Answers</p>
            <p className="mt-1 text-3xl font-bold text-red-600">{performance.incorrectAnswers.length}</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4"> Choose the Exam: </h3>
        <Select
          options={examOptions}
          // isMulti
          required={true}
          value={selectedExams[0]}
          onChange={(selectedOptions) => setSelectedExams([selectedOptions as { value: string; label: string }])}
          // onChange={(selectedOptions) => setSelectedExams(selectedOptions as { value: string; label: string }[])}

          placeholder="Choose the exam(s) you are currently studying for!"
          className="mb-4"
          name="Select exams"
        >
        </Select>

        {!questionData ? (
          <button
            onClick={handleGenerateQuestion}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Generate Mock Question
          </button>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-900 mb-4"> {questionData.exam} </h3>
            <p className="text-lg mb-6">{questionData.questionStem}</p>
            <form className="space-y-4">
              {questionData?.choices?.map((choice, index) => (
                <div key={index}>
                  <label className="inline-flex items-center">
                    <input
                      type={questionData.isMultipleChoice ? "checkbox" : "radio"}
                      name="answer"
                      value={choice.choiceLetter}
                      checked={selectedAnswers.includes(choice.choiceLetter)}
                      onChange={() => handleAnswerChange(choice.choiceLetter)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{choice.choiceText}</span>
                  </label>
                </div>
              ))}
            </form>
            <button
              onClick={handleSubmitAnswer}
              disabled={loadingAnswer || selectedAnswers.length === 0 || wasQuestionSubmitted}
              className={`mt-6 w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 ${loadingAnswer || selectedAnswers.length === 0 || wasQuestionSubmitted
                ? "opacity-50 cursor-not-allowed"
                : ""
                }`}
            >
              {loadingAnswer ? "Submitting..." : "Submit Answer"}
            </button>

            <button
              onClick={handleGenerateQuestion}
              className="mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Request New Question
            </button>
          </>
        )}

        {showResult && (
          <div className="mt-6">
            <h3 className={`text-lg font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "Correct!" : "Incorrect!"}
            </h3>
            <p className="mt-2 text-gray-700">{questionData?.answerExplanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;
