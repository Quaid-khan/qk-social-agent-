# Security & Compliance Audit

QK Social Agent enforces strict security policies across all agent and publishing subsystems:

1. **Zero Secret Exposure**: Server-side API keys (`GEMINI_API_KEY`, Instagram access tokens) are strictly isolated on the backend server and never forwarded to client-side bundles.
2. **Human-in-the-Loop Approval Gate**: Autonomous scheduling and publishing are prohibited from executing external API mutations without human approval.
3. **Idempotency & Duplicate Publishing Prevention**: Each Reel container generation attaches an immutable UUID idempotency key to prevent accidental duplicate posts.
4. **Input Sanitization & Injection Defense**: All user goals and comment payloads pass through prompt containment boundaries and HTML escaping.
5. **Rate Limiting & Provider Fallback**: Automatic backoff and circuit-breakers prevent API abuse and provide deterministic rule-based outputs if external providers experience downtime.
