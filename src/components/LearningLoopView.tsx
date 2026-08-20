import React, { useState } from "react";
import {
  Sparkles,
  TrendingUp,
  AlertOctagon,
  Lightbulb,
  Plus,
  Zap,
  CheckCircle2,
  Clock,
  RefreshCw,
  Sliders,
  Award,
} from "lucide-react";
import { LearningItem, WeeklyAnalysisData } from "../types";

interface LearningLoopViewProps {
  learnings: LearningItem[];
  onRunWeeklyLearning: () => Promise<any>;
  onAddLearning: (learning: Partial<LearningItem>) => Promise<any>;
  isAnalyzing: boolean;
  weeklyAnalysis: WeeklyAnalysisData | null;
}

export const LearningLoopView: React.FC<LearningLoopViewProps> = ({
  learnings,
  onRunWeeklyLearning,
  onAddLearning,
  isAnalyzing,
  weeklyAnalysis,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPattern, setNewPattern] = useState("");
  const [newCategory, setNewCategory] = useState<any>("hooks");
  const [newImpact, setNewImpact] = useState("");
  const [newAction, setNewAction] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPattern.trim()) return;
    await onAddLearning({
      pattern: newPattern,
      category: newCategory,
      impact: newImpact || "+25% engagement",
      recommendedAction: newAction || "Apply in upcoming script generation",
    });
    setNewPattern("");
    setNewImpact("");
    setNewAction("");
    setShowAddModal(false);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "hooks":
        return { label: "Winning Hook", bg: "bg-[#1A1A1C] text-[#38bdf8] border-[#2A2A2C]" };
      case "topics":
        return { label: "Authority Topic", bg: "bg-[#1A1A1C] text-[#FF3E00] border-[#2A2A2C]" };
      case "weak_topics":
        return { label: "Weak Pattern", bg: "bg-[#1A1112] text-rose-400 border-rose-800" };
      case "duration":
        return { label: "Pacing Metric", bg: "bg-[#1A1A1C] text-emerald-400 border-[#2A2A2C]" };
      case "strategy_update":
        return { label: "Strategy Update", bg: "bg-[#1A1A1C] text-amber-400 border-[#2A2A2C]" };
      default:
        return { label: "Pattern", bg: "bg-[#1A1A1C] text-[#888888] border-[#2A2A2C]" };
    }
  };

  return (
    <div className="space-y-4 text-[#E0E0E0]">
      {/* Top Banner with Weekly Learning Synthesis Trigger */}
      <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#2A2A2C] gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xs bg-[#1A1A1C] border border-[#2A2A2C] flex items-center justify-center text-[#FF3E00]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Closed-Loop Learning Memory
                </h2>
                <span className="px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] text-emerald-400 border border-[#2A2A2C] text-[9px] font-mono font-bold uppercase">
                  Self-Optimizing Store
                </span>
              </div>
              <p className="text-[10px] text-[#888888] font-mono">
                Empirical knowledge base derived from real retention graphs, drop-offs, and A/B experiments.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xs bg-[#1A1A1C] hover:bg-[#222226] text-[#C0C0C0] text-xs font-semibold border border-[#2A2A2C] transition cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              <span>Add Empirical Rule</span>
            </button>

            <button
              onClick={onRunWeeklyLearning}
              disabled={isAnalyzing}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xs bg-[#FF3E00] hover:bg-[#E03700] text-white text-xs font-bold shadow-xs transition cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Zap className="h-3 w-3" />
                  <span>Run Learning Loop</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Weekly Strategy Synthesis Insight (If generated) */}
        {weeklyAnalysis && (
          <div className="mt-3 p-3 bg-[#161618] border border-[#2A2A2C] rounded-xs font-mono">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5 uppercase">
                <Award className="h-3.5 w-3.5" />
                <span>Weekly Executive Synthesis: Next 7-Day Roadmap</span>
              </span>
              <span className="text-[10px] text-[#888888]">
                Confidence: {(weeklyAnalysis.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-[#C0C0C0] leading-relaxed mb-2.5">
              {weeklyAnalysis.weeklySummary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="bg-[#0F0F10] p-2 rounded-xs border border-[#2A2A2C]">
                <span className="text-[9px] font-bold text-emerald-400 uppercase block mb-0.5">
                  ⭐ Top Winning Pattern:
                </span>
                <p className="text-white text-[11px]">{weeklyAnalysis.topWinningPattern}</p>
              </div>
              <div className="bg-[#0F0F10] p-2 rounded-xs border border-[#2A2A2C]">
                <span className="text-[9px] font-bold text-rose-400 uppercase block mb-0.5">
                  ⚠️ Weak Spot to Deprecate:
                </span>
                <p className="text-white text-[11px]">{weeklyAnalysis.weakSpotToAvoid}</p>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#2A2A2C]">
              <span className="text-[9px] text-[#888888] uppercase font-bold block mb-1">
                Priorities for Next Content Batch:
              </span>
              <div className="flex flex-wrap gap-1">
                {weeklyAnalysis.nextWeekPriorities?.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-xs bg-[#0F0F10] border border-[#2A2A2C] text-[10px] text-[#38bdf8] font-medium"
                  >
                    • {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Memory Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {learnings.map((item) => {
          const badge = getCategoryBadge(item.category);
          const isAvoid = item.category === "weak_topics" || item.status === "avoid";

          return (
            <div
              key={item.id}
              className={`bg-[#121214] border rounded-sm p-3.5 shadow-xs flex flex-col justify-between transition ${
                isAvoid
                  ? "border-rose-900/80 bg-[#140D0E]"
                  : "border-[#2A2A2C] hover:border-[#444446]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded-xs border ${badge.bg}`}
                  >
                    {badge.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#888888]">
                    Confidence: {(item.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white font-mono mt-0.5">{item.pattern}</h3>

                <div className="bg-[#0F0F10] p-2 rounded-xs border border-[#2A2A2C] my-2 text-xs font-mono space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#666666] text-[10px]">Empirical Impact:</span>
                    <span className={isAvoid ? "text-rose-400 font-bold text-[11px]" : "text-emerald-400 font-bold text-[11px]"}>
                      {item.impact}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#666666] text-[10px]">Reels Sample Size:</span>
                    <span className="text-[#A0A0A0] text-[10px]">{item.samplesCount} analyzed</span>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-[9px] text-[#666666] font-bold font-mono uppercase block mb-0.5">
                    Recommended Action:
                  </span>
                  <p className="text-[11px] text-[#38bdf8] font-mono">
                    "{item.recommendedAction}"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[9px] text-[#666666] mt-3 pt-1.5 border-t border-[#2A2A2C] font-mono">
                <span>ID: {item.id}</span>
                <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Learning Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm max-w-lg w-full p-4 shadow-2xl text-[#E0E0E0] font-mono">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
              Add Custom Learning Rule to Memory
            </h3>

            <form onSubmit={handleCreate} className="space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] text-[#888888] uppercase block mb-1">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-1.5 text-xs text-white focus:outline-hidden focus:border-[#FF3E00]"
                >
                  <option value="hooks">Winning Hook</option>
                  <option value="topics">High-Authority Topic</option>
                  <option value="duration">Pacing & Duration</option>
                  <option value="weak_topics">Weak Pattern (Avoid)</option>
                  <option value="cta">CTA Trigger</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#888888] uppercase block mb-1">Observed Pattern:</label>
                <input
                  type="text"
                  placeholder="e.g. Split-screen live code demo vs static slide"
                  value={newPattern}
                  onChange={(e) => setNewPattern(e.target.value)}
                  className="w-full bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-1.5 text-xs text-white focus:outline-hidden focus:border-[#FF3E00]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#888888] uppercase block mb-1">Measured Impact:</label>
                <input
                  type="text"
                  placeholder="e.g. +38% watch completion"
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value)}
                  className="w-full bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-1.5 text-xs text-white focus:outline-hidden focus:border-[#FF3E00]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#888888] uppercase block mb-1">Recommended Action:</label>
                <textarea
                  placeholder="e.g. Prioritize dynamic terminal shaders for all code tutorials"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-1.5 text-xs text-white focus:outline-hidden focus:border-[#FF3E00]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2.5 border-t border-[#2A2A2C]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-2.5 py-1 rounded-xs text-[10px] text-[#888888] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-xs bg-[#FF3E00] hover:bg-[#E03700] text-white font-bold text-xs cursor-pointer"
                >
                  Save to Knowledge Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
