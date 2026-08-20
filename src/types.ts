export type AutonomyLevel = "MANUAL" | "ASSISTED" | "SEMI_AUTONOMOUS";

export type AgentRole =
  | "SocialOrchestrator"
  | "StrategyAgent"
  | "ContentAgent"
  | "MediaAgent"
  | "AnalyticsAgent"
  | "EngagementAgent"
  | "QualityControlAgent";

export interface SceneBodyPart {
  sceneNum: number;
  timeRange: string;
  visual: string;
  voiceover: string;
  overlayText: string;
  bRollTag: "cyber_grid" | "terminal_speed" | "neural_network" | "blueprint_schematic" | "security_shield" | "data_stream";
}

export interface ReelScript {
  title: string;
  topic: string;
  hook: string;
  hookVariantB?: string;
  bodyParts: SceneBodyPart[];
  caption: string;
  hashtags: string[];
}

export interface QualityScore {
  overall: number;
  hookImpact: number;
  visualPolish: number;
  retentionPacing: number;
  compliance: number;
  notes: string;
}

export interface ReelApproval {
  required: boolean;
  status: "pending_approval" | "approved" | "rejected";
  gate?: string;
  message?: string;
  approvedBy?: string;
  approvedAt?: string;
  feedback?: string;
}

export interface ReelMedia {
  status: "rendering" | "ready" | "failed";
  url: string;
  format?: string;
  mimeType?: string;
  error?: string;
  publish?: any;
}

export interface ReelItem {
  id: string;
  title: string;
  goal: string;
  topic: string;
  targetAudience: string;
  duration: number;
  status: "draft" | "needs_approval" | "scheduled" | "published" | "rejected";
  publishDate: string;
  instagramPostId?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  retentionScore: number;
  script: ReelScript;
  strategy?: any;
  visuals?: any;
  qualityScore: QualityScore;
  approval: ReelApproval;
  media?: ReelMedia;
}

export interface LearningItem {
  id: string;
  category: "hooks" | "topics" | "duration" | "weak_topics" | "strategy_update" | "cta";
  pattern: string;
  impact: string;
  confidence: number;
  samplesCount: number;
  status: "active" | "avoid" | "testing";
  recommendedAction: string;
  updatedAt: string;
}

export interface ExperimentItem {
  id: string;
  title: string;
  hypothesis: string;
  variantA: string;
  variantB: string;
  metric: string;
  status: "running" | "completed" | "paused";
  winner: string;
  resultA: string;
  resultB: string;
  conclusion: string;
  date: string;
}

export interface TraceStep {
  timestamp: string;
  agent: string;
  step: string;
  status: "pending" | "running" | "completed" | "failed" | "needs_approval";
  detail: string;
  data?: any;
}

export interface TraceRecord {
  id: string;
  goal: string;
  durationMs: number;
  status: string;
  reelId?: string;
  steps: TraceStep[];
  createdAt: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  status: "online" | "busy" | "idle" | "standby";
  lastActive: string;
  load: string;
}

export interface TelemetryState {
  totalRuns: number;
  successfulWorkflows: number;
  failedWorkflows: number;
  averageLatencyMs: number;
  aiProviderCalls: number;
  activeAutonomyLevel: AutonomyLevel;
  instagramConnected: boolean;
  instagramAccount: string;
  followers: number;
  engagementRate: string;
  reach30d: number;
  securityAuditsPassed: boolean;
}

export interface DailyBriefingData {
  date: string;
  summary: string;
  metrics: {
    newFollowers24h: number;
    reach24h: number;
    views24h: number;
    commentsToReply: number;
    providerHealth: string;
    scheduledReels: number;
    pendingApprovals: number;
  };
  actionItems: string[];
  status: string;
}

export interface WeeklyAnalysisData {
  weeklySummary: string;
  topWinningPattern: string;
  weakSpotToAvoid: string;
  nextWeekPriorities: string[];
  recommendedBatchCount: number;
  confidenceScore: number;
}
