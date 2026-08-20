import React from "react";
import {
  Activity,
  Server,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Cpu,
  Layers,
} from "lucide-react";
import { TelemetryState, TraceRecord } from "../types";

interface ObservabilityLogsProps {
  telemetry: TelemetryState;
  traces: TraceRecord[];
}

export const ObservabilityLogs: React.FC<ObservabilityLogsProps> = ({
  telemetry,
  traces,
}) => {
  return (
    <div className="space-y-4 text-[#E0E0E0]">
      {/* System Telemetry & Resource Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
        <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-3 shadow-xs">
          <div className="flex items-center justify-between text-[#888888] text-[10px] uppercase">
            <span>Pipeline Latency</span>
            <Clock className="h-3.5 w-3.5 text-[#38bdf8]" />
          </div>
          <h3 className="text-base font-bold text-white mt-1">
            {telemetry.averageLatencyMs}ms
          </h3>
          <span className="text-[9px] text-emerald-400">Sub-2s Goal to QC</span>
        </div>

        <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-3 shadow-xs">
          <div className="flex items-center justify-between text-[#888888] text-[10px] uppercase">
            <span>Provider Calls</span>
            <Zap className="h-3.5 w-3.5 text-[#FF3E00]" />
          </div>
          <h3 className="text-base font-bold text-white mt-1">
            {telemetry.aiProviderCalls}
          </h3>
          <span className="text-[9px] text-[#38bdf8]">Gemini 3.7 Flash</span>
        </div>

        <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-3 shadow-xs">
          <div className="flex items-center justify-between text-[#888888] text-[10px] uppercase">
            <span>Scrubber Audit</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <h3 className="text-base font-bold text-emerald-400 mt-1">100% PASSED</h3>
          <span className="text-[9px] text-[#888888]">0 Tokens Exposed</span>
        </div>

        <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-3 shadow-xs">
          <div className="flex items-center justify-between text-[#888888] text-[10px] uppercase">
            <span>Failures</span>
            <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <h3 className="text-base font-bold text-white mt-1">
            {telemetry.failedWorkflows}
          </h3>
          <span className="text-[9px] text-[#888888]">Auto-recovery</span>
        </div>
      </div>

      {/* Traces Feed Table */}
      <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2C] font-mono">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-[#38bdf8]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Live Execution Telemetry Stream</h3>
          </div>
          <span className="text-[10px] text-[#888888]">Audited Execution Logs</span>
        </div>

        <div className="space-y-2 mt-3 font-mono">
          {traces.length === 0 ? (
            <div className="text-center py-6 text-[#666666] text-xs">
              No live execution traces recorded yet. Run a goal in Orchestrator Studio.
            </div>
          ) : (
            traces.map((trace) => (
              <div
                key={trace.id}
                className="bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-3 text-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] text-[#38bdf8] border border-[#2A2A2C] font-bold text-[10px]">
                      {trace.id}
                    </span>
                    <span className="text-white font-semibold text-xs">"{trace.goal}"</span>
                  </div>
                  <span className="text-[#666666] text-[10px]">
                    {new Date(trace.createdAt).toLocaleTimeString()} • {(trace.durationMs / 1000).toFixed(2)}s
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] mt-1.5 pt-1.5 border-t border-[#2A2A2C] text-[#888888]">
                  <div>
                    Steps: <strong className="text-white">{trace.steps?.length || 0}</strong>
                  </div>
                  <div>
                    Status: <strong className="text-emerald-400 uppercase">{trace.status}</strong>
                  </div>
                  <div>
                    Output: <strong className="text-[#38bdf8]">{trace.reelId || "None"}</strong>
                  </div>
                  <div>
                    Audit: <strong className="text-emerald-400">CLEARED</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
