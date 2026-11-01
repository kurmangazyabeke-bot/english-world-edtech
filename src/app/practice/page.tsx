'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  Sparkles,
  Shuffle,
  Volume2,
  HelpCircle,
  AlertCircle,
  RotateCw,
  Radio,
  FileAudio,
} from 'lucide-react';
import { ALL_WORDS, MODULES } from '../../data/curriculum';
import {
  MatchTheWordsGame,
  ChooseTheAnswerGame,
  ListenAndChooseGame,
  SpellTheWordGame,
} from '../../components/PracticeGames';
import { AudioPlayer } from '../../components/AudioPlayer';
import { useProgress } from '../../lib/progress';
import { sounds } from '../../lib/soundEffects';

export default function PracticePage() {
  const { progress } = useProgress();
  const [selectedModuleId, setSelectedModuleId] = useState<string>('all');
  const [activeGame, setActiveGame] = useState<'match' | 'choose' | 'listen' | 'spell' | 'audio'>('match');
  const [onlyMistakes, setOnlyMistakes] = useState(false);

  // Pool of words to practice
  let pool = ALL_WORDS;
  if (selectedModuleId !== 'all') {
    pool = pool.filter((w) => w.moduleId === selectedModuleId);
  }
  if (onlyMistakes) {
    const mistakePool = pool.filter((w) => progress.mistakeWordIds.includes(w.id));
    if (mistakePool.length > 0) {
      pool = mistakePool;
    }
  }

  // All audio tracks for the selected module or all modules
  const allAudioTracks = (
    selectedModuleId === 'all'
      ? MODULES.flatMap((m) => m.audioTracks || [])
      : MODULES.find((m) => m.id === selectedModuleId)?.audioTracks || []
  );

  const mistakeCount = progress.mistakeWordIds.length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase text-brand-purple bg-purple-50 px-3 py-1 rounded-full">
              Gamified Practice Arena
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-indigo-deep">
            Interactive Practice
          </h1>
          <p className="text-xs font-semibold text-brand-muted mt-1">
            Train your vocabulary memory through games: matching, listening, multiple choice and spelling
          </p>
        </div>

        {/* Word pool selector */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedModuleId}
            onChange={(e) => {
              sounds.playClick();
              setSelectedModuleId(e.target.value);
            }}
            className="px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-extrabold text-indigo-deep focus:outline-none"
          >
            <option value="all">All Modules (67 words)</option>
            {MODULES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>

          {mistakeCount > 0 && (
            <button
              onClick={() => {
                sounds.playClick();
                setOnlyMistakes(!onlyMistakes);
              }}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-colors ${
                onlyMistakes
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Review Mistakes ({mistakeCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => {
            sounds.playClick();
            setActiveGame('match');
          }}
          className={`p-4 rounded-3xl border text-left transition-all ${
            activeGame === 'match'
              ? 'bg-brand-blue text-white border-brand-blue shadow-hover scale-102'
              : 'bg-white border-brand-border text-indigo-deep hover:bg-slate-50'
          }`}
        >
          <Shuffle className="w-6 h-6 mb-2" />
          <div className="font-display font-black text-sm sm:text-base">Match Words</div>
          <div className={`text-xs ${activeGame === 'match' ? 'text-blue-100' : 'text-brand-muted'}`}>
            Connect EN & KZ pairs
          </div>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveGame('choose');
          }}
          className={`p-4 rounded-3xl border text-left transition-all ${
            activeGame === 'choose'
              ? 'bg-brand-blue text-white border-brand-blue shadow-hover scale-102'
              : 'bg-white border-brand-border text-indigo-deep hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-6 h-6 mb-2" />
          <div className="font-display font-black text-sm sm:text-base">Multiple Choice</div>
          <div className={`text-xs ${activeGame === 'choose' ? 'text-blue-100' : 'text-brand-muted'}`}>
            Choose correct meaning
          </div>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveGame('listen');
          }}
          className={`p-4 rounded-3xl border text-left transition-all ${
            activeGame === 'listen'
              ? 'bg-brand-blue text-white border-brand-blue shadow-hover scale-102'
              : 'bg-white border-brand-border text-indigo-deep hover:bg-slate-50'
          }`}
        >
          <Volume2 className="w-6 h-6 mb-2" />
          <div className="font-display font-black text-sm sm:text-base">Listen & Choose</div>
          <div className={`text-xs ${activeGame === 'listen' ? 'text-blue-100' : 'text-brand-muted'}`}>
            Train audio perception
          </div>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveGame('spell');
          }}
          className={`p-4 rounded-3xl border text-left transition-all ${
            activeGame === 'spell'
              ? 'bg-brand-blue text-white border-brand-blue shadow-hover scale-102'
              : 'bg-white border-brand-border text-indigo-deep hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-6 h-6 mb-2" />
          <div className="font-display font-black text-sm sm:text-base">Spell the Word</div>
          <div className={`text-xs ${activeGame === 'spell' ? 'text-blue-100' : 'text-brand-muted'}`}>
            Practice writing letters
          </div>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            setActiveGame('audio');
          }}
          className={`p-4 rounded-3xl border text-left transition-all col-span-2 sm:col-span-1 ${
            activeGame === 'audio'
              ? 'bg-gradient-to-tr from-brand-blue to-brand-purple text-white border-transparent shadow-hover scale-102'
              : 'bg-white border-brand-border text-indigo-deep hover:bg-slate-50'
          }`}
        >
          <Radio className="w-6 h-6 mb-2 text-amber-300" />
          <div className="font-display font-black text-sm sm:text-base flex items-center justify-between">
            <span>Audio Studio</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
              {allAudioTracks.length}
            </span>
          </div>
          <div className={`text-xs ${activeGame === 'audio' ? 'text-purple-100' : 'text-brand-muted'}`}>
            Textbook voice files
          </div>
        </button>
      </div>

      {/* Game Window */}
      {activeGame === 'audio' ? (
        <div className="space-y-6">
          <AudioPlayer
            title={
              selectedModuleId === 'all'
                ? 'Curriculum Audio Studio — All 11 Textbook Recordings'
                : `${MODULES.find((m) => m.id === selectedModuleId)?.title} — Audio Studio`
            }
            subtitle="Authentic voice recordings from the speech folder with visualizer"
            tracks={allAudioTracks}
          />

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-4">
            <h3 className="font-display font-black text-xl text-indigo-deep flex items-center gap-2">
              <FileAudio className="w-5 h-5 text-brand-purple" />
              <span>Available Audio Files in this selection ({allAudioTracks.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allAudioTracks.map((tr, idx) => (
                <div
                  key={tr.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:bg-purple-50/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-indigo-deep truncate">
                        {tr.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {tr.subtitle}
                      </div>
                      <div className="text-[10px] font-mono text-purple-700 truncate mt-0.5">
                        {tr.originalFileName}
                      </div>
                    </div>
                  </div>

                  <a
                    href={tr.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-indigo-deep hover:bg-brand-blue hover:text-white transition-colors flex-shrink-0"
                  >
                    Open
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : pool.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-brand-border">
          <p className="font-bold text-sm text-slate-500">
            No words found for this selection. Try selecting "All Modules".
          </p>
        </div>
      ) : (
        <div>
          {activeGame === 'match' && <MatchTheWordsGame words={pool} />}
          {activeGame === 'choose' && <ChooseTheAnswerGame words={pool} />}
          {activeGame === 'listen' && <ListenAndChooseGame words={pool} />}
          {activeGame === 'spell' && <SpellTheWordGame words={pool} />}
        </div>
      )}
    </div>
  );
}
