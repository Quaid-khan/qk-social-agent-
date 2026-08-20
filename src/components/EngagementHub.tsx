import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  RefreshCw,
  CircleAlert,
} from "lucide-react";

interface CommentItem {
  id: string;
  mediaId: string;
  reelTitle: string;
  userHandle: string;
  comment: string;
  timestamp: string;
  sentiment: "positive" | "question" | "keyword_dm";
  aiReply?: string;
  replied: boolean;
  sent?: boolean;
}

export const EngagementHub: React.FC = () => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [activeReplyingId, setActiveReplyingId] = useState<string | null>(null);
  const [customReplies, setCustomReplies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const loadComments = async () => {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/engagement/comments");
      const data = await res.json();
      setComments(data.comments || []);
      if (!data.success) setNotice(data.reason || "Instagram comments are not available yet.");
      else if (!data.live) setNotice(data.reason || "Live comment access is not configured.");
    } catch (error: any) {
      setNotice(error.message || "Could not load Instagram comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const sendReply = async (item: CommentItem, replyText?: string) => {
    setActiveReplyingId(item.id);
    setNotice(null);
    try {
      const res = await fetch("/api/engagement/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId: item.id,
          commentText: item.comment,
          userHandle: item.userHandle,
          replyText,
          send: true,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === item.id
              ? { ...comment, aiReply: data.reply, replied: true, sent: Boolean(data.sent) }
              : comment,
          ),
        );
      }
      if (!data.sent) setNotice(data.reason || "Reply drafted but not sent. Configure live Meta credentials to publish it.");
      setCustomReplies((prev) => ({ ...prev, [item.id]: "" }));
    } catch (error: any) {
      setNotice(error.message || "Could not send the reply.");
    } finally {
      setActiveReplyingId(null);
    }
  };

  return (
    <div className="space-y-4 text-[#E0E0E0]">
      <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#2A2A2C] gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xs bg-[#1A1A1C] border border-[#2A2A2C] flex items-center justify-center text-[#FF3E00]">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">EngagementAgent Hub</h2>
                <span className="px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] text-cyan-400 border border-cyan-800 text-[9px] font-mono font-bold uppercase">Live comment replies</span>
              </div>
              <p className="text-[10px] text-[#888888] font-mono">Fetches comments from published Reels and can post public replies through Meta.</p>
            </div>
          </div>
          <button onClick={loadComments} disabled={loading} className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xs bg-[#1A1A1C] border border-[#2A2A2C] text-xs font-mono text-[#C0C0C0] hover:text-white cursor-pointer disabled:opacity-50">
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh comments</span>
          </button>
        </div>

        {notice && (
          <div className="mt-3 flex items-start gap-2 border border-amber-800/70 bg-amber-950/20 rounded-xs p-2.5 text-[11px] font-mono text-amber-300">
            <CircleAlert className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        <div className="space-y-2.5 mt-3">
          {comments.length === 0 ? (
            <div className="text-center py-10 text-[#888888] font-mono text-xs border border-dashed border-[#2A2A2C] rounded-xs p-6 bg-[#0F0F10]">
              <MessageSquare className="h-8 w-8 text-[#555555] mx-auto mb-2" />
              <p className="text-white font-semibold mb-1">No live comments loaded</p>
              <p className="text-[#666666] max-w-sm mx-auto">Publish a Reel and grant the Meta comments permission, then refresh this inbox.</p>
            </div>
          ) : (
            comments.map((item) => {
              const isReplying = activeReplyingId === item.id;
              return (
                <div key={item.id} className="bg-[#0F0F10] border border-[#2A2A2C] rounded-xs p-3 hover:border-[#444446] transition">
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 rounded-xs bg-[#1A1A1C] border border-[#2A2A2C] text-[#38bdf8] flex items-center justify-center text-[10px] font-bold">{item.userHandle[0]?.toUpperCase() || "I"}</div>
                      <span className="text-xs font-bold text-white">@{item.userHandle}</span>
                      <span className="text-[10px] text-[#666666]">• {item.timestamp}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs border bg-[#1A1A1C] text-emerald-400 border-emerald-800">{item.sentiment.toUpperCase()}</span>
                  </div>
                  <p className="text-[10px] text-[#666666] pl-7 mb-1">{item.reelTitle}</p>
                  <p className="text-xs text-[#C0C0C0] pl-7 mb-2 font-mono">"{item.comment}"</p>

                  {item.replied && item.aiReply ? (
                    <div className="ml-7 p-2.5 rounded-xs bg-[#161618] border border-[#2A2A2C] text-xs font-mono">
                      <div className="flex items-center space-x-1 text-[#38bdf8] font-semibold mb-0.5 text-[10px]"><Bot className="h-3 w-3" /><span>{item.sent ? "Live Instagram reply sent" : "Reply draft"}</span></div>
                      <p className="text-white text-[11px] leading-relaxed">{item.aiReply}</p>
                    </div>
                  ) : (
                    <div className="ml-7 space-y-2 font-mono">
                      <div className="flex items-center gap-2">
                        <button onClick={() => sendReply(item)} disabled={isReplying} className="flex items-center space-x-1 px-2.5 py-1 rounded-xs bg-[#FF3E00] hover:bg-[#E03700] text-white text-xs font-bold transition cursor-pointer disabled:opacity-50">
                          {isReplying ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                          <span>{isReplying ? "Sending..." : "Generate and send"}</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input value={customReplies[item.id] || ""} onChange={(event) => setCustomReplies((prev) => ({ ...prev, [item.id]: event.target.value }))} placeholder="Or write a custom public reply" className="flex-1 min-w-0 bg-[#161618] border border-[#2A2A2C] rounded-xs px-2 py-1.5 text-[11px] text-white outline-none focus:border-[#38bdf8]" />
                        <button onClick={() => sendReply(item, customReplies[item.id])} disabled={isReplying || !customReplies[item.id]?.trim()} className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xs bg-[#1A1A1C] border border-[#2A2A2C] text-[#C0C0C0] text-xs cursor-pointer disabled:opacity-40"><Send className="h-3 w-3" /><span>Send</span></button>
                      </div>
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
