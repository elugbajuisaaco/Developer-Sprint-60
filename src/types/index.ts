export type PillarId = 'web-foundations' | 'js-async' | 'python-backend' | 'ml-ai';

export interface SyllabusItem {
  id: string;
  code: string;
  title: string;
  type: 'lesson' | 'ai-interval';
  weekNumber: number;
}

export interface SyllabusModule {
  id: string;
  moduleNumber: number;
  title: string;
  partId: 'part-1' | 'part-2' | 'part-3';
  totalItems: number;
  monthNumber: 1 | 2;
  weeksMapped: number[];
  items: SyllabusItem[];
}

export interface SyllabusPart {
  id: 'part-1' | 'part-2' | 'part-3';
  partNumber: number;
  title: string;
  subtitle: string;
  monthAllocation: string;
  totalCourses: number;
  totalItems: number;
  status: 'completed' | 'in-progress' | 'up-next';
  modules: SyllabusModule[];
}

export interface AssessmentGateway {
  id: string;
  title: string;
  subtitle: string;
  passingScorePercent: number;
  screeningObjective: string;
  mandatoryToUnlockNextWeek: boolean;
  questionCount: number;
}

export interface WeekCurriculum {
  weekNumber: number;
  monthNumber: 1 | 2;
  partId: 'part-1' | 'part-2' | 'part-3';
  partTitle: string;
  moduleNumbers: number[];
  moduleTitles: string[];
  syllabusItemCount: number;
  syllabusItemRange: string;
  syllabusItems: SyllabusItem[];
  pillarId: PillarId;
  pillarTitle: string;
  title: string;
  subtitle: string;
  estimatedHours: number;
  xpReward: number;
  topics: string[];
  assessmentGateway: AssessmentGateway;
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
  completedSyllabusItemIds?: string[];
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

export type ActiveTab = 'dashboard' | 'syllabus' | 'curriculum' | 'playground' | 'mock-exam' | 'badges';
