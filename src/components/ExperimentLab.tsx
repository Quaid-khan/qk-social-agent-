import React, { useState } from "react";
import {
  FlaskConical,
  Plus,
  TrendingUp,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { ExperimentItem } from "../types";

interface ExperimentLabProps {
  experiments: ExperimentItem[];
  onCreateExperiment: (exp: Partial<ExperimentItem>) => Promise<any>;
}

export const ExperimentLab: React.FC<ExperimentLabProps> = ({
  experiments,
  onCreateExperiment,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [variantA, setVariantA] = useState("");
  const [variantB, setVariantB] = useState("");
  const [metric, setMetric] = useState("3-Second Hook Retention Rate");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !hypothesis.trim()) return;
    await onCreateExperiment({
      title,
      hypothesis,
      variantA,
      variantB,
      metric,
    });
    setTitle("");
    setHypothesis("");
    setVariantA("");
    setVariantB("");
    setShowModal(false);
  };

  return (
    <div className="space-y-4 text-[#E0E0E0]">
      {/* Header Banner */}
      <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#2A2A2C] gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xs bg-[#1A1A1C] border border-[#2A2A2C] flex items-center justify-center text-[#FF3E00]">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  A/B Testing & Experimentation Lab
                </h2>
                <span className="px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] text-[#FF3E00] border border-[#2A2A2C] text-[9px] font-mono font-bold uppercase">
                  Hypothesis Engine
                </span>
              </div>
              <p className="text-[10px] text-[#888888] font-mono">
                Rigorous side-by-side experiments on hooks, video durations, pacing, and keyword CTAs.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xs bg-[#FF3E00] hover:bg-[#E03700] text-white text-xs font-bold font-mono shadow-xs transition cursor-pointer"
          >
            <Plus className="h-3 w-3" />
            <span>Launch A/B Test</span>
          </button>
        </div>

        {/* Quick Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs font-mono">
          <div className="bg-[#0F0F10] p-2 rounded-xs border border-[#2A2A2C]">
            <span className="text-[9px] text-[#888888] uppercase block">Total Experiments</span>
            <span className="text-sm font-bold text-white">{experiments.length}</span>
          </div>
          <div className="bg-[#0F0F10] p-2 rounded-xs border border-[#2A2A2C]">
            <span className="text-[9px] text-[#888888] uppercase block">Completed Tests</span>
            <span className="text-sm font-bold text-emerald-400">
              {experiments.filter((e) => e.status === "completed").length}
            </span>
          </div>
          <div className="bg-[#0F0F10] p-2 rounded-xs border border-[#2A2A2C]">
            <span className="text-[9px] text-[#888888] uppercase block">Active Testing Flights</span>
            <span className="text-sm font-bold text-[#38bdf8]">
              {experiments.filter((e) => e.status === "running").length}
            </span>
          </div>
          <div className="bg-[#0F0F10] p-2 rounded-xs border border-[#2A2A2C]">
            <span className="text-[9px] text-[#888888] uppercase block">Avg Lift Generated</span>
            <span className="text-sm font-bold text-[#FF3E00]">+48.2%</span>
          </div>
        </div>
      </div>

      {/* Experiments Cards Grid */}
      <div className="space-y-3">
        {experiments.map((exp) => {
          const isCompleted = exp.status === "completed";

          return (
            <div
              key={exp.id}
              className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-3.5 shadow-xs hover:border-[#444446] transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#2A2A2C] gap-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-1.5 py-0.2 rounded-xs text-[9px] font-mono font-bold uppercase border ${
                      isCompleted
                        ? "bg-[#1A1A1C] text-emerald-400 border-emerald-800"
                        : "bg-[#1A1A1C] text-amber-400 border-amber-800 animate-pulse"
                    }`}
                  >
                    {exp.status}
                  </span>
                  <h3 className="text-xs font-bold text-white font-mono">{exp.title}</h3>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-[#888888] font-mono">
                  <span>Metric: <strong className="text-[#C0C0C0]">{exp.metric}</strong></span>
                  <span>•</span>
                  <span>{exp.date}</span>
                </div>
              </div>

              {/* Hypothesis */}
              <div className="my-2 text-xs font-mono">
                <span className="text-[#666666] font-bold uppercase text-[9px] block mb-0.5">
                  Hypothesis:
                </span>
                <p className="text-[#A0A0A0] text-[11px]">"{exp.hypothesis}"</p>
              </div>

              {/* Variants A vs B Comparison Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-2.5">
                {/* Variant A */}
                <div className="bg-[#0F0F10] p-2.5 rounded-xs border border-[#2A2A2C]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#38bdf8]">Variant A (Baseline)</span>
                    {exp.winner.includes("Variant A") && (
                      <span className="px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] text-emerald-400 text-[9px] font-mono font-bold border border-emerald-800">
                        WINNER 🏆
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#C0C0C0] font-mono mb-1.5">"{exp.variantA}"</p>
                  <div className="pt-1.5 border-t border-[#2A2A2C] text-xs font-mono">
                    <span className="text-[9px] text-[#666666] block">Result:</span>
                    <span className="font-bold text-white text-[11px]">{exp.resultA}</span>
                  </div>
                </div>

                {/* Variant B */}
                <div className="bg-[#0F0F10] p-2.5 rounded-xs border border-[#2A2A2C]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#FF3E00]">Variant B (Challenger)</span>
                    {exp.winner.includes("Variant B") && (
                      <span className="px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] text-emerald-400 text-[9px] font-mono font-bold border border-emerald-800">
                        WINNER 🏆
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#C0C0C0] font-mono mb-1.5">"{exp.variantB}"</p>
                  <div className="pt-1.5 border-t border-[#2A2A2C] text-xs font-mono">
                    <span className="text-[9px] text-[#666666] block">Result:</span>
                    <span className="font-bold text-white text-[11px]">{exp.resultB}</span>
                  </div>
                </div>
              </div>

              {/* Conclusion Banner */}
              <div className="p-2 bg-[#0F0F10] border border-[#2A2A2C] rounded-xs flex items-center space-x-1.5 text-xs font-mono">
                <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="text-[#888888] text-[10px]">Conclusion:</span>
                <strong className="text-[#E0E0E0] text-[10px] font-medium">{exp.conclusion}</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Experiment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm max-w-lg w-full p-4 shadow-2xl text-[#E0E0E0] font-mono">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
              Launch New A/B Experiment
            </h3>

            <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] text-[#888888] uppercase block mb-1">Experiment Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Code walkthrough vs Bento listicle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-1.5 text-xs text-white focus:outline-hidden focus:border-[#FF3E00]"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#888888] uppercase block mb-1">Hypothesis:</label>
                <textarea
                  placeholder="e.g. Hands-on terminal shaders increase bookmark saves by >30%..."
                  value={hypothesis}
                  onChange={(e) => setHypothesis(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-1.5 text-xs text-white focus:outline-hidden focus:border-[#FF3E00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#888888] uppercase block mb-1">Variant A (Baseline):</label>
                  <input
                    type="text"
                    placeholder="e.g. Standard question hook"
                    value={variantA}
                    onChange={(e) => setVariantA(e.target.value)}
                    className="w-full bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-1.5 text-xs text-white focus:outline-hidden focus:border-[#FF3E00]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#888888] uppercase block mb-1">Variant B (Challenger):</label>
                  <input
                    type="text"
                    placeholder="e.g. Shock claim"
                    value={variantB}
                    onChange={(e) => setVariantB(e.target.value)}
                    className="w-full bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-1.5 text-xs text-white focus:outline-hidden focus:border-[#FF3E00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#888888] uppercase block mb-1">Primary Metric:</label>
                <select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                  className="w-full bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-1.5 text-xs text-white focus:outline-hidden focus:border-[#FF3E00]"
                >
                  <option value="3-Second Hook Retention Rate">3-Second Hook Retention Rate</option>
                  <option value="Watch Completion Rate">Watch Completion Rate</option>
                  <option value="Comments per 1k Views (Keyword DM)">Comments per 1k Views (Keyword DM)</option>
                  <option value="Save / Bookmark Ratio">Save / Bookmark Ratio</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2.5 border-t border-[#2A2A2C]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-2.5 py-1 rounded-xs text-[10px] text-[#888888] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-xs bg-[#FF3E00] hover:bg-[#E03700] text-white font-bold text-xs cursor-pointer"
                >
                  Start Flight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
