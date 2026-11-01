'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Filter,
  Volume2,
  Star,
  CheckCircle,
  LayoutGrid,
  Table as TableIcon,
  ArrowUpDown,
  RotateCw,
  Sparkles,
  Gamepad2,
  X,
} from 'lucide-react';
import { ALL_WORDS, MODULES } from '../../data/curriculum';
import { WordItem } from '../../types';
import { VocabularyCard } from '../../components/VocabularyCard';
import { MatchTheWordsGame, ChooseTheAnswerGame } from '../../components/PracticeGames';
import { speech } from '../../lib/speech';
import { sounds } from '../../lib/soundEffects';
import { useProgress } from '../../lib/progress';

export default function GlobalDictionaryPage() {
  const {
    progress,
    toggleWordLearned,
    toggleWordFavorite,
  } = useProgress();

  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | 4 | 5>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'learned' | 'not-learned' | 'favorites' | 'mistakes'
  >('all');
  const [sortBy, setSortBy] = useState<'order' | 'alpha-en' | 'alpha-kz'>('order');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);

  // Filtered and sorted words
  const filteredWords = useMemo(() => {
    return ALL_WORDS.filter((word) => {
      // Search query (matches English or Kazakh)
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchEn = word.english.toLowerCase().includes(q);
        const matchKz = word.kazakh.toLowerCase().includes(q);
        if (!matchEn && !matchKz) return false;
      }

      // Grade filter
      if (gradeFilter !== 'all' && word.grade !== gradeFilter) {
        return false;
      }

      // Module filter
      if (moduleFilter !== 'all' && word.moduleId !== moduleFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === 'learned' && !progress.learnedWordIds.includes(word.id)) {
        return false;
      }
      if (statusFilter === 'not-learned' && progress.learnedWordIds.includes(word.id)) {
        return false;
      }
      if (statusFilter === 'favorites' && !progress.favoriteWordIds.includes(word.id)) {
        return false;
      }
      if (statusFilter === 'mistakes' && !progress.mistakeWordIds.includes(word.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'alpha-en') {
        return a.english.localeCompare(b.english);
      }
      if (sortBy === 'alpha-kz') {
        return a.kazakh.localeCompare(b.kazakh);
      }
      return a.sourceOrder - b.sourceOrder;
    });
  }, [searchQuery, gradeFilter, moduleFilter, statusFilter, sortBy, progress]);

  const handleSpeak = (text: string) => {
    sounds.playClick();
    speech.speak(text);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase text-brand-blue bg-blue-50 px-3 py-1 rounded-full">
              Full Master Vocabulary
            </span>
            <span className="text-xs font-bold text-brand-greenDark bg-emerald-50 px-2.5 py-1 rounded-full">
              {ALL_WORDS.length} / 67 Curriculum Words
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-indigo-deep">
            Interactive Dictionary
          </h1>
          <p className="text-xs font-semibold text-brand-muted mt-1">
            Search, listen, mark favorites, and practice any word from Grades 4–5
          </p>
        </div>

        {/* Practice Selected Action */}
        <button
          onClick={() => {
            sounds.playClick();
            setPracticeModalOpen(true);
          }}
          disabled={filteredWords.length === 0}
          className="px-5 py-3 rounded-2xl bg-brand-blue hover:bg-brand-blueHover text-white font-display font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-brand-blue/20 btn-bounce disabled:opacity-40"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Practice Filtered Words ({filteredWords.length})</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-3xl p-5 border border-brand-border shadow-card space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by English word or Kazakh meaning (e.g. 'Beef', 'Күріш', 'Horse')..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-brand-blue focus:outline-none text-sm font-semibold text-indigo-deep transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-deep"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Grade Filter */}
            <select
              value={gradeFilter}
              onChange={(e) =>
                setGradeFilter(
                  e.target.value === 'all'
                    ? 'all'
                    : (Number(e.target.value) as 4 | 5)
                )
              }
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-indigo-deep focus:outline-none"
            >
              <option value="all">All Grades (4 & 5)</option>
              <option value="4">Grade 4 (46 words)</option>
              <option value="5">Grade 5 (21 words)</option>
            </select>

            {/* Module Filter */}
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-indigo-deep focus:outline-none"
            >
              <option value="all">All Modules</option>
              {MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-indigo-deep focus:outline-none"
            >
              <option value="all">All Words</option>
              <option value="learned">Learned Only</option>
              <option value="not-learned">Need to Learn</option>
              <option value="favorites">Favorites ⭐</option>
              <option value="mistakes">Words for Review ⚠️</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-indigo-deep focus:outline-none"
            >
              <option value="order">Curriculum Order</option>
              <option value="alpha-en">A-Z (English)</option>
              <option value="alpha-kz">А-Я (Kazakh)</option>
            </select>
          </div>

          {/* View Mode switch (Cards vs Table) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('cards');
              }}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'cards'
                  ? 'bg-white text-brand-blue shadow-xs'
                  : 'text-slate-500 hover:text-indigo-deep'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('table');
              }}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-brand-blue shadow-xs'
                  : 'text-slate-500 hover:text-indigo-deep'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTENT: CARDS VIEW ================= */}
      {viewMode === 'cards' ? (
        filteredWords.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-brand-border shadow-card">
            <div className="text-4xl mb-3">🔍</div>
            <h4 className="font-display font-black text-xl text-indigo-deep mb-1">
              No words match your filters
            </h4>
            <p className="text-xs font-semibold text-brand-muted mb-4">
              Try searching with another keyword or resetting the filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setGradeFilter('all');
                setModuleFilter('all');
                setStatusFilter('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-indigo-deep"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((word) => (
              <VocabularyCard key={word.id} word={word} />
            ))}
          </div>
        )
      ) : (
        /* ================= CONTENT: TABLE VIEW ================= */
        <div className="bg-white rounded-3xl border border-brand-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-brand-border text-xs font-black uppercase text-indigo-deep">
                <tr>
                  <th className="p-4 w-12 text-center">#</th>
                  <th className="p-4">English Word</th>
                  <th className="p-4">IPA Transcription</th>
                  <th className="p-4">Kazakh Translation</th>
                  <th className="p-4">Module</th>
                  <th className="p-4 text-center">Audio</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-indigo-deep">
                {filteredWords.map((word) => {
                  const isLearned = progress.learnedWordIds.includes(word.id);
                  const isFav = progress.favoriteWordIds.includes(word.id);

                  return (
                    <tr
                      key={word.id}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      <td className="p-4 text-center text-xs text-slate-400">
                        {word.sourceOrder}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{word.emoji}</span>
                          <span className="font-display font-extrabold text-base">
                            {word.english}
                          </span>
                        </div>
                        {word.contextNote && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-bold block mt-0.5">
                            {word.contextNote}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs font-mono text-brand-purple">
                        {word.ipa}
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        {word.kazakh}
                      </td>
                      <td className="p-4 text-xs text-brand-muted">
                        Grade {word.grade} • {word.moduleName}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleSpeak(word.english)}
                          className="p-2 rounded-xl bg-blue-50 text-brand-blue hover:bg-brand-blue hover:text-white transition-colors"
                          title="Listen pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              sounds.playClick();
                              toggleWordFavorite(word.id);
                            }}
                            className={`p-1.5 rounded-lg ${
                              isFav
                                ? 'text-amber-500 bg-amber-50'
                                : 'text-slate-300 hover:text-amber-400'
                            }`}
                            title="Favorite"
                          >
                            <Star
                              className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`}
                            />
                          </button>
                          <button
                            onClick={() => {
                              sounds.playCorrect();
                              toggleWordLearned(word.id);
                            }}
                            className={`p-1.5 rounded-lg ${
                              isLearned
                                ? 'text-emerald-600 bg-emerald-50'
                                : 'text-slate-300 hover:text-emerald-600'
                            }`}
                            title="Mark learned"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= PRACTICE MODAL ================= */}
      {practiceModalOpen && (
        <div className="fixed inset-0 bg-indigo-deep/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-brand-border shadow-2xl relative">
            <button
              onClick={() => setPracticeModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="font-display font-black text-2xl text-indigo-deep">
                Practice Selected Words
              </h3>
              <p className="text-xs font-semibold text-brand-muted">
                Practicing with {filteredWords.length} filtered vocabulary items
              </p>
            </div>

            <MatchTheWordsGame words={filteredWords} />
          </div>
        </div>
      )}
    </div>
  );
}
