# Architecture Specification — QK Social Agent

## System Architecture Diagram

```
+-----------------------------------------------------------------------------+
|                                HUMAN OPERATOR                               |
|       (Goal Definition, Interactive Reel Review, One-Click Approval)        |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                             SocialOrchestrator                              |
|   +---------------------------------------------------------------------+   |
|   |  Goal Decomposer  |  DAG Task Engine  |  State Machine & Telemetry  |   |
|   +---------------------------------------------------------------------+   |
+-----------------------------------------------------------------------------+
         |                      |                       |
         v                      v                       v
+------------------+  +-------------------+  +--------------------+
|  StrategyAgent   |  |   ContentAgent    |  |     MediaAgent     |
| (Demographics &  |  |  (A/B Hooks, Timed|  | (9:16 Motion Presets|
|  Pillars)        |  |   Scene Scripts)  |  |  Audio Visualizer) |
+------------------+  +-------------------+  +--------------------+
         \                      |                       /
          \                     |                      /
           v                    v                     v
+-----------------------------------------------------------------------------+
|                            QualityControlAgent                              |
| (Safe-Zone 9:16 Audit, Hook Pacing Score, Language & Community Safety Guard)|
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                            HUMAN APPROVAL GATE                              |
|     (Mandatory Hard Lock: Prevents Accidental or Unauthorized Publishing)   |
+-----------------------------------------------------------------------------+
                                       | (Approved)
                                       v
+-----------------------------------------------------------------------------+
|                      SCHEDULING & PUBLISHING PIPELINE                       |
|               (Meta Instagram Graph API v21.0 Container Ingestion)           |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                     AnalyticsAgent & EngagementAgent                        |
|  (Retention Drop-offs, Engagement Rate, Automated Keyword DM Delivery)      |
+-----------------------------------------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
|                         CLOSED-LOOP LEARNING STORE                          |
|   (Winning Hooks Store, Weak Topic Deprecation, Empirical Memory Feedback)  |
+-----------------------------------------------------------------------------+
```

## State Machine Model

A Reel transitions through the following lifecycle states:

1. `draft`: Initial planning stage.
2. `generating`: Active worker agents synthesizing scripts, visuals, and QC score.
3. `needs_approval`: Enters the Human Approval Gate. The system stops external operations and waits for human sign-off.
4. `scheduled`: Content approved by human operator and queued with Meta container scheduler.
5. `published`: Successfully rendered and posted to Instagram Graph API.
6. `rejected`: Returned to ContentAgent with human revision notes.
