'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  Gamepad2,
  CheckCircle2,
  PlayCircle,
  GraduationCap,
} from 'lucide-react';
import { MODULES, ALL_WORDS } from '../data/curriculum';
import { ModuleCard } from '../components/ModuleCard';
import { useProgress } from '../lib/progress';
import { sounds } from '../lib/soundEffects';

export default function DashboardPage() {
  const { progress } = useProgress();
  const [selectedGrade, setSelectedGrade] = useState<'all' | 4 | 5>('all');

  const filteredModules =
    selectedGrade === 'all'
      ? MODULES
      : MODULES.filter((m) => m.grade === selectedGrade);

  const totalWords = ALL_WORDS.length; // 67
  const learnedCount = progress.learnedWordIds.length;
  const progressPercent = Math.round((learnedCount / totalWords) * 100);

  // Find next module to continue
  const nextModule =
    MODULES.find((m) => !progress.moduleProgress[m.id]?.completed) || MODULES[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ================= HERO SECTION ================= */}
      <div className="relative rounded-3xl sm:rounded-4xl bg-gradient-to-br from-indigo-900 via-indigo-deep to-indigo-800 text-white p-6 sm:p-10 overflow-hidden shadow-xl border border-indigo-700/50">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-brand-blue/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 rounded-full bg-brand-purple/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Let's learn English! • Grades 4–5 Curriculum</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight leading-tight">
              Your English Adventure <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-emerald-300">
                Starts Here!
              </span>
            </h1>

            <p className="text-sm sm:text-base font-medium text-slate-200 leading-relaxed">
              Learn new words, read stories and have fun! All 67 curriculum words with British & American audio, IPA transcriptions, Kazakh translations, and interactive games.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link
                href={`/modules/${nextModule.id}`}
                onClick={() => sounds.playClick()}
                className="px-6 py-3.5 rounded-2xl bg-brand-blue hover:bg-brand-blueHover text-white font-display font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-brand-blue/30 btn-bounce"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/words"
                onClick={() => sounds.playClick()}
                className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-display font-bold text-sm sm:text-base backdrop-blur-md border border-white/20 flex items-center gap-2 btn-bounce transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Dictionary (67)</span>
              </Link>
            </div>
          </div>

          {/* Gamified Hero Illustration Card */}
          <div className="w-full sm:w-auto bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/15 flex flex-col gap-4 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-amber-300 text-amber-400" />
                <span>Daily Streak</span>
              </span>
              <span className="text-xs font-black text-white">
                {progress.streakDays} {progress.streakDays === 1 ? 'day' : 'days'}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span>Words Mastered</span>
                <span>{learnedCount} / {totalWords} ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(5, progressPercent)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-white/10">
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-[10px] text-slate-300 font-semibold uppercase block">
                  XP Points
                </span>
                <span className="font-display font-black text-lg text-amber-300">
                  {progress.xp}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-white/5">
                <span className="text-[10px] text-slate-300 font-semibold uppercase block">
                  Completed
                </span>
                <span className="font-display font-black text-lg text-emerald-300">
                  {Object.values(progress.moduleProgress).filter((m) => m.completed).length} / 5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= GRADE FILTER SELECTOR ================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-indigo-deep tracking-tight">
            Learning Modules
          </h2>
          <p className="text-xs font-semibold text-brand-muted">
            Select a class or explore all available curriculum modules
          </p>
        </div>

        {/* Grade switch buttons */}
        <div className="flex items-center bg-white p-1.5 rounded-2xl border border-brand-border shadow-xs">
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedGrade('all');
            }}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm transition-all ${
              selectedGrade === 'all'
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-slate-600 hover:text-indigo-deep'
            }`}
          >
            All Modules (5)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedGrade(4);
            }}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm transition-all ${
              selectedGrade === 4
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-slate-600 hover:text-indigo-deep'
            }`}
          >
            Grade 4 (4 Modules)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedGrade(5);
            }}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs sm:text-sm transition-all ${
              selectedGrade === 5
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-slate-600 hover:text-indigo-deep'
            }`}
          >
            Grade 5 (Module 1)
          </button>
        </div>
      </div>

      {/* ================= MODULE CARDS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>

      {/* ================= QUICK ACTIVITY SHORTCUTS ================= */}
      <div className="pt-4">
        <h3 className="font-display font-extrabold text-xl text-indigo-deep mb-4">
          Quick Learning Activities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/words"
            onClick={() => sounds.playClick()}
            className="group p-5 rounded-3xl bg-white border border-brand-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-black text-base text-indigo-deep group-hover:text-brand-blue transition-colors">
                New Words
              </h4>
              <p className="text-xs font-semibold text-brand-muted">
                Search, filter & review all 67 words
              </p>
            </div>
          </Link>

          <Link
            href="/practice"
            onClick={() => sounds.playClick()}
            className="group p-5 rounded-3xl bg-white border border-brand-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-brand-purple flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-black text-base text-indigo-deep group-hover:text-brand-purple transition-colors">
                Practice Games
              </h4>
              <p className="text-xs font-semibold text-brand-muted">
                Match words, listen, spell & quiz
              </p>
            </div>
          </Link>

          <Link
            href="/achievements"
            onClick={() => sounds.playClick()}
            className="group p-5 rounded-3xl bg-white border border-brand-border shadow-card hover:shadow-hover hover:-translate-y-1 transition-all flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-black text-base text-indigo-deep group-hover:text-amber-600 transition-colors">
                Achievements
              </h4>
              <p className="text-xs font-semibold text-brand-muted">
                Unlock badges and track learning ranks
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
