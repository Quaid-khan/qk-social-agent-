import React from "react";
import {
  Bot,
  Zap,
  Sparkles,
  Calendar,
  Layers,
  MessageSquare,
  Sliders,
  Instagram,
  Activity,
  ChevronRight,
} from "lucide-react";
import { AutonomyLevel, TelemetryState } from "../types";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  telemetry: TelemetryState;
  onAutonomyChange: (level: AutonomyLevel) => void;
  onRunDailyBriefing: () => void;
  onOpenAccountModal: () => void;
  onOpenModelSetup: () => void;
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
  onOpenModelSetup,
  pendingApprovalsCount,
  geminiLive,
}) => {
  const tabs = [
    { id: "dashboard", label: "Overview", icon: Layers },
    { id: "orchestrator", label: "Create", icon: Sparkles, badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined },
    { id: "reels", label: "Library", icon: Calendar },
    { id: "engagement", label: "Engagement", icon: MessageSquare },
    { id: "learning", label: "Insights", icon: Bot },
  ];

  return (
    <header className="app-header">
      <div className="header-shell">
        <div className="brand-lockup" onClick={() => setActiveTab("dashboard")} role="button" tabIndex={0}>
          <div className="brand-mark">QK</div>
          <div className="brand-copy">
            <div className="brand-title">QK Social Agent <span className="brand-dot" /></div>
            <div className="brand-subtitle">Autonomous content studio</div>
          </div>
        </div>

        <div className="header-actions">
          <button onClick={onOpenAccountModal} title="Configure Instagram account" className="glass-button account-button">
            <Instagram className="icon-small accent-pink" />
            <span className="header-label">{telemetry.instagramAccount}</span>
            <span className={`connection-dot ${telemetry.instagramConnected ? "is-live" : "is-idle"}`} />
          </button>
          <button onClick={onOpenModelSetup} className="status-pill hidden-xs" title="Configure AI models and API keys">
            <span className={`status-dot ${geminiLive ? "is-live" : "is-idle"}`} />
            <span>{geminiLive ? "AI configured" : "Set up AI"}</span>
          </button>
          <button onClick={onRunDailyBriefing} className="glass-button briefing-button">
            <Zap className="icon-small accent-yellow" />
            <span className="header-label">Briefing</span>
          </button>
          <div className="autonomy-switcher">
            <Sliders className="icon-tiny muted" />
            {(["MANUAL", "ASSISTED", "SEMI_AUTONOMOUS"] as AutonomyLevel[]).map((level) => {
              const isActive = telemetry.activeAutonomyLevel === level;
              return (
                <button
                  key={level}
                  onClick={() => onAutonomyChange(level)}
                  className={`autonomy-option ${isActive ? "is-active" : ""}`}
                  title={`Set autonomy to ${level.toLowerCase().replace("_", " ")}`}
                >
                  {level === "SEMI_AUTONOMOUS" ? "Auto" : level === "ASSISTED" ? "Assist" : "Manual"}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="nav-shell">
        <nav className="app-nav" aria-label="Primary navigation">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`nav-item ${isActive ? "is-active" : ""}`}>
                <Icon className="icon-small" />
                <span>{tab.label}</span>
                {tab.badge && <span className="nav-badge">{tab.badge}</span>}
                {isActive && <ChevronRight className="nav-chevron" />}
              </button>
            );
          })}
        </nav>
        <div className="system-status"><Activity className="icon-tiny" /> <span>System nominal</span></div>
      </div>
    </header>
  );
};
