import React from "react";
import {
  Bot,
  Activity,
  ShieldCheck,
  Zap,
  Sparkles,
  Calendar,
  Layers,
  FlaskConical,
  MessageSquare,
  FileText,
  Sliders,
  Instagram,
  CheckCircle2,
} from "lucide-react";
import { AutonomyLevel, TelemetryState } from "../types";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  telemetry: TelemetryState;
  onAutonomyChange: (level: AutonomyLevel) => void;
  onRunDailyBriefing: () => void;
  onOpenAccountModal: () => void;
  pendingApprovalsCount: number;
  geminiLive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  telemetry,
  onAutonomyChange,
  onRunDailyBriefing,
  onOpenAccountModal,
  pendingApprovalsCount,
  geminiLive,
}) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Layers },
    { id: "orchestrator", label: "Create Reels", icon: Sparkles, badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined },
    { id: "reels", label: "Schedule & Library", icon: Calendar },
    { id: "engagement", label: "Comments & DMs", icon: MessageSquare },
    { id: "learning", label: "Insights & Growth", icon: Bot },
  ];

  return (
    <header className="bg-[#121214] border-b border-[#2A2A2C] text-[#E0E0E0] sticky top-0 z-40">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo & Version */}
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-sm bg-[#FF3E00] flex items-center justify-center shadow-sm text-white font-black text-xs tracking-tighter">
              QK
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm tracking-tight text-white font-mono">
                  QK SOCIAL AGENT
                </span>
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.2 rounded-sm bg-[#1A1A1C] text-[#FF3E00] border border-[#2A2A2C]">
                  PHASE 10
                </span>
              </div>
              <p className="text-[10px] text-[#888888] font-mono tracking-tight">Autonomous Reels Creator, QC, Gate & Learning Swarm</p>
            </div>
          </div>

          {/* Controls & Quick Badges */}
          <div className="flex items-center space-x-3">
            {/* Linked Instagram Account */}
            <button
              onClick={onOpenAccountModal}
              title="Configure and manage linked Instagram Account"
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-sm bg-[#161618] hover:bg-[#1C1C1F] border border-[#2A2A2C] text-[#E0E0E0] text-[11px] font-mono transition cursor-pointer"
            >
              <Instagram className="h-3.5 w-3.5 text-[#FF3E00]" />
              <span className="font-bold text-white">{telemetry.instagramAccount}</span>
              <span
                className={`h-1.5 w-1.5 rounded-full ml-0.5 ${
                  telemetry.instagramConnected
                    ? "bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.8)]"
                    : "bg-amber-400"
                }`}
                title={telemetry.instagramConnected ? "Live Graph API Connected" : "Sandbox / Ready to link Graph Token"}
              />
            </button>

            {/* AI Provider Status */}
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-sm bg-[#161618] border border-[#2A2A2C] text-[11px] font-mono">
              <div className={`h-1.5 w-1.5 rounded-full ${geminiLive ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-amber-400"}`} />
              <span className="text-[#C0C0C0]">{geminiLive ? "Gemini 3.7 Flash Live" : "Deterministic Engine"}</span>
            </div>

            {/* Daily Briefing Action */}
            <button
              onClick={onRunDailyBriefing}
              className="hidden md:flex items-center space-x-1 px-2.5 py-1 rounded-sm bg-[#1A1A1C] hover:bg-[#222226] border border-[#2A2A2C] text-[#E0E0E0] text-[11px] font-medium transition cursor-pointer"
            >
              <Zap className="h-3 w-3 text-[#FF3E00]" />
              <span>Daily Briefing</span>
            </button>

            {/* Autonomy Level Switcher */}
            <div className="flex items-center space-x-0.5 bg-[#0F0F10] p-0.5 rounded-sm border border-[#2A2A2C] text-[10px] font-mono">
              <Sliders className="h-3 w-3 text-[#666666] ml-1 mr-0.5" />
              {(["MANUAL", "ASSISTED", "SEMI_AUTONOMOUS"] as AutonomyLevel[]).map((level) => {
                const isActive = telemetry.activeAutonomyLevel === level;
                return (
                  <button
                    key={level}
                    onClick={() => onAutonomyChange(level)}
                    className={`px-2 py-0.5 rounded-sm font-semibold transition cursor-pointer ${
                      isActive
                        ? "bg-[#FF3E00] text-white shadow-xs"
                        : "text-[#888888] hover:text-[#E0E0E0] hover:bg-[#161618]"
                    }`}
                  >
                    {level === "SEMI_AUTONOMOUS" ? "SEMI-AUTO" : level === "ASSISTED" ? "ASSISTED" : "MANUAL"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-[#2A2A2C] bg-[#0F0F10]">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
          <nav className="flex space-x-1 overflow-x-auto py-1 scrollbar-thin">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-sm text-[11px] font-medium transition whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? "bg-[#1A1A1C] text-white border-[#2A2A2C] border-b-2 border-b-[#FF3E00]"
                      : "border-transparent text-[#888888] hover:text-[#E0E0E0] hover:bg-[#161618]"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#FF3E00]" : "text-[#666666]"}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="ml-1 px-1 py-0.1 rounded-xs bg-[#FF3E00] text-white text-[9px] font-mono font-bold animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
