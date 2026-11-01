'use client';

import React, { useState } from 'react';
import {
  Volume2,
  RotateCcw,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Search,
} from 'lucide-react';
import { ReadingStory, WordItem } from '../types';
import { speech } from '../lib/speech';
import { sounds } from '../lib/soundEffects';
import { useProgress } from '../lib/progress';
import { AudioPlayer } from './AudioPlayer';

interface ReadingViewerProps {
  reading: ReadingStory;
  moduleId: string;
  moduleWords: WordItem[];
}

export function ReadingViewer({
  reading,
  moduleId,
  moduleWords,
}: ReadingViewerProps) {
  const { markReadingCompleted, addXp } = useProgress();

  const [activePartIndex, setActivePartIndex] = useState(0);
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number | null>(null);
  const [playingLineId, setPlayingLineId] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [highlightVocabulary, setHighlightVocabulary] = useState(true);

  // Comprehension test states
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [checkedResults, setCheckedResults] = useState(false);
  const [earnedBonus, setEarnedBonus] = useState(false);

  const hasParts = !!(reading.parts && reading.parts.length > 0);
  const currentPart = hasParts ? reading.parts![activePartIndex] : null;

  const lines = hasParts ? currentPart!.lines : reading.lines || [];
  const fullText = hasParts ? currentPart!.text : lines.map((l) => l.text).join(' ');

  const handlePlayLine = async (lineId: string, text: string) => {
    sounds.playClick();
    setPlayingLineId(lineId);
    await speech.speak(text);
    setPlayingLineId(null);
  };

  const handleFontSizeCycle = () => {
    sounds.playClick();
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('huge');
    else setFontSize('normal');
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    sounds.playClick();
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleCheckUnderstanding = () => {
    sounds.playClick();
    setCheckedResults(true);

    const questions = reading.comprehensionQuestions;
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.answerIndex) {
        correctCount += 1;
      }
    });

    if (correctCount === questions.length) {
      sounds.playCelebration();
      if (!earnedBonus) {
        addXp(25);
        setEarnedBonus(true);
      }
    } else {
      sounds.playCorrect();
    }
    markReadingCompleted(moduleId);
  };

  // Helper to render text with vocabulary highlight tool
  const renderInteractiveText = (text: string) => {
    if (!highlightVocabulary || moduleWords.length === 0) {
      return <span>{text}</span>;
    }

    // Build regex to find module words
    const wordMap = new Map<string, WordItem>();
    moduleWords.forEach((w) => {
      // also check lowercase
      wordMap.set(w.english.toLowerCase(), w);
      // handles plurals like seeds -> seed, tomatoes -> tomato, sunflowers -> sunflower
      if (w.english.endsWith('s')) {
        wordMap.set(w.english.slice(0, -1).toLowerCase(), w);
      }
    });

    const tokens = text.split(/(\b[a-zA-Z'’-]+\b)/g);

    return (
      <>
        {tokens.map((token, i) => {
          const matched = wordMap.get(token.toLowerCase());
          if (matched) {
            return (
              <span
                key={i}
                className="relative inline-block group/word cursor-pointer font-extrabold text-brand-blue bg-blue-50/90 hover:bg-blue-100 rounded px-1 transition-colors mx-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playClick();
                  speech.speak(matched.english);
                }}
              >
                {token}
                {/* Tooltip pill with Kazakh meaning & IPA */}
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover/word:flex flex-col items-center bg-indigo-deep text-white text-[11px] font-sans rounded-xl px-2.5 py-1 shadow-lg pointer-events-none z-30 whitespace-nowrap">
                  <span className="font-bold text-amber-300">{matched.kazakh}</span>
                  <span className="text-[9px] text-brand-purple font-mono">{matched.ipa}</span>
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-deep" />
                </span>
              </span>
            );
          }
          return <span key={i}>{token}</span>;
        })}
      </>
    );
  };

  const fontClass =
    fontSize === 'normal'
      ? 'text-base sm:text-lg leading-relaxed'
      : fontSize === 'large'
      ? 'text-lg sm:text-xl leading-loose'
      : 'text-xl sm:text-2xl leading-loose font-medium';

  return (
    <div className="space-y-6">
      {/* Discrepancy Note banner for Document Integrity (Module 7) */}
      {reading.hasTitleDiscrepancy && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-black uppercase tracking-wider block text-amber-800 mb-0.5">
              Document Authenticity Notice
            </span>
            <p className="font-semibold">{reading.discrepancyNote}</p>
          </div>
        </div>
      )}

      {/* Parts switcher for Grade 5 Module 1 (Unusual Buildings) */}
      {hasParts && (
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-brand-border shadow-xs">
          {reading.parts!.map((part, idx) => (
            <button
              key={part.id}
              onClick={() => {
                sounds.playClick();
                setActivePartIndex(idx);
                setActiveSentenceIdx(null);
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-display font-black text-sm transition-all ${
                activePartIndex === idx
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-indigo-deep/70 hover:bg-slate-100 hover:text-indigo-deep'
              }`}
            >
              <span>{part.partLabel}: {part.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Audio Player for this story */}
      <AudioPlayer
        title={`Listen: ${hasParts ? currentPart!.title : reading.title}`}
        subtitle="Listen to authentic audio or follow along sentence-by-sentence"
        audioFileSrc={reading.audioSrc}
        audioFileName={reading.audioFileName}
        fullSpeechText={fullText}
        sentences={lines.map((l) => l.text)}
        onSentenceChange={(idx) => setActiveSentenceIdx(idx >= 0 ? idx : null)}
      />

      {/* Reading Text Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card">
        {/* Story Header Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-blue bg-blue-50 px-3 py-1 rounded-full">
                {hasParts ? currentPart!.partLabel : 'Original Document Reading'}
              </span>
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-indigo-deep mt-1">
              {hasParts ? currentPart!.title : reading.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Highlight vocabulary toggle */}
            <button
              onClick={() => {
                sounds.playClick();
                setHighlightVocabulary(!highlightVocabulary);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                highlightVocabulary
                  ? 'bg-blue-50 text-brand-blue border border-blue-200'
                  : 'bg-slate-100 text-slate-500'
              }`}
              title="Highlight words from this module"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Vocab Highlights: {highlightVocabulary ? 'ON' : 'OFF'}</span>
            </button>

            {/* Font size button */}
            <button
              onClick={handleFontSizeCycle}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-indigo-deep"
              title="Change font size"
            >
              <ZoomIn className="w-3.5 h-3.5 text-indigo-deep" />
              <span className="uppercase">{fontSize} Text</span>
            </button>
          </div>
        </div>

        {/* Lines Presentation with Sentence-by-Sentence play buttons */}
        <div className={`space-y-4 ${fontClass}`}>
          {lines.map((line, idx) => {
            const isSentenceActive = activeSentenceIdx === idx;
            const isLinePlaying = playingLineId === line.id;

            return (
              <div
                key={line.id}
                className={`group flex items-start gap-3 p-3 rounded-2xl transition-all duration-200 ${
                  isSentenceActive || isLinePlaying
                    ? 'bg-amber-50/90 border border-amber-300 shadow-sm scale-[1.01]'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Sentence audio play button */}
                <button
                  onClick={() => handlePlayLine(line.id, line.text)}
                  className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isLinePlaying
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-brand-blue group-hover:text-white'
                  }`}
                  title="Listen this sentence"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {/* Sentence Text */}
                <div className="flex-1 text-indigo-deep font-sans">
                  {renderInteractiveText(line.text)}
                </div>

                {/* Repeat button */}
                <button
                  onClick={() => handlePlayLine(line.id, line.text)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-brand-blue font-bold flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 transition-opacity"
                  title="Repeat sentence"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Repeat</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Check Understanding toggle button */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <div className="text-xs font-semibold text-brand-muted">
            Finished reading? Test your understanding with the comprehension quiz!
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              setShowQuestions(!showQuestions);
            }}
            className="px-5 py-3 rounded-2xl bg-brand-blue text-white font-display font-extrabold text-sm flex items-center gap-2 hover:bg-brand-blueHover shadow-md shadow-brand-blue/20 btn-bounce"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{showQuestions ? 'Hide Questions' : 'Check Understanding'}</span>
          </button>
        </div>
      </div>

      {/* Comprehension Questions Section */}
      {showQuestions && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-black text-xl text-indigo-deep">
                Reading Comprehension Quiz
              </h4>
              <p className="text-xs font-semibold text-brand-muted">
                Answer based directly on the reading story text
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {reading.comprehensionQuestions.map((q, qIdx) => {
              const selected = selectedAnswers[q.id];
              const isCorrect = selected === q.answerIndex;

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200"
                >
                  <h5 className="font-display font-extrabold text-base text-indigo-deep mb-3">
                    {qIdx + 1}. {q.question}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((option, optIdx) => {
                      let btnStyle =
                        'bg-white border-slate-200 text-slate-700 hover:border-brand-blue hover:bg-blue-50/40';

                      if (selected === optIdx) {
                        btnStyle = 'bg-brand-blue text-white border-brand-blue';
                      }

                      if (checkedResults) {
                        if (optIdx === q.answerIndex) {
                          btnStyle =
                            'bg-emerald-500 text-white border-emerald-500 font-bold';
                        } else if (selected === optIdx && !isCorrect) {
                          btnStyle =
                            'bg-rose-500 text-white border-rose-500';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={checkedResults}
                          onClick={() => handleAnswerSelect(q.id, optIdx)}
                          className={`p-3 rounded-xl border text-left text-sm font-semibold transition-all ${btnStyle}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {checkedResults && (
                    <div
                      className={`mt-3 p-3 rounded-xl text-xs font-semibold flex items-start gap-2 ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold">
                          {isCorrect ? 'Correct! ' : 'Explanation: '}
                        </span>
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            {!checkedResults ? (
              <button
                onClick={handleCheckUnderstanding}
                disabled={
                  Object.keys(selectedAnswers).length <
                  reading.comprehensionQuestions.length
                }
                className="px-6 py-3 rounded-2xl bg-brand-green text-white font-display font-black text-sm hover:bg-brand-greenDark shadow-md disabled:opacity-50 disabled:cursor-not-allowed btn-bounce"
              >
                Submit Answers
              </button>
            ) : (
              <button
                onClick={() => {
                  sounds.playClick();
                  setCheckedResults(false);
                  setSelectedAnswers({});
                }}
                className="px-6 py-3 rounded-2xl bg-brand-blue text-white font-display font-black text-sm hover:bg-brand-blueHover shadow-md btn-bounce"
              >
                Try Questions Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
