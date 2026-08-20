import React, { useState } from "react";
import {
  Users,
  Eye,
  TrendingUp,
  Share2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Play,
  Bookmark,
  Heart,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AgentInfo, ReelItem, TelemetryState, TraceRecord } from "../types";

interface MasterDashboardProps {
  telemetry: TelemetryState;
  reels: ReelItem[];
  agents: AgentInfo[];
  traces: TraceRecord[];
  onSelectReel: (reel: ReelItem) => void;
  onOpenApproval: (reel: ReelItem) => void;
  onNavigateTab: (tab: string) => void;
  modelReady: boolean;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({
  telemetry,
  reels,
  agents,
  traces,
  onSelectReel,
  onOpenApproval,
  onNavigateTab,
  modelReady,
}) => {
  const [showSwarmDetails, setShowSwarmDetails] = useState(false);
  const scheduledReels = reels.filter((r) => r.status === "scheduled");
  const pendingApprovals = reels.filter((r) => r.status === "needs_approval");
  const publishedReels = reels.filter((r) => r.status === "published");

  return (
    <div className="space-y-4 text-[#E0E0E0]">
      {/* Quick Action Hero Banner */}
      <div className="bg-gradient-to-r from-[#1A1A1C] to-[#121214] border border-[#2A2A2C] rounded-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-[#FF3E00] flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
            QK
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-white font-mono">
                Instagram Manager ({telemetry.instagramAccount})
              </h2>
              <span className={`h-2 w-2 rounded-full ${telemetry.instagramConnected && modelReady ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-amber-400"}`} />
            </div>
            <p className="text-xs text-[#888888] mt-0.5">
              {telemetry.instagramConnected && modelReady ? "Your channel is ready for review-gated Reels, scheduling, publishing, and comment replies." : "Connect Instagram and configure a model to unlock Reel creation and live engagement."}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab("orchestrator")}
          className="w-full sm:w-auto px-4 py-2 rounded-xs bg-[#FF3E00] hover:bg-[#E03700] text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-xs shrink-0"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>+ Create New Reel</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Followers Card */}
        <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#888888]">
              {telemetry.instagramAccount} Audience
            </span>
            <div className="h-6 w-6 rounded-xs bg-[#1A1A1C] text-[#38bdf8] flex items-center justify-center border border-[#2A2A2C]">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <h3 className="text-xl font-bold text-white font-mono">
              {telemetry.followers.toLocaleString()}
            </h3>
            <div className="flex items-center space-x-1 mt-0.5 text-[10px] text-emerald-400 font-mono">
              <ArrowUpRight className="h-3 w-3" />
              <span>{telemetry.followers > 0 ? "Live audience metric" : "Connect Instagram to load audience data"}</span>
            </div>
          </div>
        </div>

        {/* 30d Reach */}
        <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#888888]">30-Day Total Reach</span>
            <div className="h-6 w-6 rounded-xs bg-[#1A1A1C] text-indigo-400 flex items-center justify-center border border-[#2A2A2C]">
              <Eye className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <h3 className="text-xl font-bold text-white font-mono">
              {telemetry.reach30d.toLocaleString()}
            </h3>
            <div className="flex items-center space-x-1 mt-0.5 text-[10px] text-emerald-400 font-mono">
              <ArrowUpRight className="h-3 w-3" />
              <span>{telemetry.reach30d > 0 ? "Live reach metric" : "No reach data yet"}</span>
            </div>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#888888]">Engagement Velocity</span>
            <div className="h-6 w-6 rounded-xs bg-[#1A1A1C] text-[#FF3E00] flex items-center justify-center border border-[#2A2A2C]">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <h3 className="text-xl font-bold text-white font-mono">{telemetry.engagementRate}</h3>
            <div className="flex items-center space-x-1 mt-0.5 text-[10px] text-[#38bdf8] font-mono">
              <span>{telemetry.engagementRate !== "0%" ? "Live engagement metric" : "No engagement data yet"}</span>
            </div>
          </div>
        </div>

