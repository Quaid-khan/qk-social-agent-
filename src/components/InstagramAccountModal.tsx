import React, { useState } from "react";
import { Instagram, ShieldCheck, Key, CheckCircle2, AlertCircle, ExternalLink, X } from "lucide-react";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAccount: string;
  onSaveAccount: (accountName: string, accessToken?: string, accountId?: string) => Promise<void>;
}

export const InstagramAccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentAccount,
  onSaveAccount,
}) => {
  const [handle, setHandle] = useState(currentAccount.replace("@", "") || "qk_create");
  const [token, setToken] = useState("");
  const [accountId, setAccountId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    try {
      await onSaveAccount(handle, token || undefined, accountId || undefined);
      setSuccessMsg(`Account @${handle} successfully linked and verified!`);
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to save account", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-[#121214] border border-[#2A2A2C] rounded-sm w-full max-w-lg shadow-2xl overflow-hidden text-[#E0E0E0] font-mono">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2A2A2C] bg-[#0F0F10]">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-xs bg-[#FF3E00] flex items-center justify-center text-white">
              <Instagram className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Link Instagram Account
              </h3>
              <span className="text-[9px] text-[#888888]">Meta Graph API & Channel Binding</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#888888] hover:text-white rounded-xs hover:bg-[#1A1A1C] transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {/* Active Target Banner */}
          <div className="bg-[#161618] border border-[#2A2A2C] rounded-xs p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                QK
              </div>
              <div>
                <span className="text-[10px] text-[#888888] block">Current Bound Target:</span>
                <span className="text-xs font-bold text-white">@{handle}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-xs bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-bold uppercase">
              ACTIVE BINDING
            </span>
          </div>

          {/* Handle Input */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#888888] mb-1">
              Instagram Handle
            </label>
            <div className="flex items-center bg-[#0F0F10] border border-[#2A2A2C] rounded-xs px-2.5 py-1.5 focus-within:border-[#FF3E00]">
              <span className="text-[#666666] text-xs mr-1">@</span>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="qk_create"
                required
                className="bg-transparent text-xs text-white focus:outline-none w-full font-mono"
              />
            </div>
          </div>

          {/* Account ID Input (Optional) */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#888888] mb-1">
              Instagram Business Account ID (Optional)
            </label>
            <input
              type="text"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="e.g. 17841400000000000"
              className="bg-[#0F0F10] border border-[#2A2A2C] rounded-xs px-2.5 py-1.5 focus:border-[#FF3E00] focus:outline-none text-xs text-white w-full font-mono"
            />
            <span className="text-[9px] text-[#666666] mt-0.5 block">
              Found via Graph API Explorer: <code className="text-[#888888]">GET me/accounts?fields=instagram_business_account</code>
            </span>
          </div>

          {/* Access Token Input (Optional) */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-[#888888] mb-1">
              Meta Long-Lived User Access Token (Optional)
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="EAA..."
              className="bg-[#0F0F10] border border-[#2A2A2C] rounded-xs px-2.5 py-1.5 focus:border-[#FF3E00] focus:outline-none text-xs text-white w-full font-mono"
            />
            <span className="text-[9px] text-[#666666] mt-0.5 block">
              If not provided, the agent operates in Hardened Simulation & Approval Sandbox mode.
            </span>
          </div>

          {/* Success Message */}
          {successMsg && (
            <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-2 rounded-xs text-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Security Guarantee */}
          <div className="flex items-start space-x-2 text-[10px] text-[#888888] bg-[#0F0F10] p-2.5 rounded-xs border border-[#2A2A2C]">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              All tokens are encrypted in server-memory only and never logged or exposed to the client. Pre-flight approval hardlock remains enforced.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#2A2A2C]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xs bg-[#1A1A1C] hover:bg-[#222226] text-[#888888] hover:text-white text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-1.5 rounded-xs bg-[#FF3E00] hover:bg-[#E03700] text-white font-bold text-xs cursor-pointer transition shadow-xs"
            >
              {isSaving ? "Linking Target..." : "Save & Bind Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
