import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Cpu, 
  Sparkles, 
  ArrowRight,
  Filter,
  Check,
  Calendar
} from 'lucide-react';
import { LEARNING_PATH_SYLLABUS } from '../data/learningPathSyllabus';
import { SyllabusPart, SyllabusModule, SyllabusItem, UserProgress, ActiveTab } from '../types';
import { soundFx } from '../services/soundEffects';

interface SyllabusMasterViewProps {
  progress: UserProgress;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectWeek: (weekNum: number) => void;
  onToggleSyllabusItem?: (itemId: string) => void;
}

export const SyllabusMasterView: React.FC<SyllabusMasterViewProps> = ({
  progress,
  setActiveTab,
  onSelectWeek,
  onToggleSyllabusItem,
}) => {
  const [selectedPartFilter, setSelectedPartFilter] = useState<'all' | 'part-1' | 'part-2' | 'part-3'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'mod-1': true,
    'mod-2': true,
    'mod-8': true,
    'mod-11': true,
  });

  const toggleModule = (modId: string) => {
    soundFx.playClick();
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const expandAll = () => {
    soundFx.playClick();
    const allExpanded: Record<string, boolean> = {};
    LEARNING_PATH_SYLLABUS.forEach((p) => {
      p.modules.forEach((m) => {
        allExpanded[m.id] = true;
      });
    });
    setExpandedModules(allExpanded);
  };

  const collapseAll = () => {
    soundFx.playClick();
    setExpandedModules({});
  };

  // Filtered parts and modules
  const filteredParts = useMemo(() => {
    return LEARNING_PATH_SYLLABUS.filter((part) => {
      if (selectedPartFilter !== 'all' && part.id !== selectedPartFilter) return false;
      return true;
    }).map((part) => {
      const filteredModules = part.modules.map((mod) => {
        const filteredItems = mod.items.filter((item) => {
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return item.title.toLowerCase().includes(q) || item.code.toLowerCase().includes(q);
        });
        return {
          ...mod,
          items: filteredItems,
        };
      }).filter((mod) => {
        if (!searchQuery.trim()) return true;
        return mod.items.length > 0 || mod.title.toLowerCase().includes(searchQuery.toLowerCase());
      });

      return {
        ...part,
        modules: filteredModules,
      };
    }).filter((part) => part.modules.length > 0);
  }, [selectedPartFilter, searchQuery]);

  // Overall totals
  const totalItemsCount = 202;
  const part1ItemsCount = 103;
  const part2ItemsCount = 82;
  const part3ItemsCount = 17;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-cyan-400">
          <span>Complete 2-Month Learning Path (60 Days)</span>
          <span aria-hidden="true">·</span>
          <span>3 Parts · 15 Courses · 202 Total Items</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
          Comprehensive 2-Month Engineering Curriculum
        </h1>

        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          The verified master roadmap structured across Month 1 (Python, Computational Thinking, OOP & DSA) and Month 2 (Frontend Architecture, React Ecosystem, Backend APIs & Full-Stack AI).
        </p>

        {/* 3 Parts Quick Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
          {/* Part 1 */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedPartFilter('part-1');
            }}
            className={`text-left p-4 rounded-xl border transition-all space-y-2 ${
              selectedPartFilter === 'part-1'
                ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500/50'
                : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-cyan-400 font-bold">PART 1 (Month 1)</span>
              <span className="text-slate-400 font-mono">Weeks 1–4</span>
            </div>
            <div className="font-bold text-white text-sm">Python & Foundations</div>
            <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
              <span>7 Courses</span>
              <span className="font-mono text-cyan-300 font-semibold">{part1ItemsCount} Items</span>
            </div>
          </button>

          {/* Part 2 */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedPartFilter('part-2');
            }}
            className={`text-left p-4 rounded-xl border transition-all space-y-2 ${
              selectedPartFilter === 'part-2'
                ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500/50'
                : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-emerald-400 font-bold">PART 2 (Month 2)</span>
              <span className="text-slate-400 font-mono">Weeks 5–7</span>
            </div>
            <div className="font-bold text-white text-sm">Frontend & React</div>
            <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
              <span>6 Courses</span>
              <span className="font-mono text-emerald-300 font-semibold">{part2ItemsCount} Items</span>
            </div>
          </button>

          {/* Part 3 */}
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedPartFilter('part-3');
            }}
            className={`text-left p-4 rounded-xl border transition-all space-y-2 ${
              selectedPartFilter === 'part-3'
                ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-500/50'
                : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-purple-400 font-bold">PART 3 (Month 2 Capstone)</span>
              <span className="text-slate-400 font-mono">Week 8</span>
            </div>
            <div className="font-bold text-white text-sm">Backend & APIs</div>
            <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
              <span>2 Courses</span>
              <span className="font-mono text-purple-300 font-semibold">{part3ItemsCount} Items</span>
            </div>
          </button>
        </div>
      </section>

      {/* Search & Filter Toolbar */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedPartFilter('all');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedPartFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Parts ({totalItemsCount})
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedPartFilter('part-1');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedPartFilter === 'part-1'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Part 1: Python ({part1ItemsCount})
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedPartFilter('part-2');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedPartFilter === 'part-2'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Part 2: Frontend ({part2ItemsCount})
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedPartFilter('part-3');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedPartFilter === 'part-3'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Part 3: Backend ({part3ItemsCount})
          </button>
        </div>

        {/* Search input & Expand controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search syllabus..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={expandAll}
              title="Expand All Modules"
              className="px-2.5 py-1.5 text-[11px] text-slate-400 hover:text-white rounded-lg border border-slate-800 bg-slate-900 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              title="Collapse All Modules"
              className="px-2.5 py-1.5 text-[11px] text-slate-400 hover:text-white rounded-lg border border-slate-800 bg-slate-900 transition-colors"
            >
              Collapse
            </button>
          </div>
        </div>
      </section>

      {/* Main Parts & Modules Catalog */}
      <section className="space-y-10">
        {filteredParts.map((part) => (
          <div key={part.id} className="space-y-4">
            {/* Part Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <span>Part {part.partNumber} Learning Path</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">{part.monthAllocation}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                  {part.title}
                </h2>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {part.totalCourses} Courses · {part.totalItems} Items
              </div>
            </div>

            {/* Modules Accordion List */}
            <div className="space-y-3">
              {part.modules.map((mod) => {
                const isExpanded = expandedModules[mod.id] ?? false;

                return (
                  <div
                    key={mod.id}
                    className="rounded-xl border border-slate-800/80 bg-slate-900/50 overflow-hidden transition-all"
                  >
                    {/* Module Accordion Header */}
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-900/90 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-mono text-cyan-400 font-bold">
                            Module {mod.moduleNumber}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-400">
                            Month {mod.monthNumber} (Mapped to Week {mod.weeksMapped.join(', ')})
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white">
                          {mod.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          {mod.items.length} items
                        </span>
                        <div className="p-1 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-400">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </button>

                    {/* Module Items Body */}
                    {isExpanded && (
                      <div className="border-t border-slate-800 bg-slate-950/60 p-4 sm:p-5 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {mod.items.map((item, idx) => {
                            const isAiInterval = item.type === 'ai-interval';
                            const isChecked = progress.completedSyllabusItemIds?.includes(item.id) ?? false;

                            return (
                              <div
                                key={item.id}
                                onClick={() => onToggleSyllabusItem && onToggleSyllabusItem(item.id)}
                                className={`p-3 rounded-lg border text-xs flex items-start gap-3 cursor-pointer transition-colors ${
                                  isChecked
                                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                                    : isAiInterval
                                    ? 'border-purple-500/30 bg-purple-950/20 text-purple-200 hover:border-purple-500/50'
                                    : 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleSyllabusItem && onToggleSyllabusItem(item.id);
                                  }}
                                  className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border shrink-0 transition-colors ${
                                    isChecked
                                      ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                                      : 'border-slate-700 bg-slate-950 text-transparent'
                                  }`}
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </button>

                                <span className="font-mono text-slate-500 shrink-0 font-bold">
                                  {String(idx + 1).padStart(2, '0')}
                                </span>

                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-mono font-semibold ${isChecked ? 'text-emerald-400' : isAiInterval ? 'text-purple-400' : 'text-cyan-400'}`}>
                                      {item.code}
                                    </span>
                                    {isAiInterval && (
                                      <span className="text-[10px] text-purple-300 bg-purple-950 px-1.5 py-0.2 rounded border border-purple-500/40">
                                        AI Interval
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-white font-medium leading-snug">
                                    {item.title}
                                  </div>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    soundFx.playClick();
                                    onSelectWeek(item.weekNumber);
                                    setActiveTab('curriculum');
                                  }}
                                  title={`Open Week ${item.weekNumber} Interactive Lesson`}
                                  className="shrink-0 p-1.5 text-slate-400 hover:text-cyan-400 rounded hover:bg-slate-800 transition-colors"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Module Quick Action footer */}
                        <div className="pt-3 flex justify-between items-center text-xs text-slate-400 border-t border-slate-900">
                          <span>Weeks Mapped: <strong className="text-white">Week {mod.weeksMapped.join(' & ')}</strong></span>
                          <button
                            onClick={() => {
                              soundFx.playClick();
                              onSelectWeek(mod.weeksMapped[0]);
                              setActiveTab('curriculum');
                            }}
                            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                          >
                            <span>Open Week {mod.weeksMapped[0]} Lessons</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
