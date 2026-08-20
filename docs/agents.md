# Agents Specification — QK Social Agent

## 1. SocialOrchestrator
- **Mission**: Decomposes top-level goals into structured task execution graphs.
- **Inputs**: User prompt/goal string, autonomy level (`MANUAL` | `ASSISTED` | `SEMI_AUTONOMOUS`), target audience, batch quantity.
- **Outputs**: Verified Reel candidates, execution traces, telemetry logs.

## 2. StrategyAgent
- **Mission**: Formulates content pillars and optimal duration targets based on historical learning evidence.
- **Model**: `gemini-3.7-flash` (with deterministic fallback).
- **Core Output Schema**:
```json
{
  "theme": "string",
  "strategicPillars": ["string", "string", "string"],
  "contentAngle": "string",
  "targetHookStyle": "string",
  "recommendedDurationSec": 24,
  "keyHypothesis": "string",
  "bestPostingWindow": "17:30 UTC"
}
```

## 3. ContentAgent
- **Mission**: Writes high-impact 9:16 vertical scripts with A/B hooks, 4 timed visual scenes, captions, and hashtag sets.
- **Constraints**: 60-85 words total narration to guarantee sub-28 second high-velocity pacing.

## 4. MediaAgent
- **Mission**: Generates visual composition presets, sound synchronization cues, and typography safe-zone constraints.
- **Presets**: Cyber Grid, Terminal Speed, Neural Network, Blueprint Schematic, Security Shield, Data Stream.

## 5. QualityControlAgent
- **Mission**: Executes multi-point compliance checks:
  1. Safe-Zone clearance (top 15% header, bottom 20% caption).
  2. Hook duration (< 3.0 seconds).
  3. Safety & Policy compliance.
  4. Word count & pacing density.

## 6. AnalyticsAgent
- **Mission**: Ingests metrics (reach, 3s view-through, likes, saves, shares, comments) to extract retention curve insights.

## 7. EngagementAgent
- **Mission**: Ingests community comments, performs sentiment analysis, drafts authentic responses, and fulfills comment automation (e.g. DM delivery for 'AGENT' keywords).
