//this is the main file for the application 

import React, { useState } from 'react';
import {fetchQuizQuestions} from './API';

//Components 
import QuestionCard from './components/QuestionCard';
//types
import{ QuestionState, Difficulty } from './API';
//Styles
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnser: string;
}

const TOTAL_QUESTIIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumner] = useState(0);
  const [userAnswers, setUserAnswers] =useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);


  const startTrivia = async () =>{
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumner(0);
    setLoading(false);

  };

  const checkAnser = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      //users answer
      const answer = e.currentTarget.value;
      //Check answer against the correct answer
      const correct = questions[number].correct_answer === answer;
      if(correct)setScore(prev => prev +1);
      //save anser in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnser: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    // Move on to the next question if not the last question
    const nextQ = number + 1;

    if (nextQ === TOTAL_QUESTIIONS) {
      setGameOver(true);
    } else {
      setNumner(nextQ);
    }
  };


  return (
    <>
    <GlobalStyle/>
      <Wrapper>
    <h1>REACT QUIZ</h1>
    {gameOver || userAnswers.length === TOTAL_QUESTIIONS ? (
    <button className="start" onClick={startTrivia}>
      Start
    </button>
    ) :null }
    {!gameOver ? <p className="score">Score: {score} </p> : null }
    {loading ? <p> Loading Questions ... </p> : null}
    {!loading && !gameOver && (
    <QuestionCard 
      questionNr= {number + 1}
      totalQuestions = {TOTAL_QUESTIIONS}
      question = {questions[number].question}
      answers = {questions[number].answers}
      userAnswer = {userAnswers ? userAnswers[number] : undefined}
      callback = {checkAnser}
    />
    )}
    {!gameOver && !loading && userAnswers.length === number+1 && number !== TOTAL_QUESTIIONS - 1 ? (
    <button className ="next" onClick={nextQuestion}>
      nextQuestion
    </button>

  ) : null}
    </Wrapper>
    </>
  );
}

export default App;
