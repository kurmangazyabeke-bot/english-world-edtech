export interface WordItem {
  id: string;
  grade: 4 | 5;
  moduleId: string;
  moduleName: string;
  groupId: string;
  groupName: string;
  english: string;
  ipa: string;
  kazakh: string;
  sourceOrder: number;
  emoji: string;
  category: string;
  contextNote?: string;
}

export interface ReadingLine {
  id: string;
  speaker?: string;
  text: string;
}

export interface ReadingPart {
  id: string;
  partLabel: string;
  title: string;
  text: string;
  lines: ReadingLine[];
  audioSrc?: string;
}

export interface ReadingStory {
  id: string;
  title: string;
  originalDocumentTitle?: string;
  hasTitleDiscrepancy?: boolean;
  discrepancyNote?: string;
  audioSrc?: string;
  lines?: ReadingLine[];
  parts?: ReadingPart[];
  comprehensionQuestions: {
    id: string;
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  type: 'translate-en-kz' | 'translate-kz-en' | 'listening' | 'spelling' | 'reading-comp' | 'fill-blank';
  question: string;
  audioWord?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  sourceWordId?: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  originalFileName: string;
  type: 'words' | 'story';
}

export interface ModuleData {
  id: string;
  grade: 4 | 5;
  moduleNumber: number;
  slug: string;
  title: string;
  displayTitle: string;
  subtitle: string;
  description: string;
  color: string;
  gradient: string;
  accentColor: string;
  iconName: string;
  wordsCount: number;
  hasReading: boolean;
  audioWordsSrc?: string;
  readingAudioSrc?: string;
  audioTracks?: AudioTrack[];
  wordGroups: {
    id: string;
    title: string;
    words: WordItem[];
  }[];
  reading: ReadingStory;
  specialFeature: 'food-match' | 'body-parts' | 'town-explorer' | 'sunflowers-tech' | 'house-floorplan';
  quiz: QuizQuestion[];
}

export interface UserProgress {
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  learnedWordIds: string[];
  favoriteWordIds: string[];
  moduleProgress: Record<
    string,
    {
      visited: boolean;
      wordsPracticed: number;
      readingCompleted: boolean;
      practiceCompleted: boolean;
      quizScore?: number;
      quizBestPercentage?: number;
      quizCompletedAt?: string;
      completed: boolean;
    }
  >;
  unlockedAchievements: string[];
  mistakeWordIds: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'words' | 'modules' | 'xp' | 'streak' | 'reading';
  condition: (progress: UserProgress, totalWordsCount: number) => boolean;
  rewardXp: number;
}
