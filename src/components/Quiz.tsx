import React, { useRef, useState } from 'react'
import './Quiz.css'
import QuizCore from '../core/QuizCore';

interface QuizState {
  currentQuestion: ReturnType<QuizCore['getCurrentQuestion']>
  selectedAnswer: string | null
  isCompleted: boolean
  finalScore: number
}

const Quiz: React.FC = () => {
  // Task 1
  const quizCoreRef = useRef<QuizCore>(new QuizCore());
  const quizCore = quizCoreRef.current;

  const [state, setState] = useState<QuizState>({
    currentQuestion: quizCore.getCurrentQuestion(),
    selectedAnswer: null,
    isCompleted: false,
    finalScore: 0,
  });

  const handleOptionSelect = (option: string): void => {
    setState((prevState) => ({ ...prevState, selectedAnswer: option }));
  };


  const handleButtonClick = (): void => {
    const { currentQuestion, selectedAnswer, isCompleted } = state;

    if (!currentQuestion || isCompleted) return;

    if (selectedAnswer !== null) {
      quizCore.answerQuestion(selectedAnswer);
    }

    if (quizCore.hasNextQuestion()) {
      quizCore.nextQuestion();
      setState((prevState) => ({
        ...prevState,
        currentQuestion: quizCore.getCurrentQuestion(),
        selectedAnswer: null,
      }));
      return;
    }

    setState((prevState) => ({
      ...prevState,
      isCompleted: true,
      finalScore: quizCore.getScore(),
      currentQuestion: null,
      selectedAnswer: null,
    }));
  };

  const { currentQuestion, selectedAnswer, isCompleted, finalScore } = state;
  const totalQuestions = quizCore.getTotalQuestions();

  if (isCompleted) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {finalScore} out of {totalQuestions}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Quiz Question:</h2>
      <p>{currentQuestion?.question}</p>
    
      <h3>Answer Options:</h3>
      <ul>
        {currentQuestion?.options.map((option) => (
          <li
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={selectedAnswer === option ? 'selected' : ''}
          >
            {option}
          </li>
        ))}
      </ul>

      <h3>Selected Answer:</h3>
      <p>{selectedAnswer ?? 'No answer selected'}</p>

      <button onClick={handleButtonClick}>
        {quizCore.hasNextQuestion() ? 'Next Question' : 'Submit'}
      </button>
    </div>
  );
};

export default Quiz;