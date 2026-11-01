'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  BookOpen,
  Award,
  BarChart3,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  GraduationCap,
  ShieldCheck,
  Gamepad2,
} from 'lucide-react';
import { useProgress } from '../lib/progress';
import { sounds } from '../lib/soundEffects';

export function Navigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { progress } = useProgress();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
    if (next) sounds.playClick();
  };

  const navItems = [
    { href: '/', label: 'Learn', icon: Compass },
    { href: '/words', label: 'New Words', icon: BookOpen },
    { href: '/practice', label: 'Practice', icon: Gamepad2 },
    { href: '/progress', label: 'My Progress', icon: BarChart3 },
    { href: '/achievements', label: 'Achievements', icon: Award },
    { href: '/teacher', label: 'Teacher Zone', icon: ShieldCheck, badge: 'Audit' },
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row text-brand-text">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-brand-border/80 p-5 sticky top-0 h-screen justify-between z-30 shadow-soft">
        <div>
          {/* Logo & Brand */}
          <Link
            href="/"
            onClick={() => sounds.playClick()}
            className="flex items-center gap-3 px-2 py-2 mb-8 group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white shadow-hover group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display font-extrabold text-xl text-indigo-deep tracking-tight">
                English<span className="text-brand-blue">World</span>
              </div>
              <div className="text-xs font-semibold text-brand-muted tracking-wider uppercase">
                Grades 4–5
              </div>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => sounds.playClick()}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl font-display font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/25 scale-[1.02]'
                      : 'text-indigo-deep/75 hover:bg-slate-50 hover:text-indigo-deep hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-brand-blue'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Stats & Audio Toggle */}
        <div className="pt-4 border-t border-brand-border space-y-3">
          {/* Audio toggle button */}
          <button
            onClick={toggleSound}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-indigo-deep/80 transition-colors"
            title="Toggle game sound effects"
          >
            <span className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-brand-greenDark" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <span>Sound Effects</span>
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                soundEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* User mini stats card */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-purple-50/70 rounded-2xl p-3 border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-deep flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-brand-coral fill-brand-coral" />
                <span>Streak</span>
              </span>
              <span className="text-xs font-extrabold text-brand-coral">
                {progress.streakDays} {progress.streakDays === 1 ? 'day' : 'days'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-deep flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>XP Total</span>
              </span>
              <span className="text-xs font-extrabold text-amber-600">
                {progress.xp} XP
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Top Header */}
        <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-brand-border/70 z-20 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-blue text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-display font-extrabold text-lg text-indigo-deep">
                English<span className="text-brand-blue">World</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-brand-muted">
              <span>Grade 4–5 Interactive English Platform</span>
              <span className="text-slate-300">•</span>
              <span className="text-brand-greenDark font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                Doc Content Loaded (67 Words)
              </span>
            </div>
          </div>

          {/* Quick Header Indicators */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black shadow-xs"
              title="Daily learning streak"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{progress.streakDays}</span>
            </div>

            {/* XP Badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-amber-900 text-xs font-black shadow-xs"
              title="Earned experience points"
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{progress.xp} XP</span>
            </div>

            {/* Words Mastered */}
            <Link
              href="/words"
              onClick={() => sounds.playClick()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-brand-blue text-xs font-bold hover:bg-blue-100 transition-colors shadow-xs"
              title="Learned words"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>
                {progress.learnedWordIds.length}/67
              </span>
            </Link>

            {/* Mobile Sound toggle */}
            <button
              onClick={toggleSound}
              className="md:hidden p-2 rounded-full bg-slate-100 text-indigo-deep"
              title="Toggle sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-brand-greenDark" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        </header>

        {/* Content Children */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-brand-border px-2 py-1.5 flex items-center justify-around z-30 shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => sounds.playClick()}
              className={`flex flex-col items-center py-1 px-2 rounded-xl transition-transform active:scale-90 ${
                isActive ? 'text-brand-blue' : 'text-slate-400 hover:text-indigo-deep'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-blue-50 text-brand-blue' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold font-display mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
