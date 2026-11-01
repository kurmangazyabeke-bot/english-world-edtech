'use client';

import React from 'react';
import Link from 'next/link';
import {
  Utensils,
  PawPrint,
  Compass,
  Globe,
  Home,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { ModuleData } from '../types';
import { useProgress } from '../lib/progress';
import { sounds } from '../lib/soundEffects';

const ICON_MAP: Record<string, React.ElementType> = {
  Utensils,
  PawPrint,
  Compass,
  Globe,
  Home,
};

export function ModuleCard({ module }: { module: ModuleData }) {
  const { progress } = useProgress();
  const Icon = ICON_MAP[module.iconName] || BookOpen;

  const modProg = progress.moduleProgress[module.id];
  const isCompleted = modProg?.completed;
  const quizScore = modProg?.quizScore;
  const bestPercentage = modProg?.quizBestPercentage;

  // Count learned words in this module
  const moduleWordIds = module.wordGroups.flatMap((g) => g.words.map((w) => w.id));
  const learnedInModule = moduleWordIds.filter((id) =>
    progress.learnedWordIds.includes(id)
  ).length;
  const wordProgressPercent = Math.round(
    (learnedInModule / module.wordsCount) * 100
  );

  return (
    <div className="group bg-white rounded-3xl p-6 border border-brand-border/90 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Top decorative gradient bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${module.gradient}`}
      />

      <div>
        {/* Header tags */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-black uppercase px-3 py-1 rounded-full text-white shadow-xs"
              style={{ backgroundColor: module.color }}
            >
              Grade {module.grade}
            </span>
            <span className="text-xs font-bold text-brand-muted bg-slate-100 px-2.5 py-1 rounded-full">
              {module.moduleNumber === 1 && module.grade === 5
                ? 'Module 1'
                : `Module ${module.moduleNumber}`}
            </span>
          </div>

          {isCompleted && (
            <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </span>
          )}
        </div>

        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-3">
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform`}
          >
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-indigo-deep group-hover:text-brand-blue transition-colors">
              {module.displayTitle}
            </h3>
            <p className="text-xs font-medium text-brand-muted line-clamp-2 mt-1">
              {module.subtitle}
            </p>
          </div>
        </div>

        {/* Features badges */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-2 text-xs font-semibold text-indigo-deep">
            <BookOpen className="w-4 h-4 text-brand-blue" />
            <span>{module.wordsCount} New Words</span>
          </div>
          <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-2 text-xs font-semibold text-indigo-deep">
            <Volume2 className="w-4 h-4 text-brand-purple" />
            <span>Story & Audio</span>
          </div>
        </div>

        {/* Learning progress bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-brand-muted">Word Mastery</span>
            <span className="text-indigo-deep font-extrabold">
              {learnedInModule} / {module.wordsCount} ({wordProgressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${module.gradient}`}
              style={{ width: `${Math.max(5, wordProgressPercent)}%` }}
            />
          </div>
        </div>

        {bestPercentage !== undefined && (
          <div className="flex items-center justify-between text-xs font-bold bg-amber-50/80 border border-amber-200/80 rounded-xl px-3 py-2 mb-4 text-amber-900">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quiz Best Score:</span>
            </span>
            <span className="font-black text-amber-600">{bestPercentage}%</span>
          </div>
        )}
      </div>

      {/* Button link */}
      <Link
        href={`/modules/${module.id}`}
        onClick={() => sounds.playClick()}
        className="w-full py-3.5 px-4 rounded-2xl bg-brand-blue hover:bg-brand-blueHover text-white font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-brand-blue/20 btn-bounce mt-2 group/btn"
      >
        <span>Explore Module</span>
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
