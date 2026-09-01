import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  Upload, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Database,
  ArrowRight,
  Zap,
  Building2,
  Compass,
  FileCheck2
} from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const { 
    currentUser, 
    documents, 
    queries, 
    setActiveView, 
    setActiveDocForDetail,
    setActiveCitationForModal
  } = useApp();

  const [quickQuestion, setQuickQuestion] = useState<string>('');

  // Filter documents contributed by or associated with this employee / subsidiary
  const myContributedDocs = documents.filter(doc => 
    doc.versions.some(v => v.uploadedBy.id === currentUser.id || v.uploadedBy.subsidiary === currentUser.subsidiary)
  );

  const myPendingUpdates = documents.reduce((acc, doc) => {
    const pendings = doc.versions.filter(v => 
      v.approvalStatus === 'pending' && 
      (v.uploadedBy.id === currentUser.id || v.uploadedBy.subsidiary === currentUser.subsidiary)
    );
    return acc + pendings.length;
  }, 0);

  const recentAiQueries = queries.slice(0, 3);

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuestion.trim()) {
      setActiveView('ai-assistant');
    }
  };

  return (
    <div id="employee-dashboard" className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* ============================================================ */}
      {/* TOP GREETING & WORKSTATION SUMMARY */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#C8892E] font-bold uppercase tracking-wider mb-1">
            <span>{currentUser.subsidiary} Division</span>
            <span>·</span>
            <span>Technical Officer Workstation</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#141C2B] tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 max-w-2xl">
            {currentUser.designation} · {currentUser.department}. Grounded technical repository is synchronized with the latest Directorate index.
          </p>
        </div>

        {/* Quick Action Triggers */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            id="btn-dash-upload-doc"
            onClick={() => setActiveView('knowledge')}
            className="px-4 py-2.5 rounded-xl bg-[#141C2B] text-white hover:bg-[#1E293B] transition-all text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#C8892E]" />
            <span>Upload New Report</span>
          </button>
          
          <button
            id="btn-dash-ask-ai"
            onClick={() => setActiveView('ai-assistant')}
            className="px-4 py-2.5 rounded-xl bg-white text-[#141C2B] border border-[#D5D0C5] hover:border-[#C8892E] hover:bg-[#FAF8F3] transition-all text-xs font-semibold flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C8892E]" />
            <span>Ask AI Assistant</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODERN BENTO-STYLE GRID LAYOUT */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* ============================================================ */}
        {/* BENTO ITEM 1: FEATURED BIG HERO AI SEARCH & CITATION STREAM (8 COLS) */}
        {/* ============================================================ */}
        <div className="md:col-span-12 lg:col-span-8 bg-white border border-[#E4E0D6] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE2]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#141C2B] text-[#C8892E] flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#141C2B]">
                    Source-Grounded Technical AI Assistant
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Ask technical questions with inline paragraph citations from verified CIL/CMPDI dossiers.
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline-flex text-[10px] font-mono font-bold bg-[#F0FDF4] text-[#16A34A] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
                100% Citable RAG
              </span>
            </div>

            {/* Quick Interactive Prompt Input */}
            <form onSubmit={handleQuickSearchSubmit} className="relative">
              <input
                type="text"
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                placeholder="Ask technical question (e.g. 'What is the stripping ratio for Korba Seam IV?')"
                className="w-full pl-11 pr-28 py-3.5 text-xs sm:text-sm bg-[#FAF8F3] hover:bg-white focus:bg-white border border-[#D5D0C5] hover:border-[#C8892E] focus:border-[#C8892E] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8892E]/20 text-[#141C2B] placeholder:text-[#94A3B8] transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <button
                type="submit"
                onClick={() => setActiveView('ai-assistant')}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#141C2B] hover:bg-[#1E293B] text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C8892E]" />
              </button>
            </form>

            {/* Recent Verified Answers Stream */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
                <span>Recent Verified Technical Queries</span>
                <button 
                  onClick={() => setActiveView('ai-assistant')} 
                  className="text-[#C8892E] hover:underline font-bold"
                >
                  View All ({queries.length})
                </button>
              </div>

              {recentAiQueries.length === 0 ? (
                <div className="p-6 text-center bg-[#FAF8F3] border border-[#E4E0D6] rounded-xl text-xs text-[#64748B]">
                  No recent inquiries. Type a question above or open the AI Assistant to synthesize knowledge.
                </div>
              ) : (
                recentAiQueries.map((q) => (
                  <div 
                    key={q.id}
                    className="p-3.5 rounded-xl border border-[#E4E0D6] bg-[#FAF8F3] hover:border-[#C8892E]/60 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#141C2B] truncate">
                        Q: {q.questionText}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-white text-[#16A34A] px-2 py-0.5 rounded border border-[#BBF7D0] flex-shrink-0">
                        {q.confidence.toFixed(1)}% Grounded
                      </span>
                    </div>

                    <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed bg-white p-2.5 rounded-lg border border-[#E4E0D6]/60">
                      {q.answerText}
                    </p>

                    {q.citations.length > 0 && (
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <button
                          onClick={() => setActiveCitationForModal(q.citations[0])}
                          className="font-mono text-[#C8892E] hover:underline flex items-center gap-1 truncate max-w-[80%]"
                        >
                          <span>📄 {q.citations[0].documentTitle}</span>
                          <span className="text-[#64748B]">({q.citations[0].pageOrSheetRef})</span>
                        </button>

                        <button
                          onClick={() => setActiveView('ai-assistant')}
                          className="text-[#2563EB] font-semibold hover:underline"
                        >
                          View Citation →
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#EFEBE2] flex items-center justify-between text-xs text-[#64748B]">
            <span>Grounded against active CIL/CMPDI knowledge base</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Multi-Document Synthesis
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BENTO ITEM 2: ASYMMETRIC METRICS PANEL (4 COLS) */}
        {/* ============================================================ */}
        <div className="md:col-span-12 lg:col-span-4 bg-gradient-to-br from-[#141C2B] to-[#0A0F1A] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C8892E]" />
                <h3 className="font-serif font-bold text-base text-white">
                  Operational Metrics
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded font-bold">
                Officer Ledger
              </span>
            </div>

            {/* Metric 1 */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Contributed Documents</span>
                <FileText className="w-3.5 h-3.5 text-[#C8892E]" />
              </div>
              <div className="font-serif font-bold text-3xl text-white">
                {myContributedDocs.length}
              </div>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Indexed in official directory</span>
              </p>
            </div>

            {/* Metric 2 & 3 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[11px] text-[#94A3B8] block">Pending Revisions</span>
                <div className="font-serif font-bold text-2xl text-amber-300">
                  {myPendingUpdates}
                </div>
                <span className="text-[10px] text-[#94A3B8] font-mono block">Under review</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[11px] text-[#94A3B8] block">AI Queries Run</span>
                <div className="font-serif font-bold text-2xl text-sky-400">
                  {queries.length}
                </div>
                <span className="text-[10px] text-[#94A3B8] font-mono block">Cited results</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
            <span>Clearance: Officer Tier-2</span>
            <span className="text-amber-300">● Live Sync</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BENTO ITEM 3: MY CONTRIBUTED DOCUMENTS (6 COLS) */}
        {/* ============================================================ */}
        <div className="md:col-span-6 bg-white border border-[#E4E0D6] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE2]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C8892E]" />
                <h3 className="font-serif font-bold text-base text-[#141C2B]">
                  My Governed Technical Filings
                </h3>
              </div>
              <button
                onClick={() => setActiveView('knowledge')}
                className="text-xs font-semibold text-[#C8892E] hover:underline"
              >
                Browse All →
              </button>
            </div>

            <div className="space-y-2.5 pt-3">
              {myContributedDocs.length === 0 ? (
                <div className="p-6 text-center bg-[#FAF8F3] border border-[#E4E0D6] rounded-xl text-xs text-[#64748B]">
                  No documents contributed yet. Use the upload button above to submit your first report.
                </div>
              ) : (
                myContributedDocs.slice(0, 3).map((doc) => {
                  const currentVer = doc.versions.find(v => v.id === doc.currentVersionId) || doc.versions[0];
                  const hasPending = doc.versions.some(v => v.approvalStatus === 'pending');

                  return (
                    <div 
                      key={doc.id}
                      className="p-3 rounded-xl border border-[#E4E0D6] hover:border-[#C8892E] bg-[#FAF8F3] flex items-center justify-between gap-3 transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[9px] font-mono font-bold bg-white text-[#141C2B] px-1.5 py-0.2 rounded border border-[#D5D0C5]">
                            {doc.documentCode}
                          </span>
                          <span className="text-[10px] font-mono text-[#64748B]">
                            v{currentVer.versionNumber}.0
                          </span>
                          {hasPending && (
                            <span className="text-[9px] font-mono font-bold bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.2 rounded">
                              Pending
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-[#141C2B] truncate">{doc.title}</h4>
                      </div>

                      <button
                        onClick={() => {
                          setActiveDocForDetail(doc);
                          setActiveView('knowledge');
                        }}
                        className="p-1.5 rounded-lg bg-white border border-[#E4E0D6] text-[#141C2B] hover:text-[#C8892E] transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#EFEBE2] flex items-center justify-between text-xs text-[#64748B]">
            <span>Version Lineage: Append-only</span>
            <span className="font-mono text-[11px] text-[#141C2B]">OCR Accuracy: 99.2%</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BENTO ITEM 4: PENDING REVISIONS & SUBMISSION STATUS (6 COLS) */}
        {/* ============================================================ */}
        <div className="md:col-span-6 bg-white border border-[#E4E0D6] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EFEBE2]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#EAB308]" />
                <h3 className="font-serif font-bold text-base text-[#141C2B]">
                  Pending Directorate Revisions
                </h3>
              </div>
              <button
                onClick={() => setActiveView('my-updates')}
                className="text-xs font-semibold text-[#C8892E] hover:underline"
              >
                Track All Updates →
              </button>
            </div>

            <div className="space-y-2.5 pt-3">
              {myPendingUpdates === 0 ? (
                <div className="p-6 text-center bg-[#FAF8F3] border border-[#E4E0D6] rounded-xl text-xs text-[#64748B]">
                  ✓ No revisions currently awaiting central directorate sign-off.
                </div>
              ) : (
                documents
                  .flatMap(doc => doc.versions.filter(v => v.approvalStatus === 'pending' && (v.uploadedBy.id === currentUser.id || v.uploadedBy.subsidiary === currentUser.subsidiary)).map(v => ({ doc, version: v })))
                  .slice(0, 3)
                  .map(({ doc, version }) => (
                    <div 
                      key={version.id}
                      className="p-3 rounded-xl border border-[#FDE68A] bg-[#FEFDF8] flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-mono font-bold bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.2 rounded border border-[#FDE68A]">
                            UNDER REVIEW
                          </span>
                          <span className="text-[10px] font-mono text-[#64748B]">
                            v{version.versionNumber}.0 · {doc.documentCode}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#141C2B] truncate">{doc.title}</h4>
                      </div>

                      <button
                        onClick={() => setActiveView('my-updates')}
                        className="px-2.5 py-1 rounded-lg bg-white border border-[#E4E0D6] text-xs font-semibold text-[#141C2B] hover:text-[#C8892E]"
                      >
                        Status
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#EFEBE2] flex items-center justify-between text-xs text-[#64748B]">
            <span>Average Approval SLA: 24-48 Hours</span>
            <span className="text-[#C8892E] font-semibold">Central Directorate Queue</span>
          </div>
        </div>
      </div>
    </div>
  );
};
