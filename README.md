# QK Social Agent — Autonomous Multi-Agent Social Media Engine

QK Social Agent is an autonomous, closed-loop multi-agent system designed for automated Reels and short-form video content creation, quality control assertions, human-in-the-loop approval gates, scheduled publishing, real-time analytics attribution, and self-improving strategy learning loops.

## System Workflow Pipeline

```
GOAL
  ↓
STRATEGY (StrategyAgent)
  ↓
IDEAS & HOOKS (ContentAgent)
  ↓
SELECTION (A/B Hypotheses)
  ↓
SCRIPTING (Scene-by-Scene Timed Prompts)
  ↓
MEDIA COMPOSITION (MediaAgent)
  ↓
REEL CANVAS RENDER (9:16 Safe-Zone Layout)
  ↓
QUALITY CONTROL (Pre-Flight Safety Gate)
  ↓
HUMAN APPROVAL GATE (Hardlock Interceptor)
  ↓
SCHEDULING & PUBLISHING (Instagram Graph API)
  ↓
ANALYTICS & RETENTION (AnalyticsAgent)
  ↓
LEARNING LOOP (Self-Optimizing Memory Store)
  ↓
NEXT STRATEGY
```

## Core Agent Swarm

1. **SocialOrchestrator**: Master supervisor that receives natural language goals, decomposes them into deterministic task DAGs, monitors progress, handles retries, records execution traces, and enforces human approval barriers before sensitive actions.
2. **StrategyAgent**: Analyzes target audience demographics, trending engineering topics, platform retention benchmarks, and historical performance memory to synthesize content pillars.
3. **ContentAgent**: Generates high-converting A/B hooks, timed scene breakdowns (0-3s hook, 3-10s concept, 10-18s proof, 18-24s CTA), on-screen typography, captions, and hashtag clusters.
4. **MediaAgent**: Constructs 9:16 visual motion canvas presets (Cyber Grid, Neural Network, Blueprint, Terminal, Data Stream) with audio waveform synchronization and Instagram safe margins.
5. **QualityControlAgent**: Audits pre-flight compliance, retention pacing (under 85 words for fast tempo), safe-zone margin clearance (15% top, 20% bottom), and policy adherence.
6. **AnalyticsAgent**: Ingests watch-through rates, 3-second hook drop-offs, save-to-reach ratios, and comment velocity to compute ROI scores.
7. **EngagementAgent**: Automates technical comment replies with sentiment analysis and keyword-based DM asset deliveries (e.g. delivering boilerplate repos to users commenting 'AGENT').

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run full-stack dev server
npm run dev

# 3. Open preview
http://localhost:3000
```