        {/* System Reliability */}
        <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#888888]">Swarm Success Rate</span>
            <div className="h-6 w-6 rounded-xs bg-[#1A1A1C] text-emerald-400 flex items-center justify-center border border-[#2A2A2C]">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-1.5">
            <h3 className="text-xl font-bold text-white font-mono">
              {((telemetry.successfulWorkflows / (telemetry.totalRuns || 1)) * 100).toFixed(1)}%
            </h3>
            <div className="flex items-center space-x-1 mt-0.5 text-[10px] text-[#888888] font-mono">
              <span>{telemetry.totalRuns} Goals Decomposed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals Urgent Callout (If any) */}
      {pendingApprovals.length > 0 && (
        <div className="bg-[#161618] border-l-4 border-l-amber-500 border border-[#2A2A2C] rounded-sm p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-xs bg-amber-500 text-black flex items-center justify-center font-bold shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">
                {pendingApprovals.length} Reel(s) Require Human Approval
              </h4>
              <p className="text-[11px] text-[#C0C0C0] mt-0.5">
                Approval Gate hardlock active. Review generated 9:16 vertical renders before Meta publication.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenApproval(pendingApprovals[0])}
            className="px-3.5 py-1.5 rounded-sm bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer shrink-0"
          >
            Review Pending Reel
          </button>
        </div>
      )}

      {/* Agents Swarm Status Matrix (Clean Collapsible Accordion) */}
      <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-3.5 shadow-xs">
        <div
          onClick={() => setShowSwarmDetails(!showSwarmDetails)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center space-x-2">
            <Bot className="h-4 w-4 text-[#FF3E00]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              AI Swarm Status
            </h3>
            <span className={`h-1.5 w-1.5 rounded-full ${telemetry.instagramConnected && modelReady ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-amber-400"}`} />
            <span className={`text-[10px] font-mono font-bold ${telemetry.instagramConnected && modelReady ? "text-emerald-400" : "text-amber-300"}`}>{telemetry.instagramConnected && modelReady ? "7 NODES READY" : "SETUP REQUIRED"}</span>
          </div>

          <button className="flex items-center space-x-1 text-[11px] text-[#888888] hover:text-white font-mono">
            <span>{showSwarmDetails ? "Hide System Nodes" : "View System Nodes"}</span>
            {showSwarmDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {showSwarmDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#2A2A2C]">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`bg-[#161618] border-l-2 ${agent.status === "idle" ? "border-l-slate-600" : "border-l-emerald-500"} border border-[#2A2A2C] rounded-xs p-2.5 flex flex-col justify-between hover:border-[#444446] transition`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white font-mono">{agent.name}</span>
                    <div className="flex items-center space-x-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${agent.status === "idle" ? "bg-slate-600" : "bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]"}`} />
                      <span className={`text-[9px] font-mono font-semibold uppercase ${agent.status === "idle" ? "text-slate-500" : "text-emerald-400"}`}>
                        {agent.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-[#888888] leading-tight">{agent.role}</p>
                </div>

                <div className="flex items-center justify-between text-[9px] text-[#666666] mt-2 pt-1.5 border-t border-[#2A2A2C] font-mono">
                  <span>Active: {agent.lastActive}</span>
                  <span>Load: {agent.load}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two Column Section: Scheduled Content Queue & Top Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left Column: Scheduled & Draft Pipeline */}
        <div className="lg:col-span-7 bg-[#121214] border border-[#2A2A2C] rounded-sm p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#2A2A2C]">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-[#38bdf8]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Content Pipeline Queue</h3>
            </div>
            <button
              onClick={() => onNavigateTab("orchestrator")}
              className="text-[11px] font-mono font-semibold text-[#FF3E00] hover:text-[#ff6a38] flex items-center space-x-1 cursor-pointer"
            >
              <span>+ Create Reel</span>
            </button>
          </div>

          <div className="space-y-2 mt-3">
            {reels.length === 0 ? (
              <div className="text-center py-6 text-[#666666] text-xs font-mono">
                No Reels generated yet. {telemetry.instagramConnected && modelReady ? "Create your first Reel to begin." : "Complete Instagram and model setup to unlock creation."}
              </div>
            ) : (
              reels.slice(0, 4).map((reel) => {
                const isScheduled = reel.status === "scheduled";
                const isPublished = reel.status === "published";
                const isNeedsApproval = reel.status === "needs_approval";

                return (
                  <div
                    key={reel.id}
                    onClick={() => onSelectReel(reel)}
                    className="p-2.5 bg-[#161618] border border-[#2A2A2C] hover:border-[#444446] rounded-xs transition cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div
                        className={`h-7 w-7 rounded-xs flex items-center justify-center shrink-0 border ${
                          isPublished
                            ? "bg-[#1A1A1C] border-emerald-800 text-emerald-400"
                            : isScheduled
                            ? "bg-[#1A1A1C] border-indigo-800 text-indigo-400"
                            : "bg-[#1A1A1C] border-amber-800 text-amber-400"
                        }`}
                      >
                        <Play className="h-3.5 w-3.5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[8px] font-mono font-bold uppercase px-1 py-0.2 rounded-xs ${
                              isPublished
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : isScheduled
                                ? "bg-indigo-950 text-indigo-400 border border-indigo-800"
                                : "bg-amber-950 text-amber-400 border border-amber-800"
                            }`}
                          >
                            {reel.status.replace("_", " ")}
                          </span>
                          <span className="text-[10px] text-[#888888] font-mono">
                            {reel.duration}s
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate mt-0.5">
                          {reel.title}
                        </h4>
                        <p className="text-[10px] text-[#888888] truncate">
                          "{reel.script.hook}"
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 text-xs">
                      {isNeedsApproval ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenApproval(reel);
                          }}
                          className="px-2 py-1 rounded-xs bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-[10px] uppercase cursor-pointer"
                        >
                          Review
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-[#888888] block">
                          {new Date(reel.publishDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Top Performing Content & Retention Evidence */}
        <div className="lg:col-span-5 bg-[#121214] border border-[#2A2A2C] rounded-sm p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#2A2A2C]">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">Top Content Leaderboard</h3>
            </div>
            <button
              onClick={() => onNavigateTab("learning")}
              className="text-[11px] font-mono text-[#888888] hover:text-white cursor-pointer"
            >
              Learning Loop →
            </button>
          </div>

          <div className="space-y-2 mt-3">
            {publishedReels.length === 0 ? (
              <div className="text-center py-6 text-[#666666] text-xs font-mono">
                No published analytics data yet.
              </div>
            ) : (
              publishedReels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => onSelectReel(reel)}
                  className="p-2.5 bg-[#161618] border border-[#2A2A2C] rounded-xs hover:border-[#444446] transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white truncate">{reel.title}</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] text-[#38bdf8] border border-[#2A2A2C]">
                      Retention: {reel.retentionScore}%
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] text-[#888888] mt-1.5 pt-1.5 border-t border-[#2A2A2C] font-mono">
                    <div>
                      <span className="block text-[#666666]">Views</span>
                      <strong className="text-white">
                        {reel.views?.toLocaleString() || "0"}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[#666666]">Likes</span>
                      <strong className="text-[#FF3E00]">{reel.likes || 0}</strong>
                    </div>
                    <div>
                      <span className="block text-[#666666]">Saves</span>
                      <strong className="text-amber-400">{reel.saves || 0}</strong>
                    </div>
                    <div>
                      <span className="block text-[#666666]">Comments</span>
                      <strong className="text-[#38bdf8]">{reel.comments || 0}</strong>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
