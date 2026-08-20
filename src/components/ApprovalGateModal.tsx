import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  PlayCircle,
  AlertTriangle,
  Sparkles,
  Calendar,
  Layers,
} from "lucide-react";
import confetti from "canvas-confetti";
import { ReelItem } from "../types";

interface ApprovalGateModalProps {
  reel: ReelItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, action: "approve" | "publish_now", scheduleDate?: string) => void;
  onReject: (id: string, feedback: string) => void;
}

export const ApprovalGateModal: React.FC<ApprovalGateModalProps> = ({
  reel,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !reel) return null;

  const [feedbackText, setFeedbackText] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );
  const [reviewedReelId, setReviewedReelId] = useState<string | null>(null);
  const hasReviewedVideo = reviewedReelId === reel.id;

  const handleApproveAction = (action: "approve" | "publish_now") => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onApprove(reel.id, action, scheduleDate);
    onClose();
  };

  const handleRejectAction = () => {
    if (!feedbackText.trim()) return;
    onReject(reel.id, feedbackText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm max-w-2xl w-full p-4 shadow-2xl overflow-hidden text-[#E0E0E0]">
        {/* Header Guard Banner */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2C]">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xs bg-[#1A1A1C] border border-[#2A2A2C] flex items-center justify-center text-amber-400">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">Publishing Approval</h3>
                <span className="px-1.5 py-0.2 rounded-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold uppercase tracking-wider">
                  Review Step
                </span>
              </div>
              <p className="text-xs text-[#888888]">
                Review the post before publishing to your Instagram account.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#888888] hover:text-white text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#1A1A1C] hover:bg-[#222226] border border-[#2A2A2C] cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Content Summary Card */}
        <div className="my-4 space-y-3">
          <div className="bg-[#161618] p-3 rounded-xs border border-[#2A2A2C]">
            <span className="text-[9px] font-mono text-[#38bdf8] uppercase font-bold block mb-0.5">
              Reel Candidate Under Review:
            </span>
            <h4 className="text-xs font-bold text-white font-mono">{reel.title}</h4>
            <p className="text-[11px] text-[#A0A0A0] mt-0.5 font-mono">
              <span className="text-[#666666]">Hook:</span> "{reel.script.hook}"
            </p>
            <div className="flex items-center space-x-3 text-[10px] font-mono text-[#888888] mt-2 pt-2 border-t border-[#2A2A2C]">
              <span>Duration: <strong className="text-white">{reel.duration}s</strong></span>
              <span>•</span>
              <span>Topic: <strong className="text-white">{reel.topic}</strong></span>
              <span>•</span>
              <span>QC: <strong className="text-emerald-400">{reel.qualityScore?.overall || 95}/100</strong></span>
            </div>
          </div>

          {/* Mandatory pre-publish video review */}
          <div className="bg-[#0F0F10] rounded-xs border border-[#38bdf8]/50 p-3">
            <div className="flex items-center space-x-1.5 mb-2">
              <PlayCircle className="h-3.5 w-3.5 text-[#38bdf8]" />
              <span className="text-[10px] uppercase tracking-wider font-bold text-white font-mono">Watch rendered video before posting</span>
            </div>
            {reel.media?.status === "ready" && reel.media.url ? (
              <video
                src={reel.media.url}
                controls
                preload="metadata"
                playsInline
                className="w-full max-h-[360px] rounded-xs bg-black object-contain border border-[#2A2A2C]"
              />
            ) : (
              <div className="rounded-xs border border-amber-800/70 bg-amber-950/20 p-3 text-[11px] text-amber-300 font-mono">
                The rendered MP4 is not ready yet. Refresh the Reel after rendering completes before publishing.
              </div>
            )}
            <label className="mt-2 flex items-center gap-2 text-[10px] text-[#C0C0C0] font-mono cursor-pointer">
              <input
                type="checkbox"
                checked={hasReviewedVideo}
                onChange={(event) => setReviewedReelId(event.target.checked ? reel.id : null)}
                disabled={reel.media?.status !== "ready"}
                className="accent-[#FF3E00]"
              />
              <span>I reviewed the rendered video and approve this exact version.</span>
            </label>
          </div>

          {/* QC Checklist Verification */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-mono">
            <div className="bg-[#0F0F10] p-2 rounded-xs border border-[#2A2A2C] flex items-center space-x-1.5">
              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[8px] text-[#888888] uppercase block">Safe-Zone 9:16</span>
                <span className="font-semibold text-xs text-white">Verified Clear</span>
              </div>
            </div>
            <div className="bg-[#0F0F10] p-2 rounded-xs border border-[#2A2A2C] flex items-center space-x-1.5">
              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[8px] text-[#888888] uppercase block">Retention Hook</span>
                <span className="font-semibold text-xs text-white">Sub-2.8s</span>
              </div>
            </div>
            <div className="bg-[#0F0F10] p-2 rounded-xs border border-[#2A2A2C] flex items-center space-x-1.5">
              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[8px] text-[#888888] uppercase block">Word Count</span>
                <span className="font-semibold text-xs text-white">74 Words</span>
              </div>
            </div>
            <div className="bg-[#0F0F10] p-2 rounded-xs border border-[#2A2A2C] flex items-center space-x-1.5">
              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[8px] text-[#888888] uppercase block">Policy Check</span>
                <span className="font-semibold text-xs text-emerald-400">100% Valid</span>
              </div>
            </div>
          </div>

          {/* Schedule Picker Input */}
          <div className="bg-[#161618] p-2.5 rounded-xs border border-[#2A2A2C] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center space-x-1.5 text-[#C0C0C0] font-mono text-[10px]">
              <Calendar className="h-3.5 w-3.5 text-[#38bdf8]" />
              <span>Target Publishing Window:</span>
            </div>
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="bg-[#0F0F10] border border-[#2A2A2C] rounded-xs px-2.5 py-1 text-xs text-white font-mono focus:outline-hidden focus:border-[#FF3E00]"
            />
          </div>

          {/* Reject Feedback Field (Conditional) */}
          {showRejectBox && (
            <div className="bg-[#1A1112] border border-rose-800/80 p-2.5 rounded-xs">
              <label className="text-[10px] font-mono font-semibold text-rose-300 block mb-1">
                Revision Instructions for Swarm:
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="e.g., Make the opening hook more controversial..."
                rows={2}
                className="w-full bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-2 text-xs text-white font-mono focus:outline-hidden focus:border-rose-500"
              />
              <div className="flex justify-end space-x-2 mt-2 font-mono">
                <button
                  onClick={() => setShowRejectBox(false)}
                  className="px-2.5 py-0.5 rounded-xs text-[10px] text-[#888888] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectAction}
                  className="px-2.5 py-0.5 rounded-xs bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                >
                  Send Revision
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-[#2A2A2C] gap-2.5 font-mono">
          <button
            onClick={() => setShowRejectBox(!showRejectBox)}
            className="flex items-center space-x-1 text-[10px] text-rose-400 hover:text-rose-300 px-2.5 py-1.5 rounded-xs hover:bg-[#1A1112] border border-transparent hover:border-rose-900 transition cursor-pointer"
          >
            <XCircle className="h-3 w-3" />
            <span>Reject / Request Changes</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => handleApproveAction("approve")}
              disabled={!hasReviewedVideo}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xs bg-[#1A1A1C] hover:bg-[#222226] border border-[#2A2A2C] text-white text-xs font-bold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Calendar className="h-3 w-3 text-[#38bdf8]" />
              <span>Approve & Schedule</span>
            </button>

            <button
              onClick={() => handleApproveAction("publish_now")}
              disabled={!hasReviewedVideo}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xs bg-[#FF3E00] hover:bg-[#E03700] text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-3 w-3 text-white" />
              <span>Approve & Publish Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
