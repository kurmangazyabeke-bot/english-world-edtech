'use client';

import React from 'react';
import { Award, Sparkles, CheckCircle2, Lock, Flame } from 'lucide-react';
import { ACHIEVEMENTS, ALL_WORDS } from '../../data/curriculum';
import { useProgress } from '../../lib/progress';
import { sounds } from '../../lib/soundEffects';

export default function AchievementsPage() {
  const { progress } = useProgress();

  const unlockedCount = ACHIEVEMENTS.filter((a) =>
    a.condition(progress, ALL_WORDS.length)
  ).length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase text-amber-800 bg-amber-50 px-3 py-1 rounded-full">
              Rewards & Trophies
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-indigo-deep">
            My Achievements
          </h1>
          <p className="text-xs font-semibold text-brand-muted mt-1">
            Earn badges, bonus XP, and celebrate your English milestones
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-[10px] font-bold text-amber-800 uppercase block">
              Unlocked Badges
            </span>
            <span className="font-display font-black text-xl text-amber-600">
              {unlockedCount} / {ACHIEVEMENTS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENTS.map((ach) => {
          const isUnlocked = ach.condition(progress, ALL_WORDS.length);

          return (
            <div
              key={ach.id}
              className={`rounded-3xl p-6 border transition-all duration-300 relative flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-amber-200 shadow-card hover:shadow-hover'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-100 to-yellow-200 text-amber-800'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? ach.icon : <Lock className="w-6 h-6 text-slate-400" />}
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-200 px-2.5 py-1 rounded-full">
                      Locked
                    </span>
                  )}
                </div>

                <h3 className="font-display font-black text-lg text-indigo-deep mb-1">
                  {ach.title}
                </h3>
                <p className="text-xs font-semibold text-brand-muted">
                  {ach.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>+{ach.rewardXp} XP Reward</span>
                </span>
                <span className="text-slate-400 uppercase text-[10px]">
                  {ach.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
