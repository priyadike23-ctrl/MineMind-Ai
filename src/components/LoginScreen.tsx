import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Subsidiary } from '../types';
import { getSupabase, supabase } from '../supabaseClient';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  User, 
  IdCard, 
  Building2, 
  Check, 
  X, 
  Briefcase,
  Layers,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Zap,
  Compass,
  FileCheck2
} from 'lucide-react';

type AuthViewMode = 'login' | 'request-access' | 'request-submitted';

export const LoginScreen: React.FC = () => {
  const { loginWithCredentials, submitAccessRequest, requestPasswordReset } = useApp();

  // Navigation mode within Auth
  const [viewMode, setViewMode] = useState<AuthViewMode>('login');

  // Signup Success Message State
  const [signupSuccessMessage, setSignupSuccessMessage] = useState<string | null>(null);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<{ message: string; status?: 'pending' | 'rejected' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState<boolean>(false);

  // Forgot Password Modal State
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [isSendingReset, setIsSendingReset] = useState<boolean>(false);
  const [forgotResetSent, setForgotResetSent] = useState<boolean>(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Request Access Form State
  const [fullName, setFullName] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [officialEmail, setOfficialEmail] = useState<string>('');
  const [subsidiary, setSubsidiary] = useState<Subsidiary>('CMPDI HQ');
  const [department, setDepartment] = useState<string>('Geology & Exploration');
  const [designation, setDesignation] = useState<string>('');
  const [requestPassword, setRequestPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showReqPassword, setShowReqPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [requestFormError, setRequestFormError] = useState<string | null>(null);

  // Submitted Request Details
  const [submittedDetails, setSubmittedDetails] = useState<{
    requestId: string;
    name: string;
    employeeId: string;
    email: string;
    subsidiary: Subsidiary;
    requiresEmailConfirmation?: boolean;
    message?: string;
  } | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string): { score: number; label: string; color: string } => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-300' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 1:
        return { score: 25, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 50, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Good', color: 'bg-blue-500' };
      case 4:
        return { score: 100, label: 'Strong', color: 'bg-emerald-600' };
      default:
        return { score: 15, label: 'Very Weak', color: 'bg-rose-400' };
    }
  };

  const passwordStrength = getPasswordStrength(requestPassword);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const res = await loginWithCredentials(loginIdentifier, loginPassword, rememberMe);
      setIsSubmitting(false);

      if (!res.success) {
        if (res.status === 'pending') {
          setLoginError({
            status: 'pending',
            message: 'Your access request is still awaiting administrator approval.',
          });
        } else if (res.status === 'rejected') {
          setLoginError({
            status: 'rejected',
            message: 'Your access request was not approved. Please contact your administrator.',
          });
        } else {
          setLoginError({
            message: res.message || 'Unable to sign in. Please check your credentials.',
          });
        }
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setLoginError({
        message: err?.message || 'Authentication error. Please check your network connection.',
      });
    }
  };

  // Handle Request Access Submit
  const handleRequestAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestFormError(null);

    if (requestPassword.length < 8) {
      setRequestFormError('Password must be at least 8 characters long.');
      return;
    }

    if (requestPassword !== confirmPassword) {
      setRequestFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitAccessRequest({
        name: fullName,
        employeeId,
        email: officialEmail,
        subsidiary,
        department,
        designation,
        password: requestPassword,
      });

      setIsSubmitting(false);
      if (!res.success) {
        setRequestFormError(res.message || 'Failed to submit access request. Please try again.');
        return;
      }

      const userRegisteredEmail = officialEmail.trim();
      setLoginIdentifier(userRegisteredEmail);
      setLoginPassword('');
      setLoginError(null);
      setSignupSuccessMessage(
        'Account created successfully! Enter your password below to sign in directly.'
      );
      setViewMode('login');
    } catch (err: any) {
      setIsSubmitting(false);
      setRequestFormError(err?.message || 'Failed to submit access request. Please try again.');
    }
  };

  // Open Forgot Password Modal
  const handleOpenForgotPasswordModal = () => {
    if (loginIdentifier.trim()) {
      setForgotEmail(loginIdentifier.trim());
    }
    setForgotError(null);
    setForgotResetSent(false);
    setIsForgotPasswordModalOpen(true);
  };

  // Close Forgot Password Modal
  const handleCloseForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
    setForgotResetSent(false);
    setForgotError(null);
  };

  // Handle Forgot Password Modal Submit
  const handleForgotModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = forgotEmail.trim();
    if (!cleanEmail) {
      setForgotError('Please enter your official email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) && !cleanEmail.includes('.')) {
      setForgotError('Please enter a valid official email address.');
      return;
    }

    setForgotError(null);
    setIsSendingReset(true);

    try {
      await requestPasswordReset(cleanEmail);
      setIsSendingReset(false);
      setForgotResetSent(true);
    } catch (err: any) {
      setIsSendingReset(false);
      setForgotError(err?.message || 'Failed to dispatch reset request.');
    }
  };

  // Handle Resend Confirmation Email
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const handleResendConfirmation = async () => {
    const cleanEmail = loginIdentifier.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setLoginError({ message: 'Please enter your registered email address in the field below first.' });
      return;
    }
    const client = getSupabase() || supabase;
    if (client) {
      try {
        setResendStatus('Sending...');
        const { error } = await client.auth.resend({
          type: 'signup',
          email: cleanEmail,
        });
        if (error) {
          setResendStatus(null);
          setLoginError({ message: `Resend failed: ${error.message}` });
        } else {
          setResendStatus('Confirmation link resent! Check your inbox and spam folder.');
        }
      } catch (err: any) {
        setResendStatus(null);
        setLoginError({ message: err?.message || 'Failed to resend confirmation email.' });
      }
    }
  };

  // Handle Google OAuth Sign-in via Supabase
  const handleGoogleSignIn = async () => {
    setLoginError(null);
    const client = getSupabase() || supabase;
    if (!client) {
      setLoginError({
        message: 'Supabase is not configured. Please ensure your Supabase URL and Key are set in environment settings.',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
        },
      });

      if (error) {
        setLoginError({
          message: error.message || 'Google sign-in failed. Please verify your Supabase Google OAuth provider settings.',
        });
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setLoginError({
        message: err?.message || 'An unexpected error occurred during Google sign-in.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="minemind-auth-container" 
      className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-[#FAF8F4] text-[#141C2B] select-none font-sans"
    >
      {/* ============================================================ */}
      {/* LEFT SIDE: BOLD, COLORFUL/GRADIENT BRANDED HERO PANEL */}
      {/* ============================================================ */}
      <section 
        aria-label="Platform Highlights and Branding"
        className="relative lg:col-span-5 xl:col-span-5 bg-gradient-to-br from-[#090D16] via-[#101827] to-[#1E293B] text-white p-8 sm:p-12 lg:p-14 flex flex-col justify-between overflow-hidden"
      >
        {/* Dynamic layered atmospheric aura and glow lines */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#C8892E]/25 via-[#D97706]/15 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#2563EB]/20 via-[#0D9488]/15 to-transparent rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        {/* Top Branding Section */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#C8892E] via-[#D97706] to-[#8E5D18] text-[#0A0D14] flex items-center justify-center font-serif font-black text-2xl shadow-lg shadow-[#C8892E]/20">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-2xl tracking-tight text-white">MINEMIND</span>
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-[#C8892E] text-[#0A0D14]">AI</span>
              </div>
              <p className="text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider">
                CMPDI / CIL Technical Workspace
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-amber-200">
            <span className="w-2 h-2 rounded-full bg-[#C8892E] animate-pulse" />
            <span>Central Directorate Knowledge Cloud · v2.4</span>
          </div>
        </div>

        {/* Center Feature Highlights & Value Proposition */}
        <div className="relative z-10 py-10 space-y-6">
          <div className="space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white tracking-tight leading-[1.15]">
              Transforming scattered reports into grounded intelligence.
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] max-w-lg leading-relaxed">
              Empowering mining executives and technical officers with instant source-grounded synthesis, version governance, and auditable decisions.
            </p>
          </div>

          {/* Value Metric Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-[#F59E0B] text-xs font-bold font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Grounded</span>
              </div>
              <p className="text-xs text-[#CBD5E1] mt-1">Zero synthetic hallucinations with verified paragraph citations.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-bold font-mono">
                <Zap className="w-4 h-4" />
                <span>64% Time Saved</span>
              </div>
              <p className="text-xs text-[#CBD5E1] mt-1">Average turnaround down from 5.0 days to 1.8 days per dossier.</p>
            </div>
          </div>
        </div>

        {/* Bottom Panel Status / Footer */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <Compass className="w-3.5 h-3.5 text-[#C8892E]" />
            <span>8 Mining Subsidiaries Connected</span>
          </div>
          <span className="text-[11px] text-[#64748B]">© 2026 Coal India Limited</span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* RIGHT SIDE: MINIMAL EDITORIAL LOGIN FORM (NO CARD, NO BORDER) */}
      {/* ============================================================ */}
      <main className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20 overflow-y-auto">
        {/* Top Header / Mode Switcher */}
        <div className="flex items-center justify-between pb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#C8892E] uppercase tracking-wider">
              {viewMode === 'login' ? 'Authentication' : viewMode === 'request-access' ? 'Registration' : 'Verification'}
            </span>
          </div>

          <div>
            {viewMode === 'login' ? (
              <button
                type="button"
                id="btn-switch-to-register"
                onClick={() => {
                  setRequestFormError(null);
                  setSignupSuccessMessage(null);
                  setViewMode('request-access');
                }}
                className="text-xs font-semibold text-[#141C2B] hover:text-[#C8892E] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Request Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                id="btn-switch-to-signin"
                onClick={() => {
                  setLoginError(null);
                  setViewMode('login');
                }}
                className="text-xs font-semibold text-[#141C2B] hover:text-[#C8892E] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Back to Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Center Content Form (Sitting directly on the page, no card wrapper) */}
        <div className="w-full max-w-md mx-auto my-auto py-4">
          {/* ============================================================ */}
          {/* 1. SIGN IN VIEW */}
          {/* ============================================================ */}
          {viewMode === 'login' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#141C2B] tracking-tight">
                  Sign in to workstation
                </h1>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Enter your Coal India or CMPDI corporate credentials to access the central intelligence index.
                </p>
              </div>

              {/* Success Notification */}
              {signupSuccessMessage && (
                <div 
                  id="signup-success-alert"
                  className="p-3.5 rounded-xl border bg-[#F0FDF4] border-[#86EFAC] text-[#166534] text-xs leading-relaxed flex items-start gap-2.5 shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-[#14532D]">Account Created</p>
                    <p className="text-[#166534] mt-0.5">{signupSuccessMessage}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSignupSuccessMessage(null)}
                    className="text-[#166534] hover:text-[#14532D] p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Login Error Alert */}
              {loginError && (
                <div 
                  id="auth-error-alert"
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-2 shadow-2xs ${
                    loginError.status === 'pending'
                      ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E]'
                      : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {loginError.status === 'pending' ? (
                      <Clock className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-[#DC2626] flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{loginError.message}</p>
                      {resendStatus && (
                        <p className="text-[#166534] font-medium mt-1 bg-white/80 p-1.5 rounded border border-[#86EFAC]">
                          {resendStatus}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Resend Confirmation Link */}
                  {(loginError.message.toLowerCase().includes('confirm') || loginError.message.toLowerCase().includes('email')) && (
                    <div className="pt-1.5 border-t border-[#FECACA]/60 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-[#7F1D1D]">Didn't receive email?</span>
                      <button
                        type="button"
                        onClick={handleResendConfirmation}
                        className="px-2.5 py-1 bg-white hover:bg-[#FAF8F3] text-[#141C2B] font-semibold text-[11px] rounded-lg border border-[#E4E0D6] shadow-2xs cursor-pointer transition-all"
                      >
                        Resend Link
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Sign In Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label 
                    htmlFor="input-login-email" 
                    className="block text-xs font-semibold text-[#141C2B] mb-1.5"
                  >
                    Employee ID or Official Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      id="input-login-email"
                      name="email"
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. CMPDI-HQ-10294 or name@cmpdi.co.in"
                      className="w-full pl-10 pr-3.5 py-3 text-sm bg-white border border-[#D5D0C5] hover:border-[#BDB8AC] focus:border-[#C8892E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8892E]/20 text-[#141C2B] placeholder:text-[#94A3B8] transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label 
                      htmlFor="input-login-password" 
                      className="block text-xs font-semibold text-[#141C2B]"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      id="btn-forgot-password-link"
                      onClick={handleOpenForgotPasswordModal}
                      className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      id="input-login-password"
                      name="password"
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 text-sm bg-white border border-[#D5D0C5] hover:border-[#BDB8AC] focus:border-[#C8892E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8892E]/20 text-[#141C2B] placeholder:text-[#94A3B8] transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      id="btn-toggle-login-password"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#141C2B] cursor-pointer p-0.5"
                      title={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#64748B] select-none">
                    <input
                      type="checkbox"
                      id="checkbox-remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#D5D0C5] text-[#141C2B] focus:ring-[#C8892E] cursor-pointer"
                    />
                    <span>Keep me authenticated</span>
                  </label>
                </div>

                <button
                  type="submit"
                  id="btn-login-submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#141C2B] hover:bg-[#1E293B] active:bg-[#0A0D14] text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying clearance...</span>
                    </span>
                  ) : (
                    <>
                      <span>Sign In to Workstation</span>
                      <ArrowRight className="w-4 h-4 text-[#C8892E]" />
                    </>
                  )}
                </button>
              </form>

              {/* Continue with Google button */}
              <div className="space-y-3 pt-2">
                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-[#E4E0D6]" />
                  <span className="absolute bg-[#FAF8F4] px-3 text-[11px] uppercase tracking-wider text-[#94A3B8] font-mono">
                    or
                  </span>
                </div>

                <button
                  type="button"
                  id="btn-google-signin"
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 bg-white hover:bg-[#F4EFE6] text-[#141C2B] font-medium text-xs sm:text-sm rounded-xl border border-[#D5D0C5] shadow-2xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Coal India SSO / Google</span>
                </button>
              </div>

              {/* Quick Demo Accounts Pill (Seamless Autofill) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                  className="w-full flex items-center justify-between text-xs font-mono text-[#64748B] hover:text-[#141C2B] p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8892E]" />
                    Instant Demo Accounts (Autofill)
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDemoAccounts ? 'rotate-180' : ''}`} />
                </button>

                {showDemoAccounts && (
                  <div className="grid grid-cols-2 gap-2.5 mt-2 pt-2 border-t border-[#E4E0D6]">
                    <button
                      type="button"
                      id="btn-demo-admin"
                      onClick={() => {
                        setLoginIdentifier('CMPDI-HQ-10294');
                        setLoginPassword('Password@123');
                        setLoginError(null);
                      }}
                      className="p-2.5 text-left bg-white hover:border-[#C8892E] border border-[#D5D0C5] rounded-xl transition-all text-xs cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#141C2B]">Admin Officer</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#141C2B] text-amber-300 font-mono">CMPDI</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate mt-1">Dr. Arindam Mukherjee</p>
                    </button>

                    <button
                      type="button"
                      id="btn-demo-employee"
                      onClick={() => {
                        setLoginIdentifier('CIL-SECL-84920');
                        setLoginPassword('Password@123');
                        setLoginError(null);
                      }}
                      className="p-2.5 text-left bg-white hover:border-[#C8892E] border border-[#D5D0C5] rounded-xl transition-all text-xs cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#141C2B]">Mining Officer</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FAF8F3] border border-[#D5D0C5] text-[#141C2B] font-mono">SECL</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate mt-1">Er. Rajesh Verma</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. SIGN UP / REQUEST ACCESS VIEW */}
          {/* ============================================================ */}
          {viewMode === 'request-access' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h1 className="font-serif font-bold text-3xl text-[#141C2B] tracking-tight">
                  Request officer clearance
                </h1>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Submit your official credentials for validation and directorate role provisioning.
                </p>
              </div>

              {requestFormError && (
                <div className="p-3.5 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{requestFormError}</span>
                </div>
              )}

              <form onSubmit={handleRequestAccessSubmit} className="space-y-3.5">
                <div>
                  <label htmlFor="input-request-fullname" className="block text-xs font-semibold text-[#141C2B] mb-1">
                    Full Official Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      id="input-request-fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Arindam Mukherjee"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#D5D0C5] focus:border-[#C8892E] rounded-xl focus:outline-none text-[#141C2B] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="input-request-empid" className="block text-xs font-semibold text-[#141C2B] mb-1">
                      Employee ID
                    </label>
                    <div className="relative">
                      <IdCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input
                        id="input-request-empid"
                        type="text"
                        required
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        placeholder="CMPDI-HQ-10294"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#D5D0C5] focus:border-[#C8892E] rounded-xl focus:outline-none text-[#141C2B] shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="input-request-email" className="block text-xs font-semibold text-[#141C2B] mb-1">
                      Official Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input
                        id="input-request-email"
                        type="email"
                        required
                        value={officialEmail}
                        onChange={(e) => setOfficialEmail(e.target.value)}
                        placeholder="name@cmpdi.co.in"
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-[#D5D0C5] focus:border-[#C8892E] rounded-xl focus:outline-none text-[#141C2B] shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="select-request-subsidiary" className="block text-xs font-semibold text-[#141C2B] mb-1">
                      Subsidiary Division
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <select
                        id="select-request-subsidiary"
                        value={subsidiary}
                        onChange={(e) => setSubsidiary(e.target.value as Subsidiary)}
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-white border border-[#D5D0C5] focus:border-[#C8892E] rounded-xl focus:outline-none text-[#141C2B] shadow-2xs"
                      >
                        <option value="CMPDI HQ">CMPDI HQ</option>
                        <option value="SECL">SECL</option>
                        <option value="BCCL">BCCL</option>
                        <option value="NCL">NCL</option>
                        <option value="CCL">CCL</option>
                        <option value="ECL">ECL</option>
                        <option value="WCL">WCL</option>
                        <option value="MCL">MCL</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="input-request-designation" className="block text-xs font-semibold text-[#141C2B] mb-1">
                      Designation
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                      <input
                        id="input-request-designation"
                        type="text"
                        required
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="Sr. Geologist"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#D5D0C5] focus:border-[#C8892E] rounded-xl focus:outline-none text-[#141C2B] shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="input-request-password" className="block text-xs font-semibold text-[#141C2B]">
                      Create Password
                    </label>
                    {requestPassword && (
                      <span className="text-[10px] font-mono text-[#64748B]">
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      id="input-request-password"
                      type={showReqPassword ? 'text' : 'password'}
                      required
                      value={requestPassword}
                      onChange={(e) => setRequestPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-[#D5D0C5] focus:border-[#C8892E] rounded-xl focus:outline-none text-[#141C2B] shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowReqPassword(!showReqPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#141C2B]"
                    >
                      {showReqPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {requestPassword && (
                    <div className="mt-1 h-1 w-full bg-[#E4E0D6] rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="input-request-confirmpassword" className="block text-xs font-semibold text-[#141C2B] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      id="input-request-confirmpassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-[#D5D0C5] focus:border-[#C8892E] rounded-xl focus:outline-none text-[#141C2B] shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#141C2B]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  id="btn-submit-request-access"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#141C2B] hover:bg-[#1E293B] text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 mt-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Access Request...</span>
                    </span>
                  ) : (
                    <>
                      <span>Submit Clearance Request</span>
                      <ArrowRight className="w-4 h-4 text-[#C8892E]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. ACCESS REQUEST SUBMITTED (CONFIRMATION VIEW) */}
          {/* ============================================================ */}
          {viewMode === 'request-submitted' && (
            <div className="space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] text-[#16A34A] flex items-center justify-center mx-auto shadow-xs">
                <FileCheck2 className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h2 className="font-serif font-bold text-2xl text-[#141C2B]">
                  Access Request Submitted
                </h2>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  Your request has been routed to the Central Directorate. Check your email for identity confirmation instructions before signing in.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  setViewMode('login');
                }}
                className="w-full py-3 bg-[#141C2B] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Return to Sign In</span>
                <ArrowRight className="w-4 h-4 text-[#C8892E]" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Page Footer */}
        <div className="pt-8 border-t border-[#E4E0D6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#94A3B8]">
          <span>CMPDI Central Knowledge Hub · Secure SSL v3 Encrypted</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#141C2B] transition-colors cursor-pointer">Security Protocol</span>
            <span>·</span>
            <span className="hover:text-[#141C2B] transition-colors cursor-pointer">Statutory Terms</span>
          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/* FORGOT PASSWORD MODAL */}
      {/* ============================================================ */}
      {isForgotPasswordModalOpen && (
        <div 
          id="forgot-password-modal" 
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseForgotPasswordModal();
            }
          }}
        >
          <div className="relative w-full max-w-md bg-white border border-[#E4E0D6] rounded-2xl shadow-2xl p-6 sm:p-7 text-[#141C2B] animate-in zoom-in-95 duration-200">
            <button
              type="button"
              id="btn-close-forgot-modal"
              onClick={handleCloseForgotPasswordModal}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#141C2B] text-[#C8892E] flex items-center justify-center shadow-xs flex-shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 id="forgot-password-title" className="font-serif font-bold text-xl text-[#141C2B]">
                  Reset Credentials
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Dispatches password reset instructions to your official mailbox
                </p>
              </div>
            </div>

            {forgotResetSent ? (
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs text-[#166534] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-[#14532D]">Recovery Link Dispatched</p>
                    <p className="leading-relaxed text-[#166534]">
                      If an authorized organizational account is registered for <span className="font-semibold underline text-[#14532D]">{forgotEmail}</span>, password recovery instructions have been sent.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseForgotPasswordModal}
                  className="w-full py-2.5 bg-[#141C2B] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotModalSubmit} className="space-y-4 pt-2">
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Enter your registered official email address. We will send you verification instructions and a secure link to reset your account password.
                </p>

                {forgotError && (
                  <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div>
                  <label 
                    htmlFor="input-forgot-modal-email" 
                    className="block text-xs font-semibold text-[#141C2B] mb-1.5"
                  >
                    Official Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                    <input
                      id="input-forgot-modal-email"
                      name="email"
                      type="text"
                      required
                      autoFocus
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@cmpdi.co.in"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#D5D0C5] rounded-xl focus:outline-none focus:border-[#C8892E] text-[#141C2B]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={isSendingReset}
                    className="w-full py-2.5 bg-[#141C2B] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {isSendingReset ? 'Sending...' : 'Send Recovery Instructions'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseForgotPasswordModal}
                    className="w-full py-2 text-xs font-medium text-[#64748B] hover:text-[#141C2B] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
