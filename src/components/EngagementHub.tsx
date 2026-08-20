import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  CheckCircle2,
  Clock,
  User,
  Heart,
  RefreshCw,
} from "lucide-react";

interface CommentItem {
  id: string;
  reelTitle: string;
  userHandle: string;
  comment: string;
  timestamp: string;
  sentiment: "positive" | "question" | "keyword_dm";
  aiReply?: string;
  replied: boolean;
}

export const EngagementHub: React.FC = () => {
  const [comments, setComments] = useState<CommentItem[]>([]);

  const [activeReplyingId, setActiveReplyingId] = useState<string | null>(null);
  const [customReply, setCustomReply] = useState("");

  const handleGenerateReply = async (item: CommentItem) => {
    setActiveReplyingId(item.id);
    try {
      const res = await fetch("/api/engagement/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentText: item.comment, userHandle: item.userHandle }),
      });
      const data = await res.json();
      if (data.reply) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === item.id ? { ...c, aiReply: data.reply, replied: true } : c
          )
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActiveReplyingId(null);
    }
  };

  const handleSendCustom = (id: string) => {
    if (!customReply.trim()) return;
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, aiReply: customReply, replied: true } : c))
    );
    setCustomReply("");
  };

  return (
    <div className="space-y-4 text-[#E0E0E0]">
      {/* Header Banner */}
      <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#2A2A2C] gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xs bg-[#1A1A1C] border border-[#2A2A2C] flex items-center justify-center text-[#FF3E00]">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  EngagementAgent Hub
                </h2>
                <span className="px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] text-cyan-400 border border-cyan-800 text-[9px] font-mono font-bold uppercase">
                  Comment & DM Automation
                </span>
              </div>
              <p className="text-[10px] text-[#888888] font-mono">
                Automated sentiment tagging, contextual engineering replies, and lead keyword deliveries.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-xs bg-[#1A1A1C] border border-[#2A2A2C] text-[#C0C0C0]">
              Auto-Reply: <strong className="text-emerald-400">ACTIVE</strong>
            </span>
          </div>
        </div>

        {/* Comment Inbox List */}
        <div className="space-y-2.5 mt-3">
          {comments.length === 0 ? (
            <div className="text-center py-10 text-[#888888] font-mono text-xs border border-dashed border-[#2A2A2C] rounded-xs p-6 bg-[#0F0F10]">
              <MessageSquare className="h-8 w-8 text-[#555555] mx-auto mb-2" />
              <p className="text-white font-semibold mb-1">No Comments or Inbound Messages Yet</p>
              <p className="text-[#666666] max-w-sm mx-auto">
                Once Reels are live on Instagram, audience comments and automatic keyword DMs will show up here.
              </p>
            </div>
          ) : (
            comments.map((item) => {
              const isKeyword = item.sentiment === "keyword_dm";
              const isReplying = activeReplyingId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-3 hover:border-[#444446] transition"
                >
                <div className="flex items-center justify-between mb-1.5 font-mono">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 rounded-xs bg-[#1A1A1C] border border-[#2A2A2C] text-[#38bdf8] flex items-center justify-center text-[10px] font-bold font-mono">
                      @{item.userHandle[0].toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-white">@{item.userHandle}</span>
                    <span className="text-[10px] text-[#666666]">• {item.timestamp}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs border ${
                        isKeyword
                          ? "bg-[#1A1112] text-rose-400 border-rose-800"
                          : item.sentiment === "question"
                          ? "bg-[#1A1A1C] text-amber-400 border-amber-800"
                          : "bg-[#1A1A1C] text-emerald-400 border-emerald-800"
                      }`}
                    >
                      {item.sentiment === "keyword_dm" ? "Keyword 'AGENT' DM Trigger" : item.sentiment.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#C0C0C0] pl-7 mb-2 font-mono">"{item.comment}"</p>

                {/* AI Reply State */}
                {item.replied && item.aiReply ? (
                  <div className="ml-7 p-2.5 rounded-xs bg-[#161618] border border-[#2A2A2C] text-xs font-mono">
                    <div className="flex items-center space-x-1 text-[#38bdf8] font-semibold mb-0.5 text-[10px]">
                      <Bot className="h-3 w-3" />
                      <span>EngagementAgent Dispatched Reply:</span>
                    </div>
                    <p className="text-white text-[11px] leading-relaxed">{item.aiReply}</p>
                  </div>
                ) : (
                  <div className="ml-7 flex items-center space-x-2 font-mono">
                    <button
                      onClick={() => handleGenerateReply(item)}
                      disabled={isReplying}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded-xs bg-[#FF3E00] hover:bg-[#E03700] text-white text-xs font-bold transition cursor-pointer"
                    >
                      {isReplying ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3" />
                          <span>Auto-Generate AI Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
};
