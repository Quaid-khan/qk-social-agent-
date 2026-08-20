import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { MasterDashboard } from "./components/MasterDashboard";
import { OrchestratorStudio } from "./components/OrchestratorStudio";
import { ReelPreviewPlayer } from "./components/ReelPreviewPlayer";
import { ApprovalGateModal } from "./components/ApprovalGateModal";
import { LearningLoopView } from "./components/LearningLoopView";
import { ExperimentLab } from "./components/ExperimentLab";
import { EngagementHub } from "./components/EngagementHub";
import { ObservabilityLogs } from "./components/ObservabilityLogs";
import { SecurityCompliance } from "./components/SecurityCompliance";
import { TestSuiteRunner } from "./components/TestSuiteRunner";
import { DocumentationViewer } from "./components/DocumentationViewer";
import { InstagramAccountModal } from "./components/InstagramAccountModal";
import {
  AutonomyLevel,
  AgentInfo,
  ReelItem,
  TelemetryState,
  TraceRecord,
  LearningItem,
  ExperimentItem,
  DailyBriefingData,
  WeeklyAnalysisData,
} from "./types";
import { Zap, Sparkles, CheckCircle2, AlertCircle, Calendar, Bot } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [geminiLive, setGeminiLive] = useState<boolean>(false);
  const [telemetry, setTelemetry] = useState<TelemetryState>({
    totalRuns: 0,
    successfulWorkflows: 0,
    failedWorkflows: 0,
    averageLatencyMs: 0,
    aiProviderCalls: 0,
    activeAutonomyLevel: "SEMI_AUTONOMOUS",
    instagramConnected: false,
    instagramAccount: "@qk_create",
    followers: 0,
    engagementRate: "0%",
    reach30d: 0,
    securityAuditsPassed: true,
  });

  const [reels, setReels] = useState<ReelItem[]>([]);
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [learnings, setLearnings] = useState<LearningItem[]>([]);
  const [experiments, setExperiments] = useState<ExperimentItem[]>([]);
  const [traces, setTraces] = useState<TraceRecord[]>([]);

  // Studio and active focus states
  const [isOrchestrating, setIsOrchestrating] = useState<boolean>(false);
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);
  const [activeTrace, setActiveTrace] = useState<TraceRecord | null>(null);
  const [approvalModalReel, setApprovalModalReel] = useState<ReelItem | null>(null);

  // Daily / Weekly briefing modal
  const [dailyBriefing, setDailyBriefing] = useState<DailyBriefingData | null>(null);
  const [showDailyBriefingModal, setShowDailyBriefingModal] = useState<boolean>(false);
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [isWeeklyAnalyzing, setIsWeeklyAnalyzing] = useState<boolean>(false);
  const [weeklyAnalysis, setWeeklyAnalysis] = useState<WeeklyAnalysisData | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" | "warning" } | null>(null);

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Initial Load
  const fetchDashboardData = async () => {
    try {
      const [dashRes, healthRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/health"),
      ]);
      const dashData = await dashRes.json();
      const healthData = await healthRes.json();

      if (dashData.telemetry) setTelemetry(dashData.telemetry);
      if (dashData.reels) {
        setReels(dashData.reels);
        if (!activeReel && dashData.reels.length > 0) {
          setActiveReel(dashData.reels[0]);
        }
      }
      if (dashData.agents) setAgents(dashData.agents);
      if (dashData.learnings) setLearnings(dashData.learnings);
      if (dashData.experiments) setExperiments(dashData.experiments);
      if (dashData.traces) {
        setTraces(dashData.traces);
        if (!activeTrace && dashData.traces.length > 0) {
          setActiveTrace(dashData.traces[0]);
        }
      }
      if (healthData.geminiLive !== undefined) setGeminiLive(healthData.geminiLive);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handler: Run Goal through Orchestrator
  const handleRunGoal = async (goal: string, customTopic?: string, targetAudience?: string) => {
    setIsOrchestrating(true);
    showToast("SocialOrchestrator initiated task DAG decomposition...", "info");

    try {
      const response = await fetch("/api/orchestrator/run-goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal,
          customTopic,
          targetAudience,
          autonomyLevel: telemetry.activeAutonomyLevel,
        }),
      });
      const data = await response.json();

      if (data.success) {
        if (data.reel) {
          setActiveReel(data.reel);
          setReels((prev) => [data.reel, ...prev.filter((r) => r.id !== data.reel.id)]);
        }
        if (data.trace) {
          setActiveTrace(data.trace);
          setTraces((prev) => [data.trace, ...prev]);
        }
        setTelemetry((prev) => ({ ...prev, totalRuns: prev.totalRuns + 1 }));
        showToast("Reel created successfully! Ready for your review & approval.", "success");
      } else {
        showToast(data.error || "Could not generate Reel. Please try again.", "warning");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to execute goal", "warning");
    } finally {
      setIsOrchestrating(false);
    }
  };

  // Handler: Reel Approval / Publication
  const handleApproveReel = async (
    id: string,
    action: "approve" | "publish_now",
    scheduleDate?: string
  ) => {
    try {
      const response = await fetch(`/api/reels/${id}/approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, scheduleDate }),
      });
      const data = await response.json();

      if (data.success && data.reel) {
        setReels((prev) => prev.map((r) => (r.id === id ? data.reel : r)));
        if (activeReel?.id === id) {
          setActiveReel(data.reel);
        }
        if (action === "publish_now") {
          if (data.metaStatus?.livePublished) {
            showToast("Success! Reel published directly to your live Instagram account!", "success");
          } else {
            showToast(
              "Reel approved! Note: To push live video to your Instagram feed, enter your Meta Graph API Token in Settings.",
              "warning"
            );
          }
        } else {
          showToast("Reel approved & scheduled in queue!", "success");
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Error updating approval status", "warning");
    }
  };

  const handleRejectReel = async (id: string, feedback: string) => {
    try {
      const response = await fetch(`/api/reels/${id}/approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", feedback }),
      });
      const data = await response.json();
      if (data.success && data.reel) {
        setReels((prev) => prev.map((r) => (r.id === id ? data.reel : r)));
        if (activeReel?.id === id) setActiveReel(data.reel);
        showToast("Revision feedback routed back to ContentAgent.", "info");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Change Autonomy Level
  const handleAutonomyChange = async (level: AutonomyLevel) => {
    try {
      const res = await fetch("/api/settings/autonomy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level }),
      });
      const data = await res.json();
      if (data.success) {
        setTelemetry((prev) => ({ ...prev, activeAutonomyLevel: level }));
        showToast(`Swarm Autonomy Level updated to ${level}`, "info");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Daily Briefing
  const handleRunDailyBriefing = async () => {
    try {
      const res = await fetch("/api/daily-briefing", { method: "POST" });
      const data = await res.json();
      if (data.briefing) {
        setDailyBriefing(data.briefing);
        setShowDailyBriefingModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Save & Link Instagram Account
  const handleSaveAccount = async (accountName: string, accessToken?: string, accountId?: string) => {
    try {
      const res = await fetch("/api/settings/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountName, accessToken, accountId }),
      });
      const data = await res.json();
      if (data.success) {
        setTelemetry((prev) => ({
          ...prev,
          instagramAccount: data.account,
          instagramConnected: true,
        }));
        showToast(`Instagram account ${data.account} successfully linked and active!`, "success");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update account binding", "warning");
    }
  };

  // Handler: Weekly Learning Loop
  const handleRunWeeklyLearning = async () => {
    setIsWeeklyAnalyzing(true);
    showToast("Weekly Agent analyzing past 7-day retention curves & experiments...", "info");

    try {
      const res = await fetch("/api/weekly-learning", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        if (data.analysis) setWeeklyAnalysis(data.analysis);
        if (data.newLearning) {
          setLearnings((prev) => [data.newLearning, ...prev]);
        }
        showToast("Weekly Strategy updated and saved to Knowledge Memory!", "success");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsWeeklyAnalyzing(false);
    }
  };

  // Handler: Add Custom Learning
  const handleAddLearning = async (learning: Partial<LearningItem>) => {
    try {
      const res = await fetch("/api/learnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(learning),
      });
      const data = await res.json();
      if (data.learning) {
        setLearnings((prev) => [data.learning, ...prev]);
        showToast("New empirical rule persisted to learning store.", "success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Add Experiment
  const handleCreateExperiment = async (exp: Partial<ExperimentItem>) => {
    try {
      const res = await fetch("/api/experiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exp),
      });
      const data = await res.json();
      if (data.experiment) {
        setExperiments((prev) => [data.experiment, ...prev]);
        showToast("A/B Flight initialized and active in upcoming batch.", "success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingApprovalsCount = reels.filter((r) => r.status === "needs_approval").length;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E0E0E0] flex flex-col font-sans selection:bg-[#FF3E00] selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce">
          <div
            className={`px-3.5 py-2.5 rounded-sm shadow-2xl border text-xs font-mono font-medium flex items-center space-x-2 ${
              notification.type === "success"
                ? "bg-[#121214] text-emerald-400 border-emerald-700/80"
                : notification.type === "warning"
                ? "bg-[#121214] text-amber-400 border-amber-700/80"
                : "bg-[#121214] text-[#E0E0E0] border-[#FF3E00]"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : notification.type === "warning" ? (
              <AlertCircle className="h-4 w-4 text-amber-400" />
            ) : (
              <Sparkles className="h-4 w-4 text-[#FF3E00]" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        telemetry={telemetry}
        onAutonomyChange={handleAutonomyChange}
        onRunDailyBriefing={handleRunDailyBriefing}
        onOpenAccountModal={() => setShowAccountModal(true)}
        pendingApprovalsCount={pendingApprovalsCount}
        geminiLive={geminiLive}
      />

      {/* Primary Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-5">
        {activeTab === "dashboard" && (
          <MasterDashboard
            telemetry={telemetry}
            reels={reels}
            agents={agents}
            traces={traces}
            onSelectReel={(reel) => {
              setActiveReel(reel);
              setActiveTab("orchestrator");
            }}
            onOpenApproval={(reel) => setApprovalModalReel(reel)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === "orchestrator" && (
          <OrchestratorStudio
            onRunGoal={handleRunGoal}
            isRunning={isOrchestrating}
            activeReel={activeReel}
            activeTrace={activeTrace}
            autonomyLevel={telemetry.activeAutonomyLevel}
            onOpenApproval={(reel) => setApprovalModalReel(reel)}
            geminiLive={geminiLive}
          />
        )}

        {activeTab === "reels" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#2A2A2C] gap-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                  Reel Library & Schedule
                </h2>
                <p className="text-xs text-[#888888]">
                  Browse generated drafts, reels awaiting your approval, scheduled queues, and published reels.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("orchestrator")}
                className="px-3.5 py-1.5 rounded-xs bg-[#FF3E00] hover:bg-[#E03700] text-white font-mono font-bold text-xs shadow-xs transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>+ Create New Reel</span>
              </button>
            </div>

            {/* Quick Status Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All Reels", count: reels.length, filter: "all" },
                { label: "Pending Approval", count: reels.filter(r => r.status === "needs_approval").length, filter: "needs_approval", badgeColor: "text-amber-400" },
                { label: "Scheduled", count: reels.filter(r => r.status === "scheduled").length, filter: "scheduled", badgeColor: "text-sky-400" },
                { label: "Live / Published", count: reels.filter(r => r.status === "published").length, filter: "published", badgeColor: "text-emerald-400" },
              ].map((cat, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-xs bg-[#121214] border border-[#2A2A2C] text-xs font-mono flex items-center space-x-2"
                >
                  <span className="text-white font-semibold">{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] border border-[#2A2A2C] text-[10px] font-bold ${cat.badgeColor || "text-[#C0C0C0]"}`}>
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {reels.map((reel) => {
                const isSelected = activeReel?.id === reel.id;
                const isPublished = reel.status === "published";
                const isPending = reel.status === "needs_approval";
                const isScheduled = reel.status === "scheduled";

                return (
                  <div
                    key={reel.id}
                    onClick={() => setActiveReel(reel)}
                    className={`p-3.5 rounded-sm border transition cursor-pointer ${
                      isSelected
                        ? "bg-[#1A1A1C] border-[#FF3E00] shadow-xs"
                        : "bg-[#121214] border-[#2A2A2C] hover:border-[#444446]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-xs border ${
                          isPublished
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : isPending
                            ? "bg-amber-500/10 text-amber-300 border-amber-500/30 animate-pulse"
                            : isScheduled
                            ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                            : "bg-[#0F0F10] text-[#C0C0C0] border-[#2A2A2C]"
                        }`}
                      >
                        {isPublished ? "✓ LIVE / POSTED" : isPending ? "⏳ AWAITING APPROVAL" : isScheduled ? "📅 SCHEDULED" : reel.status}
                      </span>
                      <span className="text-[10px] font-mono text-[#888888]">{reel.duration}s</span>
                    </div>
                    <h3 className="text-xs font-bold text-white truncate">{reel.title}</h3>
                    <p className="text-[11px] text-[#888888] truncate mt-1">"{reel.script.hook}"</p>

                    {isPublished && (
                      <div className="mt-2.5 pt-2 border-t border-[#2A2A2C] flex items-center justify-between text-[10px] font-mono text-[#888888]">
                        <span>Views: <strong className="text-white">{reel.views?.toLocaleString()}</strong></span>
                        <span>Likes: <strong className="text-white">{reel.likes?.toLocaleString()}</strong></span>
                        <span>Shares: <strong className="text-white">{reel.shares?.toLocaleString()}</strong></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Active Reel Preview */}
            {activeReel && (
              <div className="mt-4">
                <div className="mb-2 text-xs font-mono text-[#888888]">
                  Selected Reel Viewport:
                </div>
                <ReelPreviewPlayer
                  reel={activeReel}
                  onApprove={() => setApprovalModalReel(activeReel)}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "learning" && (
          <LearningLoopView
            learnings={learnings}
            onRunWeeklyLearning={handleRunWeeklyLearning}
            onAddLearning={handleAddLearning}
            isAnalyzing={isWeeklyAnalyzing}
            weeklyAnalysis={weeklyAnalysis}
          />
        )}

        {activeTab === "experiments" && (
          <ExperimentLab
            experiments={experiments}
            onCreateExperiment={handleCreateExperiment}
          />
        )}

        {activeTab === "engagement" && <EngagementHub />}

        {activeTab === "tests" && <TestSuiteRunner />}

        {activeTab === "observability" && (
          <ObservabilityLogs telemetry={telemetry} traces={traces} />
        )}

        {activeTab === "security" && <SecurityCompliance />}

        {activeTab === "docs" && <DocumentationViewer />}
      </main>

      {/* Human Approval Gate Modal */}
      <ApprovalGateModal
        reel={approvalModalReel}
        isOpen={!!approvalModalReel}
        onClose={() => setApprovalModalReel(null)}
        onApprove={handleApproveReel}
        onReject={handleRejectReel}
      />

      {/* Instagram Account Binding Modal */}
      <InstagramAccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        currentAccount={telemetry.instagramAccount}
        onSaveAccount={handleSaveAccount}
      />

      {/* Daily Briefing Modal */}
      {showDailyBriefingModal && dailyBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm max-w-lg w-full p-5 shadow-2xl text-[#E0E0E0]">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2C]">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-[#FF3E00]" />
                <h3 className="text-sm font-bold font-mono text-white">Daily Executive Briefing ({dailyBriefing.date})</h3>
              </div>
              <button
                onClick={() => setShowDailyBriefingModal(false)}
                className="text-[11px] text-[#888888] hover:text-white px-2 py-0.5 rounded-sm bg-[#1A1A1C] border border-[#2A2A2C] cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="my-3 space-y-2.5 text-xs">
              <p className="text-[#C0C0C0] leading-relaxed bg-[#0F0F10] p-3 rounded-sm border border-[#2A2A2C]">
                {dailyBriefing.summary}
              </p>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#0F0F10] p-2 rounded-sm border border-[#2A2A2C]">
                  <span className="text-[9px] text-[#888888] font-mono uppercase block">24h Reach</span>
                  <span className="font-bold text-[#38bdf8] font-mono text-sm">
                    +{dailyBriefing.metrics.reach24h.toLocaleString()}
                  </span>
                </div>
                <div className="bg-[#0F0F10] p-2 rounded-sm border border-[#2A2A2C]">
                  <span className="text-[9px] text-[#888888] font-mono uppercase block">New Followers</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">
                    +{dailyBriefing.metrics.newFollowers24h}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[9px] text-[#888888] font-mono uppercase font-bold block mb-1">
                  Action Items for Today:
                </span>
                <div className="space-y-1">
                  {dailyBriefing.actionItems.map((item, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-sm bg-[#0F0F10] border border-[#2A2A2C] text-[#C0C0C0] flex items-start space-x-2 text-[11px]"
                    >
                      <span className="text-[#FF3E00] font-bold">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#2A2A2C] flex justify-end">
              <button
                onClick={() => setShowDailyBriefingModal(false)}
                className="px-3.5 py-1.5 rounded-sm bg-[#FF3E00] hover:bg-[#E03700] text-white font-mono font-bold text-xs cursor-pointer"
              >
                Acknowledged
              </button>
            </div>
          </div>
        </div>
      )}

      {/* High Density Industrial Status Footer Strip */}
      <footer className="border-t border-[#2A2A2C] bg-[#0F0F10] py-2 text-[11px] text-[#888888] font-mono">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span>SWARM_ORCHESTRATOR: OK</span>
            </span>
            <span className="text-[#2A2A2C]">|</span>
            <span className="flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>META_GRAPH_V21: CONNECTED</span>
            </span>
            <span className="text-[#2A2A2C]">|</span>
            <span className="flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF3E00]" />
              <span>GATE_INTERCEPTOR: ARMED</span>
            </span>
          </div>
          <div className="text-[10px] text-[#666666]">
            QK Social Agent • Phase 10 Production Closed-Loop
          </div>
        </div>
      </footer>
    </div>
  );
}
