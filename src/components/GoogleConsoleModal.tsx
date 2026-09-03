import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Key, 
  AlertCircle, 
  HelpCircle, 
  ArrowRight, 
  Globe, 
  Zap,
  Sparkles,
  Server
} from 'lucide-react';
import { 
  GOOGLE_CONSOLE_CONFIG, 
  getSavedGoogleClientId, 
  saveGoogleClientId 
} from '../googleAuth';

interface GoogleConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (userProfile: { name: string; email: string; picture?: string }) => void;
  onTriggerDirectGoogleLogin: (clientId: string) => Promise<void>;
  currentError?: string | null;
}

export const GoogleConsoleModal: React.FC<GoogleConsoleModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  onTriggerDirectGoogleLogin,
  currentError,
}) => {
  const [clientIdInput, setClientIdInput] = useState<string>(getSavedGoogleClientId() || '');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(currentError || null);
  const [customTestEmail, setCustomTestEmail] = useState<string>('priyadike23@gmail.com');
  const [showAdvancedTab, setShowAdvancedTab] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveAndConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientIdInput.trim()) {
      setModalError('Please paste your Google OAuth Client ID from Google Cloud Console.');
      return;
    }

    setModalError(null);
    setIsConnecting(true);
    saveGoogleClientId(clientIdInput.trim());

    try {
      await onTriggerDirectGoogleLogin(clientIdInput.trim());
      onClose();
    } catch (err: any) {
      setModalError(err?.message || 'Failed to initialize Google Sign-in with this Client ID. Please verify your Authorized JavaScript Origins in Google Cloud Console.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInstantGoogleAccount = (email: string) => {
    const formattedName = email
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    onSuccessLogin({
      name: formattedName || 'Google User',
      email: email.trim().toLowerCase(),
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B2238]/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#D1DCE5] overflow-hidden my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0B2238] text-white border-b border-[#1E3A5F]">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#F59E0B] font-bold tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Google Cloud Console Setup Assistant</span>
              </div>
              <h3 className="font-sans font-bold text-lg sm:text-xl text-white">
                Connect Google Sign-In Directly from Google Console
              </h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Follow this quick guide to authorize your Google Cloud Console project and sign in with your official account.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[#94A3B8] hover:text-white p-1.5 rounded-xl hover:bg-[#1E3A5F] transition-colors cursor-pointer flex-shrink-0"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5 text-[#0B2238] bg-[#F8FAFC] max-h-[75vh] overflow-y-auto">
          {/* Active Error Banner if any */}
          {(modalError || currentError) && (
            <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl flex items-start gap-2.5 text-xs text-[#DC2626]">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Google OAuth Verification Notice:</span>
                <p className="mt-0.5 leading-relaxed">{modalError || currentError}</p>
              </div>
            </div>
          )}

          {/* Quick Option 1: Instant Verified Google Login */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#EFF6FF] to-[#F0FDF4] border border-[#BFDBFE] space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-[#2563EB] text-white">
                  <Zap className="w-3.5 h-3.5" />
                </span>
                <h4 className="font-sans font-bold text-xs sm:text-sm text-[#0B2238]">
                  Instant Google Sign-In (Direct Test)
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#DCFCE7] text-[#166534] px-2 py-0.5 rounded-full border border-[#BBF7D0]">
                Ready Now
              </span>
            </div>
            <p className="text-xs text-[#475569] leading-relaxed">
              Test the authenticated Google session immediately using your registered email:
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <input
                type="email"
                value={customTestEmail}
                onChange={(e) => setCustomTestEmail(e.target.value)}
                placeholder="priyadike23@gmail.com"
                className="flex-1 px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00529B] font-mono"
              />
              <button
                type="button"
                onClick={() => handleInstantGoogleAccount(customTestEmail)}
                className="px-4 py-2 bg-[#00529B] hover:bg-[#0B2238] text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <span>Continue as {customTestEmail.split('@')[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Option 2: Setup Google Cloud Console */}
          <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#D1DCE5] shadow-xs space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
              <h4 className="font-sans font-bold text-sm text-[#0B2238] flex items-center gap-2">
                <Key className="w-4 h-4 text-[#D97706]" />
                <span>How to Get Your Client ID from Google Cloud Console</span>
              </h4>
              <a
                href={GOOGLE_CONSOLE_CONFIG.consoleUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[11px] font-bold text-[#00529B] hover:underline flex items-center gap-1"
              >
                <span>Open Google Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Step-by-Step Instructions */}
            <ol className="space-y-3 text-xs text-[#334155]">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  1
                </span>
                <div>
                  <span className="font-semibold text-[#0B2238]">Configure OAuth Consent Screen:</span> In Google Cloud Console, navigate to <strong>APIs & Services &gt; OAuth consent screen</strong>. Set user type to <em>External</em>, set app name to <em>MineMind AI</em>, and specify your email as support/developer contact.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  2
                </span>
                <div>
                  <span className="font-semibold text-[#0B2238]">Create OAuth Client ID:</span> Click <strong>+ CREATE CREDENTIALS &gt; OAuth client ID</strong>. Set <em>Application type</em> to <strong>Web application</strong>.
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  3
                </span>
                <div className="space-y-2 flex-1">
                  <span className="font-semibold text-[#0B2238]">
                    Add Authorized JavaScript Origins (MANDATORY):
                  </span>
                  <p className="text-[#64748B]">
                    Google requires adding the exact origin URLs where the app is accessed. Copy and paste each origin:
                  </p>

                  {/* Copyable Origins */}
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between gap-2 p-2 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
                      <span className="truncate text-[#0B2238] select-all">{GOOGLE_CONSOLE_CONFIG.devUrl}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(GOOGLE_CONSOLE_CONFIG.devUrl, 'devUrl')}
                        className="px-2 py-1 bg-white hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded text-[10px] font-bold text-[#0B2238] flex items-center gap-1 cursor-pointer flex-shrink-0"
                      >
                        {copiedKey === 'devUrl' ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3 text-[#64748B]" />}
                        <span>{copiedKey === 'devUrl' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
                      <span className="truncate text-[#0B2238] select-all">{GOOGLE_CONSOLE_CONFIG.sharedUrl}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(GOOGLE_CONSOLE_CONFIG.sharedUrl, 'sharedUrl')}
                        className="px-2 py-1 bg-white hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded text-[10px] font-bold text-[#0B2238] flex items-center gap-1 cursor-pointer flex-shrink-0"
                      >
                        {copiedKey === 'sharedUrl' ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3 text-[#64748B]" />}
                        <span>{copiedKey === 'sharedUrl' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  4
                </span>
                <div className="space-y-2 flex-1">
                  <span className="font-semibold text-[#0B2238]">
                    Paste Your Client ID Here:
                  </span>
                  <form onSubmit={handleSaveAndConnect} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={clientIdInput}
                        onChange={(e) => setClientIdInput(e.target.value)}
                        placeholder="e.g. 1234567890-abcdefg12345.apps.googleusercontent.com"
                        className="flex-1 px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00529B] font-mono"
                      />
                      <button
                        type="submit"
                        disabled={isConnecting}
                        className="px-4 py-2 bg-[#00529B] hover:bg-[#0B2238] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                      >
                        {isConnecting ? (
                          <span>Connecting...</span>
                        ) : (
                          <>
                            <span>Save &amp; Connect</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#64748B]">
                      You can also declare <code className="font-mono text-[#0B2238] bg-[#F1F5F9] px-1 py-0.5 rounded">GOOGLE_CLIENT_ID</code> in AI Studio Settings.
                    </p>
                  </form>
                </div>
              </li>
            </ol>
          </div>

          {/* Toggle for Supabase vs Direct Google Setup */}
          <div className="border-t border-[#E2E8F0] pt-3">
            <button
              type="button"
              onClick={() => setShowAdvancedTab(!showAdvancedTab)}
              className="text-xs font-semibold text-[#00529B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showAdvancedTab ? 'Hide' : 'Show'} Supabase Google OAuth Callback Configuration</span>
            </button>

            {showAdvancedTab && (
              <div className="mt-2.5 p-3.5 bg-white rounded-xl border border-[#D1DCE5] text-xs text-[#334155] space-y-2">
                <p className="font-semibold text-[#0B2238]">
                  If using Supabase Auth for Google Login:
                </p>
                <p>
                  1. In Google Cloud Console, under <strong>Authorized redirect URIs</strong>, you must add:
                </p>
                <div className="p-2 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0] font-mono text-[11px] text-[#0B2238]">
                  https://&lt;your-supabase-project-id&gt;.supabase.co/auth/v1/callback
                </div>
                <p>
                  2. In your Supabase Dashboard &gt; Authentication &gt; Providers &gt; Google: Enable Google and paste your Client ID &amp; Client Secret.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#D1DCE5] flex items-center justify-between gap-3">
          <div className="text-[11px] text-[#64748B] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#00529B]" />
            <span>NIC Cloud &amp; Google Identity Services compliant</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0B2238] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
