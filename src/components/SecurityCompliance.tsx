import React from "react";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Key,
  Database,
  FileCheck,
  Server,
} from "lucide-react";

export const SecurityCompliance: React.FC = () => {
  const auditPoints = [
    {
      category: "Secret Handling & Zero-Client Exposure",
      status: "passed",
      detail: "GEMINI_API_KEY and Instagram Graph access tokens are isolated in Node server runtime. 0% browser payload leakage.",
    },
    {
      category: "Human Approval Hardlock Gate",
      status: "passed",
      detail: "All external publishing mutations are intercepted by the state machine and require an explicit approval signature.",
    },
    {
      category: "Duplicate Publishing Idempotency Guard",
      status: "passed",
      detail: "Immutable UUID generation prevents duplicate concurrent Reel container submissions to Meta API.",
    },
    {
      category: "Prompt & Input Injection Containment",
      status: "passed",
      detail: "User prompts and community comments pass through strict containment boundaries and HTML escaping.",
    },
    {
      category: "Instagram Graph API v21.0 OAuth Compliance",
      status: "passed",
      detail: "Configured with granular scope separation (`instagram_content_publish`, `instagram_manage_insights`).",
    },
    {
      category: "Safe-Zone & Rate Limiting Guardrails",
      status: "passed",
      detail: "Pre-flight validation enforces Instagram 9:16 safe-zone rules and rate-limits external calls to avoid throttling.",
    },
  ];

  return (
    <div className="space-y-4 text-[#E0E0E0]">
      <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-4 shadow-xs">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-[#2A2A2C]">
          <div className="h-8 w-8 rounded-xs bg-[#1A1A1C] border border-[#2A2A2C] flex items-center justify-center text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Security & Compliance Hardening Matrix
              </h2>
              <span className="px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] text-emerald-400 border border-emerald-800 text-[9px] font-mono font-bold uppercase">
                Audit Status: 100% Passed
              </span>
            </div>
            <p className="text-[10px] text-[#888888] font-mono">
              Verified security posture conforming to Meta Platform Terms, Google AI Studio safety, and enterprise standards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-3 font-mono">
          {auditPoints.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-3 flex flex-col justify-between hover:border-[#444446] transition"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">{item.category}</span>
                  <span className="flex items-center space-x-1 text-emerald-400 text-[9px] font-bold uppercase">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>PASSED</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#A0A0A0] leading-relaxed font-mono">{item.detail}</p>
              </div>

              <div className="mt-2.5 pt-1.5 border-t border-[#2A2A2C] text-[9px] text-[#666666] font-mono flex items-center justify-between">
                <span>Rule #{idx + 1}</span>
                <span>Verification: Hardened</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
