# Model setup recommendations

The setup flow uses a user-supplied provider key and keeps it server-side in memory. The recommendation list is based on the live model catalog retrieved from the configured OpenAI-compatible `/models` endpoint on Aug 20, 2026.

| Task | Recommended options | Short rationale |
| --- | --- | --- |
| Text generation | `gpt-5-mini`, `claude-sonnet-4-6`, `gemini-3.1-pro-preview` | Fast/cost-aware writing; strong reasoning and coding; long-context multimodal reasoning. |
| Vision/QC | `gemini-3-flash-preview`, `gpt-5`, `claude-sonnet-4-6` | Fast visual checks; higher-quality visual reasoning; balanced vision and instruction following. |
| Video | Built-in `ffmpeg-renderer`, optional Google Veo, optional Runway generation | The local renderer is available immediately without a video API key; external video providers require separate integrations and provider credentials. |
| Voice | OpenAI TTS, Google Cloud TTS, ElevenLabs | Reliable narration; broad language coverage; expressive creator-style voice. |

The live catalog reported token pricing for the text/vision models, including GPT-5 mini at $0.25 input / $2 output per 1M tokens, Claude Sonnet 4.6 at $3 / $15, Gemini 3 Flash Preview at $0.50 / $3, GPT-5 at $1.25 / $10, and Gemini 3.1 Pro Preview at $2 / $12. Provider pricing can change; the UI labels these as guidance rather than a billing guarantee.

Source endpoint used for catalog verification: the configured OpenAI-compatible `OPENAI_API_BASE/models` endpoint. Model behavior guidance also follows `/home/ubuntu/skills/builtin-llm-models/SKILL.md`.
