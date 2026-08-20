import React, { useState } from "react";
import { Brain, CheckCircle2, ExternalLink, KeyRound, Mic2, Sparkles, Video, Eye, X, ArrowRight } from "lucide-react";

type TaskKey = "text" | "vision" | "video" | "voice";

interface ModelOption {
  provider: string;
  model: string;
  label: string;
  note: string;
  price: string;
}

interface ModelSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Record<TaskKey, { provider: string; model: string; apiKey: string }>) => Promise<void>;
  recommendations: Record<TaskKey, ModelOption[]>;
  currentSettings: Record<TaskKey, { provider: string; model: string; configured: boolean }>;
  isFirstRun?: boolean;
}

const taskMeta: Record<TaskKey, { title: string; description: string; icon: React.ElementType; required: boolean }> = {
  text: { title: "Text & scripts", description: "Hooks, scripts, captions, replies, and strategy.", icon: Brain, required: true },
  vision: { title: "Vision & quality", description: "Visual checks and scene quality analysis.", icon: Eye, required: false },
  video: { title: "Video generation", description: "The built-in MP4 renderer works without a key.", icon: Video, required: false },
  voice: { title: "Voice narration", description: "Optional narration for future voice workflows.", icon: Mic2, required: false },
};

export const ModelSetupModal: React.FC<ModelSetupModalProps> = ({ isOpen, onClose, onSave, recommendations, currentSettings, isFirstRun = false }) => {
  const [activeTask, setActiveTask] = useState<TaskKey>("text");
  const [values, setValues] = useState<Record<TaskKey, { provider: string; model: string; apiKey: string }>>({
    text: { provider: currentSettings.text?.provider || "", model: currentSettings.text?.model || "", apiKey: "" },
    vision: { provider: currentSettings.vision?.provider || "", model: currentSettings.vision?.model || "", apiKey: "" },
    video: { provider: currentSettings.video?.provider || "", model: currentSettings.video?.model || "", apiKey: "" },
    voice: { provider: currentSettings.voice?.provider || "", model: currentSettings.voice?.model || "", apiKey: "" },
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const active = taskMeta[activeTask];
  const ActiveIcon = active.icon;
  const options = recommendations[activeTask] || [];
  const current = values[activeTask];

  const chooseModel = (option: ModelOption) => {
    setValues((previous) => ({ ...previous, [activeTask]: { ...previous[activeTask], provider: option.provider, model: option.model } }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave(values);
      onClose();
    } catch (err: any) {
      setError(err.message || "Could not save model setup.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl overflow-hidden rounded-[24px] border border-white/15 bg-[#101827]/95 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-[14px] bg-gradient-to-br from-[#a9ceff] to-[#9b8cff] text-[#09111f]"><Sparkles className="h-5 w-5" /></div><div><h3 className="text-base font-semibold tracking-tight">{isFirstRun ? "Choose your AI stack" : "AI model settings"}</h3><p className="mt-0.5 text-xs text-slate-400">Bring your own keys. The agent uses the models you select.</p></div></div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white" aria-label="Close model setup"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={submit} className="grid lg:grid-cols-[210px_1fr]">
          <aside className="border-b border-white/10 bg-black/10 p-3 lg:border-b-0 lg:border-r">
            <div className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Configure tasks</div>
            {(Object.keys(taskMeta) as TaskKey[]).map((task) => {
              const meta = taskMeta[task];
              const Icon = meta.icon;
              const configured = currentSettings[task]?.configured;
              return <button type="button" key={task} onClick={() => setActiveTask(task)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left transition ${activeTask === task ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/[0.05] hover:text-white"}`}><Icon className="h-4 w-4" /><span className="flex-1 text-xs font-semibold">{meta.title}</span>{configured && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />}</button>;
            })}
            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-[10px] leading-relaxed text-slate-500"><KeyRound className="mb-2 h-4 w-4 text-[#a9ceff]" />Keys remain server-side and are never returned to the browser. Text is required before Reel generation; video uses the built-in renderer by default.</div>
          </aside>

          <section className="p-5">
            <div className="mb-4 flex items-start gap-3"><div className="rounded-xl bg-[#a9ceff]/10 p-2 text-[#a9ceff]"><ActiveIcon className="h-4 w-4" /></div><div><h4 className="text-sm font-semibold">{active.title} {active.required && <span className="ml-1 rounded-full bg-[#a9ceff]/15 px-2 py-0.5 text-[10px] text-[#a9ceff]">Required</span>}</h4><p className="mt-1 text-xs text-slate-400">{active.description}</p></div></div>

            <div className="grid gap-3 md:grid-cols-3">
              {options.map((option) => { const selected = current.provider === option.provider && current.model === option.model; return <button type="button" key={`${option.provider}-${option.model}`} onClick={() => chooseModel(option)} className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 ${selected ? "border-[#a9ceff]/70 bg-[#a9ceff]/10 shadow-lg shadow-[#a9ceff]/10" : "border-white/10 bg-white/[0.035] hover:border-white/25"}`}><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-white">{option.label}</span>{selected && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#a9ceff]" />}</div><p className="mt-2 text-[10px] leading-relaxed text-slate-400">{option.note}</p><p className="mt-3 text-[10px] font-medium text-slate-500">{option.price}</p></button>; })}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[150px_1fr]">
              <label className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Provider</span><input value={current.provider} onChange={(event) => setValues((previous) => ({ ...previous, [activeTask]: { ...previous[activeTask], provider: event.target.value } }))} placeholder="openai" className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#a9ceff]/70" /></label>
              <label className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Model ID</span><input value={current.model} onChange={(event) => setValues((previous) => ({ ...previous, [activeTask]: { ...previous[activeTask], model: event.target.value } }))} placeholder="Select a recommendation above" className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#a9ceff]/70" /></label>
            </div>
            <label className="mt-3 block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">{currentSettings[activeTask]?.configured ? "Replace API key (optional)" : "API key"} {active.required && <span className="text-[#a9ceff]">required</span>}</span><input type="password" required={activeTask === "text" && !currentSettings.text?.configured} value={current.apiKey} onChange={(event) => setValues((previous) => ({ ...previous, [activeTask]: { ...previous[activeTask], apiKey: event.target.value } }))} placeholder={currentSettings[activeTask]?.configured ? "Leave blank to keep the current server key" : "Paste provider key"} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#a9ceff]/70" /></label>

            <div className="mt-4 flex flex-wrap gap-2 text-[10px]"><a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-slate-400 hover:text-white">OpenAI keys <ExternalLink className="h-3 w-3" /></a><a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-slate-400 hover:text-white">Anthropic keys <ExternalLink className="h-3 w-3" /></a><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-slate-400 hover:text-white">Google keys <ExternalLink className="h-3 w-3" /></a></div>
            {error && <div className="mt-4 rounded-xl border border-rose-400/25 bg-rose-400/10 p-3 text-xs text-rose-200">{error}</div>}

            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between"><span className="text-[10px] text-slate-500">Choose at least a text model to unlock Reel creation.</span><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#a9ceff] to-[#9b8cff] px-4 py-2.5 text-xs font-bold text-[#08101d] transition hover:-translate-y-0.5 disabled:opacity-50">{saving ? "Saving securely…" : "Save AI setup"}<ArrowRight className="h-3.5 w-3.5" /></button></div>
          </section>
        </form>
      </div>
    </div>
  );
};
