import React, { useState } from "react";
import {
  Instagram,
  ShieldCheck,
  KeyRound,
  CircleHelp,
  ExternalLink,
  CheckCircle2,
  X,
  ArrowRight,
} from "lucide-react";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAccount: string;
  onSaveAccount: (accountName: string, accessToken?: string, accountId?: string) => Promise<void>;
  isFirstRun?: boolean;
}

export const InstagramAccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentAccount,
  onSaveAccount,
  isFirstRun = false,
}) => {
  const [handle, setHandle] = useState(currentAccount.startsWith("@") ? currentAccount.slice(1) : "");
  const [token, setToken] = useState("");
  const [accountId, setAccountId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await onSaveAccount(handle, token, accountId);
      setSuccessMsg(`Connected ${handle ? `@${handle}` : "your Instagram account"} successfully.`);
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1200);
    } catch (error: any) {
      setErrorMsg(error.message || "We could not verify these credentials. Check the account ID, token, and permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-2xl overflow-hidden rounded-[24px] border border-white/15 bg-[#101827]/95 shadow-2xl text-[#E0E0E0]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-gradient-to-br from-[#ffb3d1] via-[#e779ae] to-[#8d7dff] text-white shadow-lg shadow-pink-500/20">
              <Instagram className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight text-white">{isFirstRun ? "Connect your Instagram" : "Instagram account settings"}</h3>
              <p className="mt-0.5 text-xs text-slate-400">Your account, your token, your publishing channel.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white" aria-label="Close setup">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["1", "Use a Professional account", "Connect it to a Facebook Page in Instagram settings."],
              ["2", "Create or open a Meta app", "Use the Instagram Platform tools and request publishing permissions."],
              ["3", "Copy your ID and token", "Get both from Meta Graph API Explorer, then paste them below."],
            ].map(([number, title, description]) => (
              <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                <div className="mb-2 grid h-6 w-6 place-items-center rounded-full bg-white/10 text-[10px] font-bold text-[#a9ceff]">{number}</div>
                <div className="text-xs font-semibold text-white">{title}</div>
                <div className="mt-1 text-[10px] leading-relaxed text-slate-400">{description}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Instagram username <span className="normal-case tracking-normal text-slate-500">(optional)</span></span>
              <div className="flex items-center rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 focus-within:border-[#78aaff]/70">
                <span className="mr-1.5 text-sm text-slate-500">@</span>
                <input value={handle} onChange={(event) => setHandle(event.target.value.replace(/^@/, ""))} placeholder="your_business_account" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600" />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Instagram Business ID</span>
              <input required value={accountId} onChange={(event) => setAccountId(event.target.value)} placeholder="17841400000000000" className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#78aaff]/70" />
              <span className="mt-1.5 block text-[10px] text-slate-500">Usually returned from `me/accounts?fields=instagram_business_account`.</span>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400"><KeyRound className="h-3.5 w-3.5 text-[#a9ceff]" /> Meta access token</span>
            <input required type="password" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Paste your token beginning with EAA..." className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#78aaff]/70" />
            <span className="mt-1.5 block text-[10px] text-slate-500">Use a token with Instagram content publishing and comment-management permissions.</span>
          </label>

          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <a href="https://developers.facebook.com/tools/explorer/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white">Open Graph API Explorer <ExternalLink className="h-3 w-3" /></a>
            <a href="https://developers.facebook.com/documentation/instagram-platform/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white">Read Meta setup guide <ExternalLink className="h-3 w-3" /></a>
          </div>

          {successMsg && <div className="flex items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-3 text-xs text-emerald-200"><CheckCircle2 className="h-4 w-4" />{successMsg}</div>}
          {errorMsg && <div className="rounded-xl border border-rose-400/25 bg-rose-400/10 p-3 text-xs leading-relaxed text-rose-200">{errorMsg}</div>}

          <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.035] p-3 text-[11px] leading-relaxed text-slate-400"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" /><span>The token is accepted only by the server endpoint, kept in server memory, and never returned to the client. Live publishing remains behind the human approval gate.</span></div>

          <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            {isFirstRun ? <button type="button" onClick={onClose} className="text-xs text-slate-500 transition hover:text-white">Continue in preview mode</button> : <span />}
            <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#78b2ff] to-[#9b8cff] px-4 py-2.5 text-xs font-bold text-[#08101d] shadow-lg shadow-[#78b2ff]/15 transition hover:-translate-y-0.5 hover:shadow-[#78b2ff]/25 disabled:cursor-not-allowed disabled:opacity-50">{isSaving ? "Verifying connection…" : "Connect my Instagram"}<ArrowRight className="h-3.5 w-3.5" /></button>
          </div>
        </form>
      </div>
    </div>
  );
};
