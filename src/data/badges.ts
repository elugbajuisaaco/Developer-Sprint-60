import { Badge, UserProgress } from '../types';

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'badge-first-step',
    name: 'First Commit',
    description: 'Complete your first interactive DevSprint lesson.',
    iconName: 'Sparkles',
    category: 'milestone',
  },
  {
    id: 'badge-dom-dominator',
    name: 'DOM Dominator',
    description: 'Master HTML5 semantics, CSS Grid/Flexbox and DOM event delegation in Weeks 1–2.',
    iconName: 'Layout',
    category: 'milestone',
  },
  {
    id: 'badge-async-ace',
    name: 'Async Maestro',
    description: 'Conquer the JavaScript Event Loop, Promises, and the Fetch API in Weeks 3–4.',
    iconName: 'Zap',
    category: 'milestone',
  },
  {
    id: 'badge-python-architect',
    name: 'Pythonic Architect',
    description: 'Build backend OOP data structures and RESTful route logic in Weeks 5–6.',
    iconName: 'Terminal',
    category: 'milestone',
  },
  {
    id: 'badge-ml-engineer',
    name: 'AI & ML Pioneer',
    description: 'Train Scikit-Learn models and integrate client-side ML pipelines in Weeks 7–8.',
    iconName: 'Brain',
    category: 'milestone',
  },
  {
    id: 'badge-fire-streak',
    name: 'Sprint Discipline',
    description: 'Maintain a 3-day continuous coding streak.',
    iconName: 'Flame',
    category: 'streak',
  },
  {
    id: 'badge-bug-hunter',
    name: 'Code Lab Veteran',
    description: 'Solve 3 or more interactive coding playground challenges.',
    iconName: 'Code2',
    category: 'code',
  },
  {
    id: 'badge-assessment-ready',
    name: 'Interview Ready',
    description: 'Score 80% or higher on the timed Mock Internship Assessment Test.',
    iconName: 'Award',
    category: 'quiz',
  },
  {
    id: 'badge-perfect-score',
    name: 'Perfectionist',
    description: 'Score 100% on any module screening quiz.',
    iconName: 'ShieldCheck',
    category: 'quiz',
  },
];

export function checkNewBadges(progress: UserProgress): string[] {
  const currentUnlocked = new Set(progress.unlockedBadgeIds);
  const newBadges: string[] = [];

  // Check 1: First commit
  if (progress.completedLessonIds.length >= 1 && !currentUnlocked.has('badge-first-step')) {
    newBadges.push('badge-first-step');
  }

  // Check 2: DOM Dominator (Weeks 1 & 2 completed)
  const hasW1 = progress.completedLessonIds.some(id => id.startsWith('w1-'));
  const hasW2 = progress.completedLessonIds.some(id => id.startsWith('w2-'));
  if (hasW1 && hasW2 && !currentUnlocked.has('badge-dom-dominator')) {
    newBadges.push('badge-dom-dominator');
  }

  // Check 3: Async Maestro (Weeks 3 & 4 completed)
  const hasW3 = progress.completedLessonIds.some(id => id.startsWith('w3-'));
  const hasW4 = progress.completedLessonIds.some(id => id.startsWith('w4-'));
  if (hasW3 && hasW4 && !currentUnlocked.has('badge-async-ace')) {
    newBadges.push('badge-async-ace');
  }

  // Check 4: Pythonic Architect (Weeks 5 & 6)
  const hasW5 = progress.completedLessonIds.some(id => id.startsWith('w5-'));
  const hasW6 = progress.completedLessonIds.some(id => id.startsWith('w6-'));
  if (hasW5 && hasW6 && !currentUnlocked.has('badge-python-architect')) {
    newBadges.push('badge-python-architect');
  }

  // Check 5: AI & ML Pioneer (Weeks 7 & 8)
  const hasW7 = progress.completedLessonIds.some(id => id.startsWith('w7-'));
  const hasW8 = progress.completedLessonIds.some(id => id.startsWith('w8-'));
  if (hasW7 && hasW8 && !currentUnlocked.has('badge-ml-engineer')) {
    newBadges.push('badge-ml-engineer');
  }

  // Check 6: Streak
  if (progress.streakDays >= 3 && !currentUnlocked.has('badge-fire-streak')) {
    newBadges.push('badge-fire-streak');
  }

  // Check 7: Code challenges solved >= 3
  if (progress.completedChallengeIds.length >= 3 && !currentUnlocked.has('badge-bug-hunter')) {
    newBadges.push('badge-bug-hunter');
  }

  // Check 8: Mock assessment >= 80%
  const passedWithHigh = progress.mockAssessmentHistory.some(m => (m.score / m.totalQuestions) >= 0.8);
  if (passedWithHigh && !currentUnlocked.has('badge-assessment-ready')) {
    newBadges.push('badge-assessment-ready');
  }

  // Check 9: Perfect score
  const has100 = Object.values(progress.quizScores).some(s => s === 100);
  if (has100 && !currentUnlocked.has('badge-perfect-score')) {
    newBadges.push('badge-perfect-score');
  }

  return newBadges;
}
