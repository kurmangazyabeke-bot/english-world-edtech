'use client';

import { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { ALL_WORDS, ACHIEVEMENTS } from '../data/curriculum';

const STORAGE_KEY = 'english_world_user_progress_v1';

const INITIAL_PROGRESS: UserProgress = {
  xp: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  learnedWordIds: [],
  favoriteWordIds: [],
  moduleProgress: {},
  unlockedAchievements: [],
  mistakeWordIds: [],
};

// Dispatch a custom window event so all components update immediately
function notifyProgressChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('english_world_progress_updated'));
  }
}

export function getStoredProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_PROGRESS,
      ...parsed,
      learnedWordIds: Array.isArray(parsed.learnedWordIds) ? parsed.learnedWordIds : [],
      favoriteWordIds: Array.isArray(parsed.favoriteWordIds) ? parsed.favoriteWordIds : [],
      mistakeWordIds: Array.isArray(parsed.mistakeWordIds) ? parsed.mistakeWordIds : [],
      moduleProgress: parsed.moduleProgress || {},
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
    };
  } catch (e) {
    console.error('Error loading stored progress:', e);
    return INITIAL_PROGRESS;
  }
}

export function saveStoredProgress(progress: UserProgress): UserProgress {
  if (typeof window === 'undefined') return progress;
  try {
    // Check achievements
    const newlyUnlocked: string[] = [];
    ACHIEVEMENTS.forEach((ach) => {
      if (!progress.unlockedAchievements.includes(ach.id)) {
        if (ach.condition(progress, ALL_WORDS.length)) {
          newlyUnlocked.push(ach.id);
        }
      }
    });

    const updated = {
      ...progress,
      unlockedAchievements: [...progress.unlockedAchievements, ...newlyUnlocked],
      xp: progress.xp + newlyUnlocked.reduce((sum, id) => {
        const item = ACHIEVEMENTS.find((a) => a.id === id);
        return sum + (item?.rewardXp || 0);
      }, 0),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyProgressChange();
    return updated;
  } catch (e) {
    console.error('Error saving progress:', e);
    return progress;
  }
}

export function addXp(amount: number) {
  const current = getStoredProgress();
  const today = new Date().toISOString().split('T')[0];
  let streak = current.streakDays;

  // Simple streak calculator
  if (current.lastActiveDate !== today) {
    const lastDate = new Date(current.lastActiveDate);
    const currDate = new Date(today);
    const diffDays = Math.floor((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
  }

  saveStoredProgress({
    ...current,
    xp: current.xp + amount,
    streakDays: streak,
    lastActiveDate: today,
  });
}

export function toggleWordLearned(wordId: string) {
  const current = getStoredProgress();
  const exists = current.learnedWordIds.includes(wordId);
  const learnedWordIds = exists
    ? current.learnedWordIds.filter((id) => id !== wordId)
    : [...current.learnedWordIds, wordId];

  // If learned, remove from mistakes
  const mistakeWordIds = exists
    ? current.mistakeWordIds
    : current.mistakeWordIds.filter((id) => id !== wordId);

  // Award XP if marked as learned for first time
  let xp = current.xp;
  if (!exists) {
    xp += 10;
  }

  saveStoredProgress({
    ...current,
    xp,
    learnedWordIds,
    mistakeWordIds,
  });
}

export function toggleWordFavorite(wordId: string) {
  const current = getStoredProgress();
  const exists = current.favoriteWordIds.includes(wordId);
  const favoriteWordIds = exists
    ? current.favoriteWordIds.filter((id) => id !== wordId)
    : [...current.favoriteWordIds, wordId];

  saveStoredProgress({
    ...current,
    favoriteWordIds,
  });
}

export function addMistakeWord(wordId: string) {
  const current = getStoredProgress();
  if (!current.mistakeWordIds.includes(wordId)) {
    saveStoredProgress({
      ...current,
      mistakeWordIds: [...current.mistakeWordIds, wordId],
    });
  }
}

export function removeMistakeWord(wordId: string) {
  const current = getStoredProgress();
  if (current.mistakeWordIds.includes(wordId)) {
    saveStoredProgress({
      ...current,
      mistakeWordIds: current.mistakeWordIds.filter((id) => id !== wordId),
    });
  }
}

export function saveQuizCompletion(
  moduleId: string,
  score: number,
  totalQuestions: number,
  xpEarned: number
) {
  const current = getStoredProgress();
  const percentage = Math.round((score / totalQuestions) * 100);
  const existingMod = current.moduleProgress[moduleId] || {
    visited: true,
    wordsPracticed: 0,
    readingCompleted: false,
    practiceCompleted: false,
    completed: false,
  };

  const best = Math.max(existingMod.quizBestPercentage || 0, percentage);

  const updatedModuleProgress = {
    ...current.moduleProgress,
    [moduleId]: {
      ...existingMod,
      visited: true,
      quizScore: score,
      quizBestPercentage: best,
      quizCompletedAt: new Date().toISOString(),
      completed: percentage >= 70,
    },
  };

  saveStoredProgress({
    ...current,
    xp: current.xp + xpEarned,
    moduleProgress: updatedModuleProgress,
  });
}

export function markReadingCompleted(moduleId: string) {
  const current = getStoredProgress();
  const existing = current.moduleProgress[moduleId] || {
    visited: true,
    wordsPracticed: 0,
    readingCompleted: false,
    practiceCompleted: false,
    completed: false,
  };

  if (!existing.readingCompleted) {
    saveStoredProgress({
      ...current,
      xp: current.xp + 25,
      moduleProgress: {
        ...current.moduleProgress,
        [moduleId]: {
          ...existing,
          readingCompleted: true,
        },
      },
    });
  }
}

export function markPracticeCompleted(moduleId: string) {
  const current = getStoredProgress();
  const existing = current.moduleProgress[moduleId] || {
    visited: true,
    wordsPracticed: 0,
    readingCompleted: false,
    practiceCompleted: false,
    completed: false,
  };

  saveStoredProgress({
    ...current,
    xp: current.xp + 20,
    moduleProgress: {
      ...current.moduleProgress,
      [moduleId]: {
        ...existing,
        practiceCompleted: true,
      },
    },
  });
}

export function resetAllProgress() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  notifyProgressChange();
}

// Custom React hook for progress
export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgress(getStoredProgress());
    setIsLoaded(true);

    const handleUpdate = () => {
      setProgress(getStoredProgress());
    };

    window.addEventListener('english_world_progress_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('english_world_progress_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return {
    progress,
    isLoaded,
    addXp,
    toggleWordLearned,
    toggleWordFavorite,
    addMistakeWord,
    removeMistakeWord,
    saveQuizCompletion,
    markReadingCompleted,
    markPracticeCompleted,
    resetAllProgress,
  };
}
