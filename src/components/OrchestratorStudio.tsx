import React, { useState } from "react";
import {
  Bot,
  Play,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  Eye,
  Send,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap,
} from "lucide-react";
import { AutonomyLevel, ReelItem, TraceRecord, TraceStep } from "../types";
import { ReelPreviewPlayer } from "./ReelPreviewPlayer";

interface OrchestratorStudioProps {
  onRunGoal: (goal: string, customTopic?: string, targetAudience?: string) => Promise<any>;
  isRunning: boolean;
  activeReel: ReelItem | null;
  activeTrace: TraceRecord | null;
  autonomyLevel: AutonomyLevel;
  onOpenApproval: (reel: ReelItem) => void;
  geminiLive: boolean;
}

export const OrchestratorStudio: React.FC<OrchestratorStudioProps> = ({
  onRunGoal,
  isRunning,
  activeReel,
  activeTrace,
  autonomyLevel,
  onOpenApproval,
  geminiLive,
}) => {
  const [goalInput, setGoalInput] = useState(
    "Create 4 technology Reels this week and optimize future content based on performance."
  );
  const [customTopic, setCustomTopic] = useState("Autonomous Multi-Agent Systems & Vector DBs");
  const [targetAudience, setTargetAudience] = useState("Software Engineers, AI Builders, Tech Founders");
  const [expandedStepIndex, setExpandedStepIndex] = useState<number | null>(null);

  const presetGoals = [
    {
      title: "Weekly Tech Batch",
      goal: "Create 4 technology Reels this week and optimize future content based on performance.",
      topic: "Autonomous Multi-Agent Architecture",
    },
    {
      title: "Vector DB Performance",
      goal: "Break down why embedded SQLite + Vector extensions beat expensive cloud clusters in 2026.",
      topic: "Local-First AI Databases",
    },
    {
      title: "Contrarian AI Coding Reality",
      goal: "Hook software engineers with why single-prompt AI is dead and multi-agent DAGs are the real production standard.",
      topic: "Agentic Engineering Patterns",
    },
    {
      title: "Sub-100ms Inference Stack",
      goal: "Demonstrate high-speed edge AI architectures for real-time applications.",
      topic: "Edge Computing & Low Latency AI",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim() || isRunning) return;
    onRunGoal(goalInput, customTopic, targetAudience);
  };

  return (
    <div className="space-y-4 text-[#E0E0E0]">
      {/* Studio Banner & Goal Input */}
      <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#2A2A2C] gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-sm bg-[#FF3E00]/10 border border-[#FF3E00]/30 flex items-center justify-center text-[#FF3E00]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white font-mono">
                  AI Reel Creator
                </h2>
                <span className="px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] text-emerald-400 text-[10px] font-mono border border-[#2A2A2C]">
                  READY
                </span>
              </div>
              <p className="text-xs text-[#888888]">
                Type your topic or choose an idea below. AI writes the hook, script, visual cues, and hashtags.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[11px] text-[#888888] font-mono">Ideas:</span>
            <div className="flex flex-wrap gap-1">
              {presetGoals.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setGoalInput(p.goal);
                    setCustomTopic(p.topic);
                  }}
                  className="px-2.5 py-1 rounded-xs bg-[#161618] hover:bg-[#1F1F22] text-[#E0E0E0] text-[11px] border border-[#2A2A2C] hover:border-[#FF3E00]/40 transition cursor-pointer"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Input Form */}
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <div>
            <label className="text-xs font-semibold text-[#C0C0C0] block mb-1">
              What do you want this Reel to be about?
            </label>
            <div className="relative">
              <textarea
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                rows={2}
                placeholder="e.g., Explain the top 3 productivity habits for founders in 2026..."
                className="w-full bg-[#0F0F10] border border-[#2A2A2C] focus:border-[#FF3E00] rounded-xs p-3 text-xs text-white placeholder-[#555555] focus:outline-hidden transition resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div>
              <label className="text-xs text-[#888888] block mb-1">Specific Topic / Tag:</label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. AI Automation, Tech Tips"
                className="w-full bg-[#0F0F10] border border-[#2A2A2C] rounded-xs px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#FF3E00]"
              />
            </div>
            <div>
              <label className="text-xs text-[#888888] block mb-1">Target Audience:</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Creators, Developers, Founders"
                className="w-full bg-[#0F0F10] border border-[#2A2A2C] rounded-xs px-3 py-2 text-xs text-white focus:outline-hidden focus:border-[#FF3E00]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3 border-t border-[#2A2A2C]">
            <div className="flex items-center space-x-1.5 text-xs text-[#888888]">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>You always get to review and approve the Reel before anything posts.</span>
            </div>

            <button
              type="submit"
              disabled={isRunning}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xs font-bold text-xs uppercase tracking-wider font-mono shadow-xs transition cursor-pointer ${
                isRunning
                  ? "bg-[#2A2A2C] text-[#666666] cursor-not-allowed"
                  : "bg-[#FF3E00] hover:bg-[#E03700] text-white"
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Generating Reel...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Reel Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Real-time Agent Execution Trace Visualizer (DAG Timeline) */}
      {activeTrace && (
        <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-4 shadow-xs text-[#E0E0E0]">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#2A2A2C]">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-[#38bdf8]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Agent Execution Trace & Timeline
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-[#888888]">
              <span>ID: {activeTrace.id}</span>
              <span>•</span>
              <span>{(activeTrace.durationMs / 1000).toFixed(2)}s</span>
              <span className="px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] text-emerald-400 border border-[#2A2A2C] font-bold uppercase">
                {activeTrace.status}
              </span>
            </div>
          </div>

          {/* Trace Steps Visual Timeline */}
          <div className="mt-3 space-y-2">
            {activeTrace.steps?.map((step: TraceStep, index: number) => {
              const isExpanded = expandedStepIndex === index;
              const isApproval = step.status === "needs_approval";
              const isCompleted = step.status === "completed";

              return (
                <div
                  key={index}
                  className={`rounded-xs border transition ${
                    isApproval
                      ? "bg-[#161618] border-amber-500/80 shadow-xs"
                      : isCompleted
                      ? "bg-[#161618] border-[#2A2A2C] hover:border-[#444446]"
                      : "bg-[#0F0F10] border-[#2A2A2C]"
                  }`}
                >
                  <div
                    onClick={() => setExpandedStepIndex(isExpanded ? null : index)}
                    className="p-2.5 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div
                        className={`h-6 w-6 rounded-xs flex items-center justify-center text-[10px] font-mono font-bold ${
                          isApproval
                            ? "bg-amber-500 text-black animate-pulse"
                            : isCompleted
                            ? "bg-[#1A1A1C] text-emerald-400 border border-emerald-800"
                            : "bg-[#1A1A1C] text-[#38bdf8]"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold text-[#FF3E00] font-mono">
                            [{step.agent}]
                          </span>
                          <span className="text-xs font-semibold text-white">{step.step}</span>
                        </div>
                        <p className="text-[10px] text-[#888888] mt-0.5">{step.detail}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-mono text-[#666666]">
                        {new Date(step.timestamp).toLocaleTimeString()}
                      </span>
                      {step.data && (
                        <span className="text-[9px] text-[#38bdf8] bg-[#0F0F10] px-1.5 py-0.2 rounded-xs border border-[#2A2A2C] font-mono flex items-center space-x-1">
                          <Code2 className="h-2.5 w-2.5" />
                          <span>Payload</span>
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5 text-[#888888]" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-[#888888]" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Payload Inspection */}
                  {isExpanded && step.data && (
                    <div className="p-2.5 bg-[#0F0F10] border-t border-[#2A2A2C] rounded-b-xs">
                      <div className="flex items-center justify-between text-[9px] text-[#888888] mb-1 font-mono">
                        <span>Agent Output Schema:</span>
                        <span className="text-emerald-400">JSON Strict</span>
                      </div>
                      <pre className="text-[10px] font-mono text-[#38bdf8] bg-[#0A0A0B] p-2.5 rounded-xs border border-[#2A2A2C] overflow-x-auto max-h-56 scrollbar-thin">
                        {JSON.stringify(step.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Generated Reel Preview & Human Approval Interceptor Callout */}
      {activeReel && (
        <div className="space-y-3.5">
          {activeReel.status === "needs_approval" && (
            <div className="bg-[#161618] border-l-4 border-l-amber-500 border border-[#2A2A2C] rounded-sm p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center space-x-3 text-left">
                <div className="h-8 w-8 rounded-xs bg-amber-500 flex items-center justify-center text-black font-bold shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">
                    Your Reel is Ready for Review!
                  </h4>
                  <p className="text-xs text-[#C0C0C0] mt-0.5">
                    Quality score: <strong>{activeReel.qualityScore?.overall}/100</strong>. Review the script and video cues below, then approve to schedule or post.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenApproval(activeReel)}
                className="w-full sm:w-auto px-4 py-2 rounded-xs bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-xs transition cursor-pointer whitespace-nowrap"
              >
                Approve & Post Reel
              </button>
            </div>
          )}

          {/* Interactive Player */}
          <ReelPreviewPlayer
            reel={activeReel}
            onApprove={() => onOpenApproval(activeReel)}
          />
        </div>
      )}
    </div>
  );
};
