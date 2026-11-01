'use client';

import React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Sparkles,
  Flame,
  BookOpen,
  Trophy,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Clock,
  Award,
} from 'lucide-react';
import { ALL_WORDS, MODULES, ACHIEVEMENTS } from '../../data/curriculum';
import { useProgress } from '../../lib/progress';
import { sounds } from '../../lib/soundEffects';

export default function ProgressPage() {
  const { progress, resetAllProgress, toggleWordLearned } = useProgress();

  const totalWords = ALL_WORDS.length; // 67
  const learnedCount = progress.learnedWordIds.length;
  const learnedPercent = Math.round((learnedCount / totalWords) * 100);

  const completedModulesCount = Object.values(progress.moduleProgress).filter(
    (m) => m.completed
  ).length;

  const mistakeWords = ALL_WORDS.filter((w) =>
    progress.mistakeWordIds.includes(w.id)
  );

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all learning progress?')) {
      resetAllProgress();
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase text-brand-blue bg-blue-50 px-3 py-1 rounded-full">
              Student Statistics
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-indigo-deep">
            My Learning Progress
          </h1>
          <p className="text-xs font-semibold text-brand-muted mt-1">
            Track your learned words, test achievements, streaks, and review words
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Progress</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* XP Points */}
        <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block">
              Experience Points
            </span>
            <span className="font-display font-black text-2xl text-indigo-deep">
              {progress.xp} XP
            </span>
          </div>
        </div>

        {/* Daily Streak */}
        <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
            <Flame className="w-6 h-6 fill-orange-400" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block">
              Daily Streak
            </span>
            <span className="font-display font-black text-2xl text-indigo-deep">
              {progress.streakDays} {progress.streakDays === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>

        {/* Mastered Words */}
        <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block">
              Words Mastered
            </span>
            <span className="font-display font-black text-2xl text-indigo-deep">
              {learnedCount} / {totalWords}
            </span>
          </div>
        </div>

        {/* Modules Completed */}
        <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block">
              Modules Passed
            </span>
            <span className="font-display font-black text-2xl text-indigo-deep">
              {completedModulesCount} / 5
            </span>
          </div>
        </div>
      </div>

      {/* Modules Breakdown Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-4">
        <h3 className="font-display font-black text-xl text-indigo-deep">
          Progress by Curriculum Module
        </h3>

        <div className="divide-y divide-slate-100">
          {MODULES.map((mod) => {
            const modProg = progress.moduleProgress[mod.id];
            const modWords = mod.wordGroups.flatMap((g) => g.words);
            const modLearned = modWords.filter((w) =>
              progress.learnedWordIds.includes(w.id)
            ).length;
            const percent = Math.round((modLearned / mod.wordsCount) * 100);

            return (
              <div
                key={mod.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: mod.color }}
                    />
                    <span className="font-display font-black text-base text-indigo-deep">
                      {mod.title}
                    </span>
                    {modProg?.completed && (
                      <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Passed
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-slate-400">
                    Grade {mod.grade} • {mod.wordsCount} words • Story: "{mod.reading.title}"
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-indigo-deep">
                      {modLearned} / {mod.wordsCount} words ({percent}%)
                    </div>
                    {modProg?.quizBestPercentage !== undefined && (
                      <div className="text-[11px] font-bold text-amber-600">
                        Best Quiz: {modProg.quizBestPercentage}%
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/modules/${mod.id}`}
                    onClick={() => sounds.playClick()}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-brand-blue hover:text-white text-indigo-deep transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Words to Review (Mistakes) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-black text-xl text-indigo-deep">
              Words for Revision & Practice
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {mistakeWords.length} words
          </span>
        </div>

        {mistakeWords.length === 0 ? (
          <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-center text-xs font-bold text-emerald-800">
            ✨ Great job! You have no pending mistakes to review. Keep up the high accuracy!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {mistakeWords.map((word) => (
              <div
                key={word.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{word.emoji}</span>
                  <div>
                    <div className="font-bold text-indigo-deep">{word.english}</div>
                    <div className="text-[11px] text-slate-500">{word.kazakh}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sounds.playCorrect();
                    toggleWordLearned(word.id);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-bold text-[11px]"
                >
                  Mastered
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
