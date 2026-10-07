import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Code2, 
  Sparkles,
  Terminal
} from 'lucide-react';
import { CURRICULUM_DATA } from '../data/curriculum';
import { CodeChallenge, UserProgress } from '../types';
import { soundFx } from '../services/soundEffects';

interface CodePlaygroundViewProps {
  progress: UserProgress;
  onCompleteChallenge: (challengeId: string) => void;
}

export const CodePlaygroundView: React.FC<CodePlaygroundViewProps> = ({
  progress,
  onCompleteChallenge,
}) => {
  // Collect all challenges from curriculum
  const allChallenges: CodeChallenge[] = CURRICULUM_DATA.flatMap((w) => w.challenges);

  const [activeChallengeId, setActiveChallengeId] = useState<string>(allChallenges[0]?.id || '');
  const activeChallenge = allChallenges.find((c) => c.id === activeChallengeId) || allChallenges[0];

  const [code, setCode] = useState<string>(activeChallenge?.starterCode || '');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{
    passed: boolean;
    inputDesc: string;
    expectedDesc: string;
    error?: string;
  }[] | null>(null);

  // Sync code when active challenge switches
  const handleSelectChallenge = (c: CodeChallenge) => {
    soundFx.playClick();
    setActiveChallengeId(c.id);
    setCode(c.starterCode);
    setShowHint(false);
    setTestResults(null);
  };

  const handleResetCode = () => {
    soundFx.playClick();
    if (activeChallenge) {
      setCode(activeChallenge.starterCode);
      setTestResults(null);
    }
  };

  const handleRunTests = async () => {
    if (!activeChallenge) return;
    setIsRunning(true);
    soundFx.playClick();

    const results: { passed: boolean; inputDesc: string; expectedDesc: string; error?: string }[] = [];

    try {
      // Evaluate user's function in sandboxed closure
      // Note: All challenges provide a function named in starterCode
      const userFactory = new Function(`
        ${code}
        // Return the main function defined in the code
        if (typeof resolveAction !== 'undefined') return resolveAction;
        if (typeof calculateSpecificity !== 'undefined') return calculateSpecificity;
        if (typeof memoize !== 'undefined') return memoize;
        if (typeof retryAsync !== 'undefined') return retryAsync;
        if (typeof twoSum !== 'undefined') return twoSum;
        if (typeof matchRoute !== 'undefined') return matchRoute;
        if (typeof euclideanDistance !== 'undefined') return euclideanDistance;
        if (typeof calculateMetrics !== 'undefined') return calculateMetrics;
        throw new Error('Required function was not declared or found in scope.');
      `);

      const userFn = userFactory();

      for (const tc of activeChallenge.testCases) {
        try {
          const testRunner = new Function('fn', `return (${tc.testFnString})(fn);`);
          const passed = await Promise.resolve(testRunner(userFn));
          results.push({
            passed: Boolean(passed),
            inputDesc: tc.inputDesc,
            expectedDesc: tc.expectedDesc,
          });
        } catch (tcErr: unknown) {
          results.push({
            passed: false,
            inputDesc: tc.inputDesc,
            expectedDesc: tc.expectedDesc,
            error: tcErr instanceof Error ? tcErr.message : String(tcErr),
          });
        }
      }

      setTestResults(results);

      const allPassed = results.length > 0 && results.every((r) => r.passed);
      if (allPassed) {
        onCompleteChallenge(activeChallenge.id);
      } else {
        soundFx.playError();
      }
    } catch (evalErr: unknown) {
      soundFx.playError();
      setTestResults([
        {
          passed: false,
          inputDesc: 'Syntax/Compilation Check',
          expectedDesc: 'Valid executable JavaScript code',
          error: evalErr instanceof Error ? evalErr.message : String(evalErr),
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const isChallengeDone = activeChallenge ? progress.completedChallengeIds.includes(activeChallenge.id) : false;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
          <span>Technical Screening Simulator</span>
          <span aria-hidden="true">·</span>
          <span>Fill-in-the-Blank & Algorithmic Sandbox</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Interactive Code Lab
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Solve real internship coding assessment problems across all 8 weeks. Write, debug, and execute your code against automated unit tests.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Challenge Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold">Assessment Problems ({allChallenges.length})</span>
            <span className="font-mono text-cyan-400">{progress.completedChallengeIds.length} Solved</span>
          </div>

          <div className="space-y-2">
            {allChallenges.map((c) => {
              const isSelected = c.id === activeChallenge?.id;
              const isSolved = progress.completedChallengeIds.includes(c.id);

              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectChallenge(c)}
                  className={`w-full text-left p-4 rounded-xl border transition-all space-y-1.5 ${
                    isSelected
                      ? 'border-cyan-500 bg-slate-900 text-white shadow-lg shadow-cyan-950/30'
                      : 'border-slate-800 bg-slate-900/30 text-slate-300 hover:bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-400">Week {c.weekNumber}</span>
                    {isSolved ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-400 font-mono">+100 XP</span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {c.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Difficulty: {c.difficulty}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Code Editor & Test Output */}
        {activeChallenge && (
          <div className="lg:col-span-8 space-y-5">
            {/* Challenge Description Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="text-cyan-400 font-semibold">Week {activeChallenge.weekNumber} Challenge</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeChallenge.difficulty}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {activeChallenge.title}
                  </h3>
                </div>

                {isChallengeDone && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                    Challenge Passed
                  </span>
                )}
              </div>

              {/* Instructions */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeChallenge.instructions}
              </p>

              {/* Hint Accordion */}
              <div className="pt-1">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Mentor Hint' : 'Need a Hint?'}</span>
                </button>
                {showHint && (
                  <div className="mt-2 p-3 rounded-lg border border-amber-500/20 bg-amber-950/20 text-xs text-amber-200">
                    {activeChallenge.solutionHint}
                  </div>
                )}
              </div>
            </div>

            {/* Code Workspace Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden space-y-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>solution.{activeChallenge.language === 'python' ? 'py' : 'js'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetCode}
                    title="Reset to starter code"
                    className="p-1.5 text-slate-400 hover:text-white rounded border border-slate-800 bg-slate-900 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleRunTests}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{isRunning ? 'Evaluating...' : 'Run & Validate Tests'}</span>
                  </button>
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                className="w-full bg-slate-950 p-4 font-mono text-xs text-slate-200 focus:outline-none resize-y selection:bg-cyan-500/30"
                spellCheck={false}
              />
            </div>

            {/* Test Results Output Panel */}
            {testResults && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">Test Case Suite Results</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {testResults.filter((r) => r.passed).length}/{testResults.length} Passing
                  </span>
                </div>

                <div className="space-y-2">
                  {testResults.map((res, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-xs space-y-1 ${
                        res.passed
                          ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                          : 'border-rose-500/30 bg-rose-950/20 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="flex items-center gap-1.5">
                          {res.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                          <span>Test Case #{i + 1}: {res.inputDesc}</span>
                        </span>
                        <span className="font-mono text-[11px] uppercase">
                          {res.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Expected: <span className="font-mono text-slate-300">{res.expectedDesc}</span>
                      </div>
                      {res.error && (
                        <div className="text-[11px] font-mono text-rose-400 pt-1">
                          Runtime Error: {res.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
