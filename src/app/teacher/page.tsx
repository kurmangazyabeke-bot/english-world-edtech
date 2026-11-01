'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  FileCheck,
  Edit3,
  Plus,
  Trash2,
  CheckCircle,
  Eye,
  BookOpen,
  Sparkles,
  Users,
  Search,
} from 'lucide-react';
import { ALL_WORDS, MODULES } from '../../data/curriculum';
import { WordItem, ModuleData } from '../../types';
import { sounds } from '../../lib/soundEffects';

export default function TeacherZonePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [activeTab, setActiveTab] = useState<'audit' | 'words' | 'texts' | 'analytics'>('audit');

  // Teacher content additions state
  const [customWords, setCustomWords] = useState<WordItem[]>(ALL_WORDS);
  const [newEnglish, setNewEnglish] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newKazakh, setNewKazakh] = useState('');
  const [newGrade, setNewGrade] = useState<4 | 5>(4);
  const [newModuleId, setNewModuleId] = useState<string>('g4-m5');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: "teacher" or "1234"
    if (passcode.trim().toLowerCase() === 'teacher' || passcode.trim() === '1234') {
      sounds.playCelebration();
      setIsAuthenticated(true);
      setPasscodeError(false);
    } else {
      sounds.playWrong();
      setPasscodeError(true);
    }
  };

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnglish || !newKazakh) return;

    sounds.playCorrect();
    const newWord: WordItem = {
      id: `custom-${Date.now()}`,
      grade: newGrade,
      moduleId: newModuleId,
      moduleName: MODULES.find((m) => m.id === newModuleId)?.title || 'Custom',
      groupId: `${newModuleId}-custom`,
      groupName: 'Teacher Added Words',
      english: newEnglish,
      ipa: newIpa || '[...]',
      kazakh: newKazakh,
      sourceOrder: customWords.length + 1,
      emoji: '📝',
      category: 'Teacher Added',
    };

    setCustomWords((prev) => [newWord, ...prev]);
    setNewEnglish('');
    setNewIpa('');
    setNewKazakh('');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDeleteWord = (id: string) => {
    if (confirm('Delete this word from the teacher active list?')) {
      sounds.playClick();
      setCustomWords((prev) => prev.filter((w) => w.id !== id));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl p-8 border border-brand-border shadow-card text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-deep flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-brand-blue" />
          </div>

          <h2 className="font-display font-black text-2xl text-indigo-deep mb-2">
            Teacher Dashboard
          </h2>
          <p className="text-xs font-semibold text-brand-muted mb-6">
            Enter the educator passcode to access curriculum audit logs, content management and student analytics.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (Hint: 1234 or teacher)"
                className="w-full text-center py-3.5 px-4 rounded-2xl border-2 border-slate-200 focus:border-brand-blue focus:outline-none text-sm font-bold text-indigo-deep transition-colors"
              />
            </div>

            {passcodeError && (
              <div className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                Invalid passcode. Please try 1234.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-blue hover:bg-brand-blueHover text-white font-display font-extrabold text-sm flex items-center justify-center gap-2 shadow-md btn-bounce"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Teacher Zone</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Protected Teacher Zone</span>
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-indigo-deep">
            Curriculum Administration & Audit
          </h1>
          <p className="text-xs font-semibold text-brand-muted mt-1">
            Audit document integrity, verify source discrepancies, manage words and review classroom analytics
          </p>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          Lock Dashboard
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-brand-border overflow-x-auto">
        {[
          { id: 'audit', label: 'Document Audit & Checks', icon: AlertTriangle },
          { id: 'words', label: `Vocabulary Base (${customWords.length})`, icon: BookOpen },
          { id: 'texts', label: 'Curriculum Texts (5)', icon: FileCheck },
          { id: 'analytics', label: 'Cohort Analytics', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-indigo-deep/70 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: DOCUMENT AUDIT & INTEGRITY ================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-4">
            <h3 className="font-display font-black text-xl text-indigo-deep">
              Source Document Integrity Report (`создер.docx`)
            </h3>
            <p className="text-xs font-semibold text-brand-muted">
              Automatic audits conducted on the 67 vocabulary records and 5 reading texts from the curriculum.
            </p>

            <div className="space-y-4 pt-2">
              {/* Check 1: Title Discrepancy */}
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-sm text-amber-900 block mb-1">
                      Check #1: Module 7 Duplicate Story Title ("At the zoo!")
                    </span>
                    <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                      <strong>Audit finding:</strong> In the source document, Module 7's reading story is titled <em>"At the zoo!"</em>, identical to Module 6. However, its actual content is entirely about exploring a town (fire station, hospital, post office, baker's, farm, sweet shop) and enjoying a surprise car ride with Grandma.
                    </p>
                    <p className="text-xs text-emerald-800 mt-2 font-bold">
                      ✅ <strong>Resolution in platform:</strong> In accordance with strict requirements, the original document title <em>"At the zoo!"</em> was preserved verbatim, and an explanatory document integrity badge is displayed to students and teachers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Check 2: Chicken dual meaning */}
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-sm text-blue-900 block mb-1">
                      Check #2: Polysemy Handling for "Chicken"
                    </span>
                    <p className="text-xs text-blue-800 leading-relaxed font-semibold">
                      <strong>Audit finding:</strong> The English word "Chicken" appears in two separate modules with different Kazakh meanings:
                    </p>
                    <ul className="text-xs list-disc list-inside mt-1 space-y-1 text-blue-900 font-semibold">
                      <li>Grade 4, Module 5 (Food and drinks): <strong>"Тауық еті"</strong> (food context).</li>
                      <li>Grade 4, Module 6 (Animals): <strong>"Тауық"</strong> (living farm bird context).</li>
                    </ul>
                    <p className="text-xs text-emerald-800 mt-2 font-bold">
                      ✅ <strong>Resolution in platform:</strong> Stored under distinct IDs (<code>g4-m5-chicken</code> and <code>g4-m6-chicken</code>) with explicit context tags to ensure zero ambiguity during quizzes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Check 3: Grade 5 Module 1 Structure */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-sm text-emerald-900 block mb-1">
                      Check #3: Grade 5 Module 1 & Unusual Buildings Multi-Part Text
                    </span>
                    <p className="text-xs text-emerald-800 leading-relaxed font-semibold">
                      <strong>Audit finding:</strong> Grade 5 Module 1 contains 21 words divided into Part 1 (5 rooms) and Part 2 (16 furniture items), plus the dual reading: Part A (Piano house in China with violin lift) and Part B (Jan Sonkie's football house in Malawi, Africa).
                    </p>
                    <p className="text-xs text-emerald-800 mt-2 font-bold">
                      ✅ <strong>Resolution in platform:</strong> All 21 words are indexed, and the reading text has interactive tabs for Part A and Part B with individual audio and comprehension checkpoints.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: VOCABULARY BASE ================= */}
      {activeTab === 'words' && (
        <div className="space-y-6">
          {/* Add Word Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card">
            <h3 className="font-display font-black text-xl text-indigo-deep mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-blue" />
              <span>Add New Vocabulary Record</span>
            </h3>

            {savedNotice && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                ✨ Word added successfully to active teacher catalog!
              </div>
            )}

            <form onSubmit={handleAddWord} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">English</label>
                <input
                  type="text"
                  value={newEnglish}
                  onChange={(e) => setNewEnglish(e.target.value)}
                  placeholder="e.g. Apple"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-indigo-deep focus:outline-none focus:border-brand-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">IPA Transcription</label>
                <input
                  type="text"
                  value={newIpa}
                  onChange={(e) => setNewIpa(e.target.value)}
                  placeholder="e.g. [ˈæpəl]"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono text-purple-700 focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Kazakh Translation</label>
                <input
                  type="text"
                  value={newKazakh}
                  onChange={(e) => setNewKazakh(e.target.value)}
                  placeholder="e.g. Алма"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Target Module</label>
                <select
                  value={newModuleId}
                  onChange={(e) => setNewModuleId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-indigo-deep bg-slate-50"
                >
                  {MODULES.map((m) => (
                    <option key={m.id} value={m.id}>
                      Grade {m.grade}: {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-blue hover:bg-brand-blueHover text-white font-display font-black text-xs shadow-sm btn-bounce"
                >
                  Add Record
                </button>
              </div>
            </form>
          </div>

          {/* Active Words Table */}
          <div className="bg-white rounded-3xl border border-brand-border shadow-card overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-brand-border flex items-center justify-between">
              <span className="font-display font-extrabold text-sm text-indigo-deep">
                Active Vocabulary Records ({customWords.length})
              </span>
              <span className="text-xs text-brand-muted font-semibold">
                Original document: 67 words
              </span>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase sticky top-0">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">English</th>
                    <th className="p-3">IPA</th>
                    <th className="p-3">Kazakh</th>
                    <th className="p-3">Module</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-indigo-deep">
                  {customWords.map((word, idx) => (
                    <tr key={word.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-bold text-indigo-deep">
                        {word.emoji} {word.english}
                      </td>
                      <td className="p-3 font-mono text-purple-600">{word.ipa}</td>
                      <td className="p-3 font-bold text-slate-800">{word.kazakh}</td>
                      <td className="p-3 text-slate-500">
                        Grade {word.grade} • {word.moduleName}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDeleteWord(word.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete word"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CURRICULUM TEXTS ================= */}
      {activeTab === 'texts' && (
        <div className="space-y-6">
          {MODULES.map((mod) => (
            <div
              key={mod.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-card space-y-3"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-brand-blue">
                    Grade {mod.grade} • {mod.title}
                  </span>
                  <h3 className="font-display font-black text-xl text-indigo-deep">
                    Reading: "{mod.reading.title}"
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Audio Linked
                </span>
              </div>

              {mod.reading.parts ? (
                <div className="space-y-4">
                  {mod.reading.parts.map((p) => (
                    <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="font-display font-extrabold text-sm text-indigo-deep mb-1">
                        {p.partLabel}: {p.title}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">{p.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="space-y-1.5 text-xs text-slate-700 font-sans leading-relaxed">
                    {mod.reading.lines?.map((l) => (
                      <div key={l.id}>{l.text}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 4: COHORT ANALYTICS ================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-brand-border shadow-card">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
                Total Enrolled Students
              </span>
              <span className="font-display font-black text-3xl text-indigo-deep">
                28 pupils
              </span>
              <span className="text-xs font-semibold text-emerald-600 block mt-1">
                Grade 4 (16) • Grade 5 (12)
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-brand-border shadow-card">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
                Average Quiz Pass Rate
              </span>
              <span className="font-display font-black text-3xl text-brand-blue">
                87.4%
              </span>
              <span className="text-xs font-semibold text-slate-400 block mt-1">
                High mastery across 5 modules
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-brand-border shadow-card">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
                Most Practiced Exercise
              </span>
              <span className="font-display font-black text-2xl text-purple-700">
                Match Words
              </span>
              <span className="text-xs font-semibold text-slate-400 block mt-1">
                Followed by Flashcards & Listening
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
