import React, { useState } from "react";
import { FileText, BookOpen, Layers, Bot, ShieldCheck, Terminal } from "lucide-react";

export const DocumentationViewer: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<string>("architecture");

  const docContents: Record<string, { title: string; content: string }> = {
    architecture: {
      title: "System Architecture & Pipeline",
      content: `# QK Social Agent — System Architecture (Phase 10)

## Closed-Loop Pipeline

GOAL
  ↓
STRATEGY (StrategyAgent)
  ↓
IDEAS & A/B HOOKS (ContentAgent)
  ↓
SELECTION (Hypothesis Matching)
  ↓
SCRIPT (4 Timed Scenes: 0-3s, 3-10s, 10-18s, 18-24s)
  ↓
MEDIA (MediaAgent: Motion Shaders & Audio Waves)
  ↓
REEL CANVAS RENDER (9:16 Vertical Safe-Zone)
  ↓
QUALITY CONTROL (Pre-Flight Retention & Margin Audit)
  ↓
HUMAN APPROVAL GATE (Hardlock Interceptor)
  ↓
SCHEDULING & PUBLISHING (Meta Instagram Graph API v21.0)
  ↓
ANALYTICS & RETENTION ATTRIBUTION (AnalyticsAgent)
  ↓
CLOSED-LOOP LEARNING STORE (Self-Improving Memory)
  ↓
NEXT STRATEGY CYCLE

## Key System Invariants
- **Zero Accident Rule**: No content reaches Meta publishing endpoints without passing the Human Approval Gate.
- **Strict Pacing Bound**: Scripts strictly bounded to 60-85 words total for maximum 24-28s completion rate.
- **Empirical Memory**: Historical retention data acts as evidence weights in subsequent Strategy prompts.`,
    },
    agents: {
      title: "Multi-Agent Swarm Specification",
      content: `# Multi-Agent Roles & Responsibilities

1. **SocialOrchestrator**: Master supervisor creating DAG execution graphs, monitoring timeouts, managing retries, and halting at Approval Gates.
2. **StrategyAgent**: Ingests audience demographic targets and past high-converting patterns to output content pillars and target hook styles.
3. **ContentAgent**: Drafts 9:16 scripts with A/B hooks (Variant A Shock vs Variant B Question), 4 timed scenes, captions, and hashtag sets.
4. **MediaAgent**: Compiles visual motion presets (Cyber Grid, Neural Network, Blueprint, Terminal, Data Stream) and synchronized audio visualizers.
5. **QualityControlAgent**: Audits safe-zone margins (15% top, 20% bottom), hook delivery speed (<3s), and policy compliance.
6. **AnalyticsAgent**: Ingests watch-through, bookmark saves, shares, and comment rates to update empirical weights.
7. **EngagementAgent**: Processes community comments, analyzes sentiment, drafts technical replies, and fulfills keyword DM automations (e.g. 'AGENT' repo delivery).`,
    },
    instagram: {
      title: "Meta Instagram Graph API v21.0 Integration",
      content: `# Instagram Graph API Flow

1. Media Container Creation:
   POST /v21.0/{ig_user_id}/media
   media_type=REELS
   video_url=...
   caption=...
   thumb_offset=2500

2. Polling Status:
   GET /v21.0/{creation_id}?fields=status_code

3. Publishing:
   POST /v21.0/{ig_user_id}/media_publish
   creation_id={creation_id}`,
    },
    security: {
      title: "Security & Policy Audit",
      content: `# Security Standards

- **Server-Side Key Isolation**: GEMINI_API_KEY and Meta tokens are strictly maintained in server.ts and never delivered to browser bundles.
- **Idempotent Container Keys**: UUID keys prevent duplicate accidental Reel publishing on network retries.
- **Prompt Sanitization**: Inputs are bounded with strict JSON schemas and anti-injection delimiters.`,
    },
  };

  const current = docContents[selectedDoc] || docContents.architecture;

  return (
    <div className="space-y-4 text-[#E0E0E0]">
      <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#2A2A2C] gap-3 font-mono">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xs bg-[#1A1A1C] border border-[#2A2A2C] flex items-center justify-center text-[#FF3E00]">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Project Documentation & Architecture</h2>
              <p className="text-[10px] text-[#888888]">Comprehensive technical specifications for agents, pipeline, Meta API, and security.</p>
            </div>
          </div>

          {/* Doc Switcher */}
          <div className="flex flex-wrap gap-1 bg-[#0F0F10] p-1 rounded-xs border border-[#2A2A2C] text-xs">
            {Object.keys(docContents).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedDoc(key)}
                className={`px-2.5 py-1 rounded-xs font-semibold transition cursor-pointer text-[10px] uppercase font-mono ${
                  selectedDoc === key
                    ? "bg-[#FF3E00] text-white shadow-xs"
                    : "text-[#888888] hover:text-white"
                }`}
              >
                {docContents[key].title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Markdown viewer */}
        <div className="mt-3 p-4 bg-[#0F0F10] border border-[#2A2A2C] rounded-xs font-mono text-xs text-[#C0C0C0] whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
          {current.content}
        </div>
      </div>
    </div>
  );
};
