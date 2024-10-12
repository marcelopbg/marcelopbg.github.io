"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { usePerformance } from "../context/PerformanceContext";
import { PerformanceResponse, QuestionResponse } from "../interfaces/interfaces";

const PreviouslyAnsweredQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionResponse[]>([]);
  const router = useRouter();
  const { getPerformance } = usePerformance();

  const fetchPreviouslyAnsweredQuestions = async () => {
    const data : PerformanceResponse | null = await getPerformance();
    const allQuestions = [...data!.correctAnswers, ...data!.incorrectAnswers].sort(
      (a, b) => b.id - a.id
    );
    setQuestions(allQuestions);
  };

  useEffect(() => {
    fetchPreviouslyAnsweredQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100 pt-2">
      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Previously Answered Questions</h2>
        {questions.length === 0 ? (
          <p>No previously answered questions found.</p>
        ) : (
          questions.map((question) => (
            <div key={question.id} className="relative mb-4 p-4 border rounded-md">
              {/* Date displayed in the top right corner */}
              <p className="md:absolute top-2 right-4 text-gray-500 text-sm">
                {new Date(question.createdDate).toLocaleString()}
              </p>

              <h3 className="font-semibold">{question.exam}</h3>
              <p className="mb-2">{question.questionStem}</p>

              <ul className="mt-2">
                {question.choices.map((choice) => {
                  // Check if the choice is correct
                  const isCorrect = question.correctAnswers?.includes(choice.choiceLetter);

                  return (
                    <li
                      key={choice.id}
                      className={`py-1 px-2 rounded-md ${
                        isCorrect
                          ? 'bg-green-100 text-green-600' // Highlight correct answers
                          : 'bg-gray-100'
                      }`}
                    >
                      {choice.choiceLetter}: {choice.choiceText}
                    </li>
                  );
                })}
              </ul>

              {/* Display if the user's answer was correct or not */}
              <p className={`font-semibold ${question.correctAnswers?.sort().toString() === question.answer?.sort().toString() ? 'text-green-600' : 'text-red-600'}`}>
                Your Answer: {question.answer?.join(', ')}
              </p>
            </div>
          ))
        )}
        <button
          onClick={() => router.push('/performance')}
          className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Performance
        </button>
      </div>
    </div>
  );
};

export default PreviouslyAnsweredQuestionsPage;
