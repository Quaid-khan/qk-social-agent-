# Deployment & Operations Guide

## Production Build & Run

```bash
# Build Vite client and bundle Express server.cjs
npm run build

# Start production server
npm run start
```

## Cloud Run & Container Configuration
- Target Port: `3000` (fixed)
- Host: `0.0.0.0`
- Secrets: Provide `GEMINI_API_KEY` in environment variables.

---

# Troubleshooting Guide

### 1. "Approval Gate Paused" State
- **Cause**: Standard safety behavior. QK Social Agent automatically halts the pipeline before scheduling to Instagram so human review can take place.
- **Resolution**: Click "Review & Approve" in the Master Dashboard or Orchestrator timeline to greenlight the post.

### 2. Gemini API Key Offline
- **Cause**: `GEMINI_API_KEY` is not set or invalid.
- **Resolution**: The system automatically switches to the deterministic Rule-Based High-Retention Template Engine without breaking the workflow. To enable live Gemini models, configure the key in the Secrets panel.
