export type PillarId = 'web-foundations' | 'js-async' | 'python-backend' | 'ml-ai';

export interface WeekCurriculum {
  weekNumber: number;
  pillarId: PillarId;
  pillarTitle: string;
  title: string;
  subtitle: string;
  estimatedHours: number;
  xpReward: number;
  topics: string[];
  lessons: Lesson[];
  challenges: CodeChallenge[];
  quiz: QuizQuestion[];
}

export interface Lesson {
  id: string;
  weekNumber: number;
  title: string;
  summary: string;
  readTimeMinutes: number;
  internshipTip: string;
  codeSnippet: string;
  language: 'html' | 'javascript' | 'python';
  explanationPoints: string[];
  outputSimulation?: string;
  interactiveSandbox?: {
    initialCode: string;
    expectedOutput?: string;
    language: 'html' | 'javascript' | 'python';
  };
}

export interface QuizQuestion {
  id: string;
  weekNumber?: number;
  pillarId: PillarId;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  codeSnippet?: string;
  language?: 'html' | 'javascript' | 'python';
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  distractorNotes?: string;
  screeningContext: string; // e.g. "Typical Google / Meta early career screening trap"
}

export interface CodeChallenge {
  id: string;
  weekNumber: number;
  pillarId: PillarId;
  title: string;
  difficulty: 'Easy' | 'Medium';
  instructions: string;
  starterCode: string;
  language: 'javascript' | 'python' | 'html';
  solutionHint: string;
  testCases: {
    inputDesc: string;
    expectedDesc: string;
    testFnString: string; // evaluated in JS runner
  }[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  category: 'milestone' | 'quiz' | 'code' | 'streak';
}

export interface UserProgress {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  completedChallengeIds: string[];
  completedQuizIds: string[];
  unlockedBadgeIds: string[];
  quizScores: Record<string, number>; // quizId -> score %
  mockAssessmentHistory: {
    id: string;
    date: string;
    score: number;
    totalQuestions: number;
    passed: boolean;
    durationSeconds: number;
    breakdown: Record<PillarId, { correct: number; total: number }>;
  }[];
}

export type ActiveTab = 'dashboard' | 'curriculum' | 'playground' | 'mock-exam' | 'badges';
