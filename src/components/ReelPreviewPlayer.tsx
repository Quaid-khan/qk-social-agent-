import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Eye,
  CheckCircle,
  Share2,
  Bookmark,
  Heart,
  MessageCircle,
  Clock,
  Sparkles,
  Sliders,
  Layers,
  Edit3,
  Copy,
  Download,
  Check,
} from "lucide-react";
import { ReelItem, SceneBodyPart } from "../types";

interface ReelPreviewPlayerProps {
  reel: ReelItem;
  onApprove?: (id: string) => void;
  onEdit?: (reel: ReelItem) => void;
  showApprovalControls?: boolean;
}

export const ReelPreviewPlayer: React.FC<ReelPreviewPlayerProps> = ({
  reel,
  onApprove,
  onEdit,
  showApprovalControls = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeHookVariant, setActiveHookVariant] = useState<"A" | "B">("A");
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const duration = reel.duration || 24;
  const scenes = reel.script.bodyParts || [];

  // Determine current active scene based on time
  useEffect(() => {
    if (scenes.length === 0) return;
    const sceneDuration = duration / scenes.length;
    const currentIdx = Math.min(
      Math.floor(currentTime / sceneDuration),
      scenes.length - 1
    );
    setActiveSceneIndex(currentIdx >= 0 ? currentIdx : 0);
  }, [currentTime, duration, scenes.length]);

  // Timer loop for playback simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(prev + 0.1, duration);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  // Text to speech voice narration
  const speakCurrentScene = (text: string) => {
    if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.15; // Natural high-energy reel cadence
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Playback speech sync
  useEffect(() => {
    if (isPlaying && !isMuted) {
      const currentScene = scenes[activeSceneIndex] || scenes[0];
      if (currentScene?.voiceover) {
        speakCurrentScene(currentScene.voiceover);
      }
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [activeSceneIndex, isPlaying, isMuted]);
  // Canvas visual rendering animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let frameCount = 0;

    const currentScene = scenes[activeSceneIndex] || scenes[0];
    const bRollType = currentScene?.bRollTag || "cyber_grid";

    const render = () => {
      frameCount++;
      const width = canvas.width;
      const height = canvas.height;

      // Background base
      ctx.fillStyle = "#090D16";
      ctx.fillRect(0, 0, width, height);

      // Render preset shader style
      if (bRollType === "cyber_grid") {
        // Perspective Grid Lines
        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
        ctx.lineWidth = 1.5;
        const horizon = height * 0.45;
        const offset = (frameCount * 1.5) % 40;

        for (let y = horizon; y < height; y += 25) {
          const perspectiveY = y + offset;
          if (perspectiveY < height) {
            ctx.beginPath();
            ctx.moveTo(0, perspectiveY);
            ctx.lineTo(width, perspectiveY);
            ctx.stroke();
          }
        }

        for (let x = -width; x < width * 2; x += 35) {
          ctx.beginPath();
          ctx.moveTo(width / 2, horizon);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // Floating neon glow
        const gradient = ctx.createRadialGradient(width / 2, horizon, 10, width / 2, horizon, 140);
        gradient.addColorStop(0, "rgba(56, 189, 248, 0.4)");
        gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      } else if (bRollType === "neural_network") {
        // Connected Graph Nodes
        ctx.fillStyle = "#0F172A";
        ctx.fillRect(0, 0, width, height);

        const nodes = [
          { x: width * 0.3, y: height * 0.3 + Math.sin(frameCount * 0.05) * 15 },
          { x: width * 0.7, y: height * 0.25 + Math.cos(frameCount * 0.04) * 20 },
          { x: width * 0.5, y: height * 0.5 + Math.sin(frameCount * 0.03) * 10 },
          { x: width * 0.25, y: height * 0.7 + Math.cos(frameCount * 0.05) * 15 },
          { x: width * 0.75, y: height * 0.65 + Math.sin(frameCount * 0.04) * 20 },
        ];

        // Draw connections
        ctx.strokeStyle = "rgba(129, 140, 248, 0.4)";
        ctx.lineWidth = 2;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

        // Draw glowing nodes
        nodes.forEach((node, idx) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = idx === 2 ? "#38BDF8" : "#818CF8";
          ctx.fill();
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      } else if (bRollType === "terminal_speed" || bRollType === "data_stream") {
        // High-velocity Matrix/Code Stream
        ctx.fillStyle = "rgba(10, 15, 29, 0.25)";
        ctx.fillRect(0, 0, width, height);

        ctx.font = "12px JetBrains Mono, monospace";
        ctx.fillStyle = "#34D399";
        for (let i = 0; i < 8; i++) {
          const x = 30 + i * 40;
          const y = ((frameCount * (i + 3)) % (height - 100)) + 60;
          ctx.fillText(`0x${(frameCount * 7 + i).toString(16)}`, x, y);
          ctx.fillText(`EXEC_AGENT_TRACE`, x, (y + 40) % height);
        }
      } else {
        // Blueprint / Schematic Style
        ctx.strokeStyle = "rgba(56, 189, 248, 0.15)";
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Center rotating radar
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((frameCount * 0.02) % (Math.PI * 2));
        ctx.strokeStyle = "rgba(244, 63, 94, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 1.5);
        ctx.stroke();
        ctx.restore();
      }

      // Audio waveform bar simulation at bottom
      if (isPlaying && !isMuted) {
        const barCount = 24;
        const barWidth = 3;
        const startX = width / 2 - (barCount * 6) / 2;
        ctx.fillStyle = "rgba(56, 189, 248, 0.8)";
        for (let b = 0; b < barCount; b++) {
          const barHeight = Math.abs(Math.sin(frameCount * 0.2 + b * 0.5)) * 24 + 4;
          ctx.fillRect(startX + b * 6, height - 90 - barHeight / 2, barWidth, barHeight);
        }
      }

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrame);
  }, [activeSceneIndex, isPlaying, isMuted, scenes]);

  const activeScene = scenes[activeSceneIndex] || scenes[0];
  const hookToDisplay = activeHookVariant === "A" ? reel.script.hook : reel.script.hookVariantB || reel.script.hook;

  return (
    <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm p-4 shadow-xs text-[#E0E0E0]">
      {/* Title & Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#2A2A2C] gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] text-emerald-400 border border-[#2A2A2C]">
              {reel.status.replace("_", " ")}
            </span>
            <span className="text-[10px] text-[#888888] font-mono">ID: {reel.id}</span>
            <span className="text-[10px] text-[#888888] font-mono">Duration: {duration}s (9:16 Vertical)</span>
          </div>
          <h2 className="text-sm font-bold text-white font-mono mt-1">{reel.title}</h2>
          <p className="text-[10px] text-[#888888]">Target: {reel.targetAudience} • Topic: {reel.topic}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {reel.script.hookVariantB && (
            <div className="flex items-center bg-[#0F0F10] p-0.5 rounded-xs border border-[#2A2A2C] text-xs">
              <span className="text-[10px] text-[#888888] font-mono mr-1.5 ml-1">Variant:</span>
              <button
                onClick={() => setActiveHookVariant("A")}
                className={`px-1.5 py-0.2 rounded-xs text-[10px] font-mono font-bold transition cursor-pointer ${
                  activeHookVariant === "A" ? "bg-[#FF3E00] text-white" : "text-[#888888] hover:text-white"
                }`}
              >
                A (Shock)
              </button>
              <button
                onClick={() => setActiveHookVariant("B")}
                className={`px-1.5 py-0.2 rounded-xs text-[10px] font-mono font-bold transition cursor-pointer ${
                  activeHookVariant === "B" ? "bg-[#FF3E00] text-white" : "text-[#888888] hover:text-white"
                }`}
              >
                B (Question)
              </button>
            </div>
          )}

          <button
            onClick={() => setShowSafeZones(!showSafeZones)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-xs text-[10px] font-mono font-medium border transition cursor-pointer ${
              showSafeZones
                ? "bg-amber-500/20 text-amber-300 border-amber-500/60"
                : "bg-[#1A1A1C] text-[#C0C0C0] border-[#2A2A2C] hover:bg-[#222226]"
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Safe Zones</span>
          </button>

          {/* Copy Script Button */}
          <button
            onClick={() => {
              const fullScriptText = `HOOK: ${hookToDisplay}\n\nSCENES:\n${scenes
                .map(
                  (s) =>
                    `[${s.timeRange}] Overlay: ${s.overlayText.replace("\n", " ")}\nVoiceover: ${s.voiceover}\nVisual: ${s.visual}`
                )
                .join("\n\n")}`;
              navigator.clipboard.writeText(fullScriptText);
              setCopiedScript(true);
              setTimeout(() => setCopiedScript(false), 2000);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xs bg-[#1A1A1C] hover:bg-[#222226] text-[#C0C0C0] hover:text-white border border-[#2A2A2C] text-[10px] font-mono transition cursor-pointer"
            title="Copy Full Script to Clipboard"
          >
            {copiedScript ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copiedScript ? "Copied Script!" : "Copy Script"}</span>
          </button>

          {/* Export JSON Bundle Button */}
          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reel, null, 2));
              const downloadAnchor = document.createElement("a");
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `${reel.id}_reel_package.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xs bg-[#1A1A1C] hover:bg-[#222226] text-[#C0C0C0] hover:text-white border border-[#2A2A2C] text-[10px] font-mono transition cursor-pointer"
            title="Download complete Reel package as JSON"
          >
            <Download className="h-3 w-3 text-[#38bdf8]" />
            <span>Export Bundle</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Player on Left, Scene & Caption Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        {/* Left Column: 9:16 Phone Mockup Viewport */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-[280px] h-[498px] bg-black rounded-[28px] p-2.5 shadow-2xl border-2 border-[#2A2A2C] overflow-hidden select-none">
            {/* Phone Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-3.5 bg-[#121214] rounded-full z-30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-black mr-2" />
              <div className="w-1 h-1 rounded-full bg-[#2A2A2C]" />
            </div>

            {/* Video Canvas Element */}
            <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-[#0A0A0B]">
              <canvas
                ref={canvasRef}
                width={280}
                height={498}
                className="w-full h-full object-cover"
              />

              {/* Safe Zone Boundary Guidelines Overlay */}
              {showSafeZones && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  {/* Top Header Safe Zone */}
                  <div className="h-[15%] w-full bg-amber-500/15 border-b border-amber-500/40 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-amber-300 bg-black/70 px-1 py-0.2 rounded">
                      TOP SAFE ZONE (App Header)
                    </span>
                  </div>
                  {/* Bottom Caption Safe Zone */}
                  <div className="absolute bottom-0 h-[22%] w-full bg-amber-500/15 border-t border-amber-500/40 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-amber-300 bg-black/70 px-1 py-0.2 rounded">
                      BOTTOM SAFE ZONE (Captions)
                    </span>
                  </div>
                  {/* Right Action Icons Zone */}
                  <div className="absolute right-0 top-[35%] bottom-[25%] w-[18%] bg-[#FF3E00]/15 border-l border-[#FF3E00]/40 flex items-center justify-center">
                    <span className="text-[7px] font-mono text-[#FF3E00] -rotate-90 bg-black/70 px-1 py-0.2 rounded">
                      ACTIONS
                    </span>
                  </div>
                </div>
              )}

              {/* Instagram Floating Actions UI (Mock Overlay) */}
              <div className="absolute right-2.5 bottom-20 flex flex-col items-center space-y-3 z-10 text-white drop-shadow-md">
                <div className="flex flex-col items-center">
                  <div className="h-7 w-7 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center">
                    <Heart className="h-3.5 w-3.5 text-[#FF3E00] fill-[#FF3E00]" />
                  </div>
                  <span className="text-[9px] font-mono mt-0.5">{reel.likes || "3.8k"}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-7 w-7 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center">
                    <MessageCircle className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-[9px] font-mono mt-0.5">{reel.comments || "412"}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-7 w-7 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center">
                    <Bookmark className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  </div>
                  <span className="text-[9px] font-mono mt-0.5">{reel.saves || "2.9k"}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-7 w-7 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center">
                    <Share2 className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-[9px] font-mono mt-0.5">{reel.shares || "1.2k"}</span>
                </div>
              </div>

              {/* Dynamic On-Screen Overlay Text (Synchronized with Scene) */}
              <div className="absolute inset-x-3 top-[30%] z-10 flex flex-col items-center text-center">
                {activeSceneIndex === 0 ? (
                  <div className="animate-fade-in">
                    <span className="inline-block px-2 py-0.5 rounded-xs bg-[#FF3E00] text-white font-extrabold text-[10px] tracking-wider uppercase shadow-xs mb-1.5 font-mono">
                      HOOK ⚡
                    </span>
                    <h3 className="text-xs font-black text-white leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] bg-black/60 p-2 rounded-xs border border-white/20">
                      {hookToDisplay}
                    </h3>
                  </div>
                ) : (
                  <div className="animate-fade-in w-full">
                    <div className="inline-block px-2 py-0.5 rounded-xs bg-[#38bdf8] text-black font-black text-[10px] tracking-wider uppercase shadow-xs mb-1.5 font-mono">
                      {activeScene?.overlayText || "INSIGHT"}
                    </div>
                    <div className="bg-[#0F0F10]/90 backdrop-blur-xs p-2 rounded-xs border border-[#2A2A2C] text-xs text-white text-left font-mono">
                      <div className="flex items-center space-x-1 text-[#38bdf8] mb-0.5 text-[9px] uppercase font-bold">
                        <Sparkles className="h-2.5 w-2.5" />
                        <span>Scene {activeScene?.sceneNum} • {activeScene?.timeRange}</span>
                      </div>
                      <p className="text-[#E0E0E0] text-[10px] leading-snug">
                        "{activeScene?.voiceover}"
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Caption Bar Preview */}
              <div className="absolute inset-x-2.5 bottom-3 z-10 bg-gradient-to-t from-black via-black/85 to-transparent p-2 rounded-b-xs">
                <div className="flex items-center space-x-1.5 mb-1">
                  <div className="h-4 w-4 rounded-xs bg-[#FF3E00] flex items-center justify-center text-[8px] font-bold text-white">
                    QK
                  </div>
                  <span className="text-[10px] font-bold text-white font-mono">@techforge.ai</span>
                  <span className="text-[8px] text-[#38bdf8] font-mono">• Follow</span>
                </div>
                <p className="text-[9px] text-[#C0C0C0] line-clamp-2">
                  {reel.script.caption}
                </p>
              </div>

              {/* Scrub Progress Bar inside Phone */}
              <div className="absolute top-2 inset-x-2.5 h-0.5 bg-white/20 rounded-full overflow-hidden z-20">
                <div
                  className="h-full bg-[#FF3E00] transition-all duration-100"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Video Controls Bar */}
          <div className="w-full max-w-[280px] flex items-center justify-between mt-3 px-2 bg-[#0F0F10] p-2 rounded-xs border border-[#2A2A2C] text-xs">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-7 w-7 rounded-xs bg-[#FF3E00] hover:bg-[#E03700] text-white flex items-center justify-center transition cursor-pointer"
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
            </button>

            <button
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(true);
              }}
              className="h-7 w-7 rounded-xs bg-[#1A1A1C] hover:bg-[#222226] text-[#C0C0C0] flex items-center justify-center transition cursor-pointer"
              title="Restart"
            >
              <RotateCcw className="h-3 w-3" />
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="h-7 w-7 rounded-xs bg-[#1A1A1C] hover:bg-[#222226] text-[#C0C0C0] flex items-center justify-center transition cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-3 w-3 text-rose-400" /> : <Volume2 className="h-3 w-3 text-[#38bdf8]" />}
            </button>

            <div className="font-mono text-[#888888] text-[10px]">
              {currentTime.toFixed(1)}s / {duration}s
            </div>
          </div>
        </div>

        {/* Right Column: Scene Breakdown, Captions, and Quality Breakdown */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          {/* Quality Control Audit Card */}
          <div className="bg-[#161618] border border-[#2A2A2C] rounded-xs p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-white font-mono">
                  Pre-Flight Quality Control Audit
                </h4>
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-xs bg-[#1A1A1C] text-emerald-400 border border-[#2A2A2C]">
                Score: {reel.qualityScore?.overall || 95}/100
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-xs mb-2">
              <div className="bg-[#0F0F10] p-1.5 rounded-xs border border-[#2A2A2C]">
                <span className="text-[9px] text-[#888888] font-mono uppercase block">Hook Impact</span>
                <span className="font-bold text-[#38bdf8] font-mono text-xs">{reel.qualityScore?.hookImpact || 96}%</span>
              </div>
              <div className="bg-[#0F0F10] p-1.5 rounded-xs border border-[#2A2A2C]">
                <span className="text-[9px] text-[#888888] font-mono uppercase block">Visual Polish</span>
                <span className="font-bold text-indigo-400 font-mono text-xs">{reel.qualityScore?.visualPolish || 94}%</span>
              </div>
              <div className="bg-[#0F0F10] p-1.5 rounded-xs border border-[#2A2A2C]">
                <span className="text-[9px] text-[#888888] font-mono uppercase block">Pacing (Sub-85w)</span>
                <span className="font-bold text-emerald-400 font-mono text-xs">{reel.qualityScore?.retentionPacing || 95}%</span>
              </div>
              <div className="bg-[#0F0F10] p-1.5 rounded-xs border border-[#2A2A2C]">
                <span className="text-[9px] text-[#888888] font-mono uppercase block">Safe-Zone</span>
                <span className="font-bold text-[#FF3E00] font-mono text-xs">{reel.qualityScore?.compliance || 100}%</span>
              </div>
            </div>

            <p className="text-[10px] text-[#888888] font-mono">
              "{reel.qualityScore?.notes || "Compliant with 9:16 Instagram Reels algorithm standards."}"
            </p>
          </div>

          {/* Timed Scenes Step-by-Step Breakdown */}
          <div className="bg-[#161618] border border-[#2A2A2C] rounded-xs p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <Layers className="h-3.5 w-3.5 text-[#38bdf8]" />
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-white font-mono">
                  Timed Scene Script Breakdown
                </h4>
              </div>
              <span className="text-[10px] text-[#888888] font-mono">
                {scenes.length} Scenes • Rapid 2.5s Cuts
              </span>
            </div>

            <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
              {scenes.map((scene, idx) => {
                const isCurrent = idx === activeSceneIndex;
                return (
                  <div
                    key={scene.sceneNum}
                    onClick={() => {
                      setActiveSceneIndex(idx);
                      const sceneTime = (duration / scenes.length) * idx;
                      setCurrentTime(sceneTime);
                    }}
                    className={`p-2.5 rounded-xs border text-xs transition cursor-pointer ${
                      isCurrent
                        ? "bg-[#1A1A1C] border-[#38bdf8] shadow-xs"
                        : "bg-[#0F0F10] border-[#2A2A2C] hover:border-[#444446]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`font-bold font-mono px-1 py-0.2 rounded-xs text-[9px] ${
                            isCurrent ? "bg-[#38bdf8] text-black" : "bg-[#1A1A1C] text-[#888888]"
                          }`}
                        >
                          S{scene.sceneNum}
                        </span>
                        <span className="font-mono text-[10px] text-[#888888]">{scene.timeRange}</span>
                        <span className="px-1 py-0.2 rounded-xs bg-[#1A1A1C] text-[#C0C0C0] text-[9px] font-mono border border-[#2A2A2C]">
                          {scene.bRollTag}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-[#888888] uppercase tracking-wider truncate max-w-[120px]">
                        {scene.overlayText.split("\n")[0]}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-300 mt-1 font-mono">
                      <div>
                        <span className="text-[9px] text-[#666666] font-bold uppercase block">Visual Cue:</span>
                        <p className="text-[10px] text-[#A0A0A0] line-clamp-1">{scene.visual}</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#666666] font-bold uppercase block">Voiceover:</span>
                        <p className="text-[10px] text-[#38bdf8] line-clamp-1">"{scene.voiceover}"</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Caption & Hashtag Cluster */}
          <div className="bg-[#161618] border border-[#2A2A2C] rounded-xs p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#888888]">
                Instagram Caption & Hashtags
              </span>
              <span className="text-[9px] text-[#FF3E00] font-mono">
                Keyword Trigger: Comment 'AGENT'
              </span>
            </div>
            <div className="bg-[#0F0F10] p-2.5 rounded-xs border border-[#2A2A2C] text-[10px] text-[#C0C0C0] font-mono whitespace-pre-line max-h-20 overflow-y-auto scrollbar-thin">
              {reel.script.caption}
            </div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {reel.script.hashtags?.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.2 rounded-xs bg-[#0F0F10] border border-[#2A2A2C] text-[9px] font-mono text-[#888888]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
