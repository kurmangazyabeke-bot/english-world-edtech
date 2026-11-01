'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCw,
  ArrowRight,
  Sparkles,
  Volume2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { QuizQuestion, ModuleData } from '../types';
import { speech } from '../lib/speech';
import { sounds } from '../lib/soundEffects';
import { useProgress } from '../lib/progress';

export function ModuleQuiz({ module }: { module: ModuleData }) {
  const { saveQuizCompletion, addMistakeWord, removeMistakeWord } = useProgress();

  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [userHistory, setUserHistory] = useState<
    {
      question: QuizQuestion;
      selected: string | number;
      isCorrect: boolean;
    }[]
  >([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Initialize and shuffle questions
  const initQuiz = () => {
    const questions = [...module.quiz].map((q) => {
      // Shuffle options if array
      const shuffledOptions = q.options ? [...q.options].sort(() => Math.random() - 0.5) : [];
      return {
        ...q,
        options: shuffledOptions,
      };
    }).sort(() => Math.random() - 0.5);

    setShuffledQuestions(questions);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setScore(0);
    setUserHistory([]);
    setIsCompleted(false);
    setIsReviewMode(false);
  };

  useEffect(() => {
    initQuiz();
  }, [module]);

  const currentQ = shuffledQuestions[currentIdx];

  const handleSelectOption = (opt: string | number) => {
    if (isAnswerChecked) return;
    sounds.playClick();
    setSelectedAnswer(opt);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null || !currentQ) return;
    setIsAnswerChecked(true);

    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    if (isCorrect) {
      sounds.playCorrect();
      setScore((s) => s + 1);
      if (currentQ.sourceWordId) {
        removeMistakeWord(currentQ.sourceWordId);
      }
    } else {
      sounds.playWrong();
      if (currentQ.sourceWordId) {
        addMistakeWord(currentQ.sourceWordId);
      }
    }

    setUserHistory((prev) => [
      ...prev,
      {
        question: currentQ,
        selected: selectedAnswer,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentIdx < shuffledQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsCompleted(true);
    const finalScore = score + (selectedAnswer === currentQ.correctAnswer ? 1 : 0);
    const percentage = Math.round((finalScore / shuffledQuestions.length) * 100);

    // Confetti celebration if passed (>70%)
    if (percentage >= 70) {
      sounds.playCelebration();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    } else {
      sounds.playCorrect();
    }

    const xpEarned = finalScore * 10 + (percentage >= 80 ? 50 : 20);
    saveQuizCompletion(module.id, finalScore, shuffledQuestions.length, xpEarned);
  };

  if (!currentQ && !isCompleted) return null;

  // COMPLETED SUMMARY SCREEN
  if (isCompleted) {
    const percentage = Math.round((score / shuffledQuestions.length) * 100);
    const passed = percentage >= 70;
    const mistakes = userHistory.filter((h) => !h.isCorrect);

    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-card max-w-2xl mx-auto text-center">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 ${
            passed ? 'bg-amber-100 text-amber-700 animate-bounce' : 'bg-rose-100 text-rose-700'
          }`}
        >
          {passed ? '🏆' : '💪'}
        </div>

        <h3 className="font-display font-black text-2xl sm:text-3xl text-indigo-deep mb-2">
          {passed ? 'Congratulations! Quiz Passed!' : 'Good Effort! Keep Practicing!'}
        </h3>

        <p className="text-xs sm:text-sm font-semibold text-brand-muted mb-6">
          You answered {score} out of {shuffledQuestions.length} questions correctly.
        </p>

        {/* Big percentage & XP pill */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="px-5 py-3 rounded-2xl bg-blue-50 border border-blue-200 text-center">
            <span className="text-xs font-bold text-slate-500 uppercase block">Score</span>
            <span className="font-display font-black text-2xl sm:text-3xl text-brand-blue">
              {percentage}%
            </span>
          </div>

          <div className="px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs font-bold text-amber-800 uppercase block">XP Earned</span>
            <span className="font-display font-black text-2xl sm:text-3xl text-amber-600 flex items-center gap-1 justify-center">
              <Sparkles className="w-5 h-5" />
              +{score * 10 + (passed ? 50 : 20)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={initQuiz}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-blue text-white font-display font-black text-sm flex items-center justify-center gap-2 hover:bg-brand-blueHover shadow-md btn-bounce"
          >
            <RotateCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          {mistakes.length > 0 && (
            <button
              onClick={() => {
                sounds.playClick();
                setIsReviewMode(!isReviewMode);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-indigo-deep font-display font-black text-sm flex items-center justify-center gap-2 btn-bounce"
            >
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{isReviewMode ? 'Hide Review' : `Review Mistakes (${mistakes.length})`}</span>
            </button>
          )}
        </div>

        {/* Review Mistakes Section */}
        {isReviewMode && mistakes.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-100 text-left space-y-4">
            <h4 className="font-display font-black text-lg text-indigo-deep mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span>Questions to Review</span>
            </h4>

            {mistakes.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs text-rose-900"
              >
                <div className="font-bold text-sm mb-1">{m.question.question}</div>
                <div className="text-slate-600 mb-1">
                  Your answer: <span className="text-rose-700 font-bold line-through">{String(m.selected)}</span>
                </div>
                <div className="text-emerald-700 font-bold mb-1">
                  Correct answer: {String(m.question.correctAnswer)}
                </div>
                <div className="text-slate-500 italic mt-1">
                  Note: {m.question.explanation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ACTIVE QUIZ QUESTION SCREEN
  const progressPercent = Math.round(((currentIdx + 1) / shuffledQuestions.length) * 100);
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card max-w-2xl mx-auto">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-full">
          Question {currentIdx + 1} of {shuffledQuestions.length}
        </span>
        <span className="text-xs font-extrabold text-amber-600 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Score: {score}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
        <div
          className="bg-brand-blue h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Text */}
      <div className="my-6">
        <h4 className="font-display font-black text-xl sm:text-2xl text-indigo-deep leading-snug">
          {currentQ.question}
        </h4>
        {currentQ.type === 'listening' && (
          <button
            onClick={() => currentQ.audioWord && speech.speak(currentQ.audioWord)}
            className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-brand-purple hover:bg-purple-100 font-bold text-xs"
          >
            <Volume2 className="w-4 h-4" />
            <span>Replay Audio</span>
          </button>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3 my-6">
        {currentQ.options?.map((option, idx) => {
          let btnStyle =
            'bg-slate-50/80 border-slate-200 text-slate-800 hover:border-brand-blue hover:bg-blue-50/40';

          if (selectedAnswer === option) {
            btnStyle = 'bg-brand-blue text-white border-brand-blue shadow-sm';
          }

          if (isAnswerChecked) {
            if (option === currentQ.correctAnswer) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-500 font-bold shadow-sm';
            } else if (selectedAnswer === option && !isCorrect) {
              btnStyle = 'bg-rose-500 text-white border-rose-500';
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswerChecked}
              onClick={() => handleSelectOption(option)}
              className={`w-full p-4 rounded-2xl border text-left font-display font-bold text-sm sm:text-base transition-all flex items-center justify-between ${btnStyle}`}
            >
              <span>{option}</span>
              {isAnswerChecked && option === currentQ.correctAnswer && (
                <CheckCircle2 className="w-5 h-5 text-white" />
              )}
              {isAnswerChecked && selectedAnswer === option && !isCorrect && (
                <XCircle className="w-5 h-5 text-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Banner */}
      {isAnswerChecked && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold mb-6 flex items-start gap-2.5 ${
            isCorrect
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-black block mb-0.5">
              {isCorrect ? 'Correct! +10 XP' : 'Incorrect!'}
            </span>
            <p>{currentQ.explanation}</p>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
        {!isAnswerChecked ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedAnswer === null}
            className="px-6 py-3 rounded-2xl bg-brand-blue text-white font-display font-black text-sm hover:bg-brand-blueHover disabled:opacity-40 disabled:cursor-not-allowed shadow-md btn-bounce"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-6 py-3 rounded-2xl bg-brand-blue text-white font-display font-black text-sm flex items-center gap-2 hover:bg-brand-blueHover shadow-md btn-bounce"
          >
            <span>{currentIdx === shuffledQuestions.length - 1 ? 'See Results' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
