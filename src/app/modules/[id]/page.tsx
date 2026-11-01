'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Gamepad2,
  CheckCircle2,
  Trophy,
  Volume2,
  Layers,
  LayoutGrid,
  CreditCard,
  FileText,
  Star,
  ChevronRight,
} from 'lucide-react';
import { MODULES } from '../../../data/curriculum';
import { VocabularyCard } from '../../../components/VocabularyCard';
import { FlashcardDeck } from '../../../components/Flashcard';
import { ReadingViewer } from '../../../components/ReadingViewer';
import { PracticeHub } from '../../../components/PracticeGames';
import { ModuleQuiz } from '../../../components/ModuleQuiz';
import { AudioPlayer } from '../../../components/AudioPlayer';
import {
  FoodMatchSpecial,
  BodyPartsSpecial,
  TownExplorerSpecial,
  SunflowersTechSpecial,
  HousePlanSpecial,
} from '../../../components/SpecialModuleFeatures';
import { useProgress } from '../../../lib/progress';
import { sounds } from '../../../lib/soundEffects';

export default function ModuleDetailPage() {
  const params = useParams();
  const moduleId = params?.id as string;
  const { progress } = useProgress();

  const module = MODULES.find((m) => m.id === moduleId);

  const [activeSection, setActiveSection] = useState<
    'overview' | 'audio' | 'words' | 'reading' | 'practice' | 'special' | 'quiz'
  >('overview');
  const [wordViewMode, setWordViewMode] = useState<'grid' | 'flashcards'>('grid');

  if (!module) {
    return notFound();
  }

  const allModuleWords = module.wordGroups.flatMap((g) => g.words);
  const learnedCount = allModuleWords.filter((w) =>
    progress.learnedWordIds.includes(w.id)
  ).length;
  const progressPercent = Math.round((learnedCount / module.wordsCount) * 100);
  const isCompleted = progress.moduleProgress[module.id]?.completed;

  const sections = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'audio', label: `Audio Tracks (${module.audioTracks?.length || 1})`, icon: Volume2 },
    { id: 'words', label: `New Words (${module.wordsCount})`, icon: BookOpen },
    { id: 'reading', label: 'Reading', icon: FileText },
    { id: 'special', label: 'Special Explorer', icon: Sparkles },
    { id: 'practice', label: 'Practice Games', icon: Gamepad2 },
    { id: 'quiz', label: 'Final Quiz (10)', icon: Trophy },
  ] as const;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          onClick={() => sounds.playClick()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-blue transition-colors px-3 py-1.5 rounded-xl bg-white border border-brand-border shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <span
            className="text-xs font-black uppercase px-3 py-1 rounded-full text-white shadow-xs"
            style={{ backgroundColor: module.color }}
          >
            Grade {module.grade}
          </span>
          <span className="text-xs font-bold text-slate-500 bg-white border border-brand-border px-3 py-1 rounded-full">
            {module.moduleNumber === 1 && module.grade === 5
              ? 'Module 1'
              : `Module ${module.moduleNumber}`}
          </span>
        </div>
      </div>

      {/* Module Title Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card relative overflow-hidden">
        <div
          className={`absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r ${module.gradient}`}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="font-display font-black text-2xl sm:text-4xl text-indigo-deep">
              {module.title}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-brand-muted max-w-2xl">
              {module.description}
            </p>
          </div>

          {/* Progress Pill */}
          <div className="w-full md:w-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-500">Mastery Progress</span>
              <span className="text-indigo-deep font-extrabold">
                {learnedCount} / {module.wordsCount} words ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${module.gradient} transition-all duration-500`}
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-100 overflow-x-auto pb-1">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;

            return (
              <button
                key={sec.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveSection(sec.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20 scale-102'
                    : 'text-indigo-deep/75 hover:bg-slate-100 hover:text-indigo-deep'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= SECTION: OVERVIEW ================= */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Featured Audio Studio */}
          {module.audioTracks && module.audioTracks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase text-brand-blue tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-brand-blue" />
                  <span>Module Audio Studio ({module.audioTracks.length} recordings from textbook)</span>
                </span>
                <span className="text-xs font-semibold text-brand-muted">
                  Authentic recordings from speech folder
                </span>
              </div>
              <AudioPlayer
                title={`${module.title} — Official Listening Tracks`}
                subtitle="Listen to teacher recordings for vocabulary words and reading stories"
                tracks={module.audioTracks}
              />
            </div>
          )}

          {/* Quick Start Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => {
                sounds.playClick();
                setActiveSection('words');
              }}
              className="p-5 rounded-3xl bg-white border border-brand-border shadow-card hover:shadow-hover text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-display font-black text-base text-indigo-deep">
                  1. Study Vocabulary
                </h4>
                <p className="text-xs font-semibold text-brand-muted mt-1">
                  {module.wordsCount} authentic words with IPA, translations & sound
                </p>
              </div>
              <span className="text-xs font-bold text-brand-blue mt-4 flex items-center gap-1">
                Explore words <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveSection('reading');
              }}
              className="p-5 rounded-3xl bg-white border border-brand-border shadow-card hover:shadow-hover text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-brand-purple flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-display font-black text-base text-indigo-deep">
                  2. Read Story
                </h4>
                <p className="text-xs font-semibold text-brand-muted mt-1">
                  "{module.reading.title}" with audio & sentence replay
                </p>
              </div>
              <span className="text-xs font-bold text-brand-purple mt-4 flex items-center gap-1">
                Read text <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveSection('practice');
              }}
              className="p-5 rounded-3xl bg-white border border-brand-border shadow-card hover:shadow-hover text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-brand-greenDark flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <h4 className="font-display font-black text-base text-indigo-deep">
                  3. Practice Games
                </h4>
                <p className="text-xs font-semibold text-brand-muted mt-1">
                  Match the words, listen, choose & spell
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600 mt-4 flex items-center gap-1">
                Play games <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveSection('quiz');
              }}
              className="p-5 rounded-3xl bg-white border border-brand-border shadow-card hover:shadow-hover text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>
                <h4 className="font-display font-black text-base text-indigo-deep">
                  4. Final Quiz
                </h4>
                <p className="text-xs font-semibold text-brand-muted mt-1">
                  10 questions to test your knowledge and earn XP
                </p>
              </div>
              <span className="text-xs font-bold text-amber-600 mt-4 flex items-center gap-1">
                Start quiz <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>

          {/* Module Word Groups Preview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-6">
            <h3 className="font-display font-black text-xl text-indigo-deep">
              Curriculum Groups in this Module
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {module.wordGroups.map((group) => (
                <div
                  key={group.id}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-display font-extrabold text-sm text-indigo-deep">
                      {group.title}
                    </h4>
                    <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                      {group.words.length} words
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.words.map((w) => (
                      <span
                        key={w.id}
                        className="inline-flex items-center gap-1 text-xs font-bold bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-indigo-deep"
                      >
                        <span>{w.emoji}</span>
                        <span>{w.english}</span>
                        <span className="text-slate-400 font-normal">({w.kazakh})</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION: AUDIO TRACKS ================= */}
      {activeSection === 'audio' && (
        <div className="space-y-6">
          <AudioPlayer
            title={`${module.title} — Audio Studio`}
            subtitle="Authentic textbook listening tracks with live soundwave visualizer"
            tracks={module.audioTracks}
          />

          {/* Audio Tracks Catalog List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-4">
            <h3 className="font-display font-black text-xl text-indigo-deep flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-brand-blue" />
              <span>Available Audio Files for this Module</span>
            </h3>

            <div className="space-y-3">
              {module.audioTracks?.map((track, i) => (
                <div
                  key={track.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 text-brand-blue flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-display font-black text-base text-indigo-deep">
                        {track.title}
                      </div>
                      <div className="text-xs font-semibold text-slate-500">
                        {track.subtitle}
                      </div>
                      <div className="text-[11px] font-mono text-purple-700 mt-1">
                        📁 Filename: {track.originalFileName}
                      </div>
                    </div>
                  </div>

                  <a
                    href={track.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-indigo-deep hover:bg-brand-blue hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Direct File</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION: NEW WORDS ================= */}
      {activeSection === 'words' && (
        <div className="space-y-6">
          {/* Audio Player for this module's words */}
          {module.audioTracks?.some((t) => t.type === 'words') && (
            <AudioPlayer
              title={`${module.title} — New Words Audio`}
              subtitle="Listen to teacher recordings for all vocabulary words"
              tracks={module.audioTracks.filter((t) => t.type === 'words')}
            />
          )}

          {/* View mode toggle: Grid vs Flashcards */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-brand-border shadow-xs">
            <div className="text-xs font-bold text-brand-muted px-2">
              Viewing {allModuleWords.length} words from this module
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => {
                  sounds.playClick();
                  setWordViewMode('grid');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  wordViewMode === 'grid'
                    ? 'bg-white text-brand-blue shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-indigo-deep'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Word Cards</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setWordViewMode('flashcards');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  wordViewMode === 'flashcards'
                    ? 'bg-white text-brand-purple shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-indigo-deep'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Flashcards Mode</span>
              </button>
            </div>
          </div>

          {wordViewMode === 'flashcards' ? (
            <FlashcardDeck words={allModuleWords} />
          ) : (
            <div className="space-y-8">
              {module.wordGroups.map((group, groupIdx) => {
                const wordsTracks = module.audioTracks?.filter((t) => t.type === 'words') || [];
                const matchingTrack = wordsTracks[groupIdx] || wordsTracks[0];

                return (
                  <div key={group.id} className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-brand-border/70 gap-2">
                      <div>
                        <h3 className="font-display font-black text-lg text-indigo-deep flex items-center gap-2">
                          <span>{group.title}</span>
                          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            {group.words.length} words
                          </span>
                        </h3>
                        {matchingTrack && (
                          <div className="text-[11px] font-mono text-purple-700 mt-0.5 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                            <span>Audio source: <strong>{matchingTrack.originalFileName}</strong></span>
                          </div>
                        )}
                      </div>
                      {matchingTrack && (
                        <div className="flex items-center gap-2">
                          <a
                            href={matchingTrack.src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-brand-purple font-bold text-xs border border-purple-200 transition-colors shadow-xs"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Play Track {groupIdx + 1}</span>
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.words.map((word) => (
                        <VocabularyCard key={word.id} word={word} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= SECTION: READING ================= */}
      {activeSection === 'reading' && (
        <ReadingViewer
          reading={module.reading}
          moduleId={module.id}
          moduleWords={allModuleWords}
        />
      )}

      {/* ================= SECTION: SPECIAL EXPLORER ================= */}
      {activeSection === 'special' && (
        <div>
          {module.specialFeature === 'food-match' && (
            <FoodMatchSpecial words={allModuleWords} />
          )}
          {module.specialFeature === 'body-parts' && (
            <BodyPartsSpecial words={allModuleWords} />
          )}
          {module.specialFeature === 'town-explorer' && (
            <TownExplorerSpecial words={allModuleWords} />
          )}
          {module.specialFeature === 'sunflowers-tech' && (
            <SunflowersTechSpecial words={allModuleWords} />
          )}
          {module.specialFeature === 'house-floorplan' && (
            <HousePlanSpecial words={allModuleWords} />
          )}
        </div>
      )}

      {/* ================= SECTION: PRACTICE ================= */}
      {activeSection === 'practice' && (
        <PracticeHub words={allModuleWords} moduleId={module.id} />
      )}

      {/* ================= SECTION: FINAL QUIZ ================= */}
      {activeSection === 'quiz' && <ModuleQuiz module={module} />}
    </div>
  );
}
