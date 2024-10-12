export interface Choice {
  id: number;
  choiceLetter: string;
  choiceText: string;
  questionId: number;
}

export interface QuestionResponse {
    createdDate: Date;
    id: number;
    topic: string;
    exam: string;
    questionStem: string;
    choices: Choice[];
    isMultipleChoice: boolean;
    correctAnswers: string[];
    answerExplanation: string;
    answer: string[];
}

export interface PerformanceResponse {
    correctAnswers: QuestionResponse[];
    incorrectAnswers: QuestionResponse[];
}
