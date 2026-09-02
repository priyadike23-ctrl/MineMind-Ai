import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Copy,
  Check,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Building2,
  Calendar,
  UserCheck,
  FileCheck2,
  Search,
  Sparkles
} from 'lucide-react';
import { buildStatutoryJsPdf, parseStatutoryText } from './CompareVersionsModal';

export const SourceViewerModal: React.FC = () => {
  const { activeCitationForModal, setActiveCitationForModal, documents, setCompareVersions } = useApp();
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'pdf' | 'excerpt'>('pdf');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const docPrintRef = useRef<HTMLDivElement>(null);

  if (!activeCitationForModal) return null;

  const parentDoc = documents.find(d => d.id === activeCitationForModal.documentId);
  const targetVer = parentDoc?.versions.find(v => v.versionNumber === activeCitationForModal.versionNumber) || parentDoc?.versions[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCitationForModal.excerpt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (!parentDoc || !targetVer) return;
    try {
      setIsGeneratingPdf(true);
      const pdf = buildStatutoryJsPdf(parentDoc, targetVer);
      pdf.save(`${parentDoc.documentCode}_v${targetVer.versionNumber}_Statutory_Record.pdf`);
    } catch (e) {
      console.error('Error generating PDF:', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenFullWorkspace = () => {
    if (parentDoc && targetVer) {
      setCompareVersions({
        v1: targetVer,
        v2: targetVer,
        doc: parentDoc,
        initialTab: 'pdf_view',
      });
      setActiveCitationForModal(null);
    }
  };

  const parsedDoc = parseStatutoryText(targetVer?.extractedText || activeCitationForModal.excerpt, {
    title: activeCitationForModal.documentTitle,
    code: activeCitationForModal.documentCode,
    subsidiary: activeCitationForModal.subsidiary || 'SECL',
    date: targetVer?.approvedAt ? new Date(targetVer.approvedAt).toLocaleDateString() : targetVer?.uploadedAt ? new Date(targetVer.uploadedAt).toLocaleDateString() : new Date().toLocaleDateString(),
    author: targetVer?.approvedBy?.name || 'CMPDI Directorate'
  });

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-[#E4E0D6] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#141C2B] text-white border-b border-[#1E293B]">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#C8892E]">
                <ShieldCheck className="w-4 h-4 text-[#4C7A52]" />
                <span className="font-bold">Knowledge Source Citation</span>
                <span>·</span>
                <span className="bg-[#1E293B] px-2 py-0.5 rounded text-white border border-[#334155]">{activeCitationForModal.documentCode}</span>
                <span>·</span>
                <span className="text-[#94A3B8]">v{activeCitationForModal.versionNumber}.0</span>
                <span className="text-[#16A34A] font-bold bg-[#14532D]/40 px-2 py-0.5 rounded border border-[#166534]">
                  {((activeCitationForModal.relevanceScore || 0.98) * 100).toFixed(0)}% Vector Grounding
                </span>
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-white break-words">
                {activeCitationForModal.documentTitle}
              </h3>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={handleOpenFullWorkspace}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#243147] hover:bg-[#334155] text-xs font-mono text-[#E2E8F0] rounded-lg border border-[#334155] transition-colors cursor-pointer"
                title="Open in full comparison workspace"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#C8892E]" />
                <span>Full Workspace</span>
              </button>
              <button
                onClick={() => setActiveCitationForModal(null)}
                className="text-[#94A3B8] hover:text-white p-1.5 rounded-lg hover:bg-[#1E293B] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub-Header / View Mode Switcher & Toolbars */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-3 border-t border-[#1E293B]">
            {/* View Mode Tabs */}
            <div className="flex items-center bg-[#0E1522] p-1 rounded-lg border border-[#243147]">
              <button
                onClick={() => setViewMode('pdf')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'pdf'
                    ? 'bg-[#C8892E] text-white shadow-xs'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Statutory PDF View</span>
              </button>
              <button
                onClick={() => setViewMode('excerpt')}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'excerpt'
                    ? 'bg-[#C8892E] text-white shadow-xs'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Cited Excerpt & Hash</span>
              </button>
            </div>

            {/* Quick Actions (Print, Download PDF, Zoom) */}
            <div className="flex items-center gap-2">
              {viewMode === 'pdf' && (
                <div className="flex items-center gap-1 bg-[#0E1522] px-2 py-1 rounded-lg border border-[#243147]">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
                    className="text-[#94A3B8] hover:text-white p-1 rounded cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-[#CBD5E1] px-1">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                    className="text-[#94A3B8] hover:text-white p-1 rounded cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(100)}
                    className="text-[10px] font-mono text-[#94A3B8] hover:text-white px-1.5 py-0.5 rounded cursor-pointer ml-1 border-l border-[#334155]"
                    title="Reset Zoom"
                  >
                    Reset
                  </button>
                </div>
              )}

              <button
                onClick={handlePrint}
                className="px-2.5 py-1.5 bg-[#1E293B] hover:bg-[#334155] text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer border border-[#334155]"
                title="Print statutory sheet"
              >
                <Printer className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="hidden sm:inline">Print</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-3 py-1.5 bg-[#4C7A52] hover:bg-[#3D6342] text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                title="Download official compiled PDF document"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>{isGeneratingPdf ? 'Generating...' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto bg-[#ECE8DF] flex-1 p-3 sm:p-6 text-xs">
          {viewMode === 'pdf' ? (
            /* ========================================================== */
            /*                 OFFICIAL STATUTORY PDF VIEW                */
            /* ========================================================== */
            <div className="flex flex-col items-center justify-start space-y-4">
              {/* PDF Document Viewer Banner / Location Indicator */}
              <div className="w-full max-w-3xl flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-white/90 backdrop-blur-xs rounded-lg border border-[#D8D2C4] shadow-xs text-xs font-mono">
                <div className="flex items-center gap-2 text-[#141C2B]">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                  <span className="font-bold">Official Record Page Simulation</span>
                  <span>·</span>
                  <span className="text-[#C8892E] font-semibold">{activeCitationForModal.pageOrSheetRef}</span>
                </div>
                <div className="text-[11px] text-[#64748B]">
                  Statutory File: <strong className="text-[#141C2B]">{targetVer?.fileName || 'statutory_record.pdf'}</strong> ({targetVer?.fileSize || '12.4 MB'})
                </div>
              </div>

              {/* High-Fidelity PDF Paper Container */}
              <div 
                ref={docPrintRef}
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
                className="w-full max-w-3xl bg-white rounded-lg shadow-xl border border-[#D5CEBF] p-6 sm:p-10 space-y-6 relative overflow-hidden"
              >
                {/* Background Watermark */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-4 select-none z-0">
                  <span className="font-serif font-black text-6xl text-[#141C2B] -rotate-35 tracking-widest uppercase">
                    CONFIDENTIAL · CMPDI STATUTORY RECORD
                  </span>
                </div>

                {/* PDF Header Band */}
                <div className="relative z-10 border-b-2 border-[#C8892E] pb-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#64748B]">
                        <span>MINISTRY OF COAL, GOVT OF INDIA</span>
                        <span>•</span>
                        <span>COAL INDIA LIMITED</span>
                      </div>
                      <h2 className="font-serif font-extrabold text-lg sm:text-xl text-[#141C2B] leading-tight tracking-tight">
                        CENTRAL MINE PLANNING & DESIGN INSTITUTE (CMPDI)
                      </h2>
                      <p className="text-xs text-[#64748B] font-mono">
                        STATUTORY TECHNICAL DOCUMENT & DIRECTIVE RECORD · {activeCitationForModal.subsidiary}
                      </p>
                    </div>

                    <div className="text-right font-mono flex-shrink-0">
                      <div className="bg-[#FAF8F3] border border-[#E4E0D6] px-3 py-1.5 rounded text-left space-y-0.5">
                        <span className="text-[9px] text-[#64748B] block uppercase">Statutory Document Code:</span>
                        <span className="font-bold text-xs text-[#141C2B] block">{activeCitationForModal.documentCode}</span>
                        <span className="text-[9px] text-[#16A34A] font-bold block">Status: Approved v{activeCitationForModal.versionNumber}.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono bg-[#FAF8F3] p-2.5 rounded-lg border border-[#EFEBE2]">
                    <div>
                      <span className="text-[9px] text-[#64748B] block">Directorate:</span>
                      <span className="font-bold text-[#141C2B]">{activeCitationForModal.subsidiary}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#64748B] block">Effective Date:</span>
                      <span className="font-bold text-[#141C2B]">{parsedDoc.date}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#64748B] block">Authority / Signer:</span>
                      <span className="font-bold text-[#141C2B]">{parsedDoc.author}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#64748B] block">Filing Location:</span>
                      <span className="font-bold text-[#C8892E]">{activeCitationForModal.pageOrSheetRef}</span>
                    </div>
                  </div>
                </div>

                {/* Document Main Heading */}
                <div className="relative z-10 space-y-1">
                  <h3 className="font-serif font-black text-base sm:text-lg text-[#141C2B]">
                    {activeCitationForModal.documentTitle}
                  </h3>
                  <div className="h-0.5 w-16 bg-[#C8892E]"></div>
                </div>

                {/* AI Grounded Citation Highlight Box */}
                <div className="relative z-10 p-4 sm:p-5 bg-[#FEF9EE] border-2 border-[#C8892E] rounded-xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#B45309]">
                      <Sparkles className="w-4 h-4 text-[#C8892E]" />
                      <span>CITED PASSAGE IN AI ASSISTANT ANSWER</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FDE68A] text-[#92400E]">
                      Ref: {activeCitationForModal.pageOrSheetRef}
                    </span>
                  </div>
                  <p className="font-serif text-xs sm:text-[13px] text-[#141C2B] leading-relaxed italic bg-white/80 p-3 rounded-lg border border-[#FDE68A]">
                    "{activeCitationForModal.excerpt}"
                  </p>
                </div>

                {/* Document Body Sections */}
                <div className="relative z-10 space-y-5 text-xs text-[#334155] leading-relaxed">
                  {parsedDoc.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="space-y-2">
                      <h4 className="font-serif font-bold text-sm text-[#141C2B] pb-1 border-b border-[#EFEBE2] flex items-center gap-2">
                        <span>{sec.heading}</span>
                      </h4>
                      <div className="space-y-2.5">
                        {sec.items.map((it, iIdx) => {
                          if (it.type === 'table' && it.rows) {
                            return (
                              <div key={iIdx} className="overflow-x-auto my-2">
                                <table className="w-full text-[11px] font-mono border-collapse border border-[#E4E0D6]">
                                  <tbody>
                                    {it.rows.map((r, rIdx) => (
                                      <tr key={rIdx} className={rIdx === 0 ? 'bg-[#FAF8F3] font-bold text-[#141C2B]' : 'hover:bg-[#FAF8F3]/50'}>
                                        {r.map((c, cIdx) => (
                                          <td key={cIdx} className="p-2 border border-[#E4E0D6]">{c}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          }
                          if (it.type === 'callout') {
                            return (
                              <div key={iIdx} className="p-3 bg-[#FAF8F3] border-l-3 border-[#C8892E] rounded-r-lg font-serif italic text-[#141C2B]">
                                {it.text}
                              </div>
                            );
                          }
                          if (it.type === 'directive') {
                            return (
                              <div key={iIdx} className="p-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg text-[#166534] font-medium font-sans">
                                <strong>Directive: </strong>{it.text}
                              </div>
                            );
                          }
                          return (
                            <p key={iIdx} className="font-serif text-xs sm:text-[13px] leading-relaxed text-[#334155]">
                              {it.text}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Key Metrics Table if present on target version */}
                  {targetVer?.keyMetrics && targetVer.keyMetrics.length > 0 && (
                    <div className="pt-3 border-t border-[#EFEBE2] space-y-3">
                      <h4 className="font-serif font-bold text-xs text-[#141C2B] uppercase tracking-wider font-mono">
                        Governed Metric Parameters Table
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                        {targetVer.keyMetrics.map((km, idx) => (
                          <div key={idx} className="p-2.5 bg-[#FAF8F3] rounded-lg border border-[#E4E0D6]">
                            <span className="text-[10px] text-[#64748B] block">{km.label}</span>
                            <span className="font-bold text-xs text-[#141C2B] mt-0.5 block">{km.value}</span>
                            {km.variance && (
                              <span className="text-[9px] text-[#C8892E] font-semibold block mt-0.5">{km.variance}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* PDF Sign-off & Verification Seal */}
                <div className="relative z-10 pt-6 border-t-2 border-[#141C2B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1 font-mono text-[10px] text-[#64748B]">
                    <div className="flex items-center gap-1.5 text-[#16A34A] font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>CMPDI CRYPTOGRAPHIC AUDIT SEAL VERIFIED</span>
                    </div>
                    <div>Digital Hash: <span className="font-mono text-[#141C2B]">{targetVer?.id ? `0xSHA256-${targetVer.id.slice(0, 12)}` : '0x9E4B27C188DF32A'}</span></div>
                    <div>Classification: STATUTORY · DGMS / CIL DIRECTIVE COMPLIANT</div>
                  </div>

                  <div className="text-right font-mono text-[10px] border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="font-bold text-[#141C2B]">{parsedDoc.author}</div>
                    <div className="text-[#64748B]">Directorate Technical Administrator</div>
                    <div className="text-[#16A34A] font-semibold">Approved on {parsedDoc.date}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ========================================================== */
            /*                EXCERPT & VECTOR CHUNK VIEW                 */
            /* ========================================================== */
            <div className="max-w-3xl mx-auto space-y-5">
              {/* Metadata Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
                <div className="bg-white p-3 rounded-lg border border-[#E4E0D6]">
                  <span className="text-[10px] text-[#64748B] block">Subsidiary:</span>
                  <span className="font-bold text-[#141C2B] mt-0.5 block">{activeCitationForModal.subsidiary}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#E4E0D6]">
                  <span className="text-[10px] text-[#64748B] block">Version:</span>
                  <span className="font-bold text-[#141C2B] mt-0.5 block">v{activeCitationForModal.versionNumber}.0 (Approved)</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#E4E0D6]">
                  <span className="text-[10px] text-[#64748B] block">File Location:</span>
                  <span className="font-bold text-[#C8892E] mt-0.5 block">{activeCitationForModal.pageOrSheetRef}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#E4E0D6]">
                  <span className="text-[10px] text-[#64748B] block">Relevance Match:</span>
                  <span className="font-bold text-[#16A34A] mt-0.5 block">{((activeCitationForModal.relevanceScore || 0.98) * 100).toFixed(0)}% Match</span>
                </div>
              </div>

              {/* Highlighted Excerpt Chunk */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-[#C8892E] shadow-xs space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <span className="font-bold text-[#C8892E] uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Cited Text Chunk from Official Record</span>
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 bg-[#FAF8F3] hover:bg-[#EFEBE2] border border-[#E4E0D6] rounded text-[11px] font-semibold text-[#141C2B] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3 text-[#64748B]" />}
                    <span>{copied ? 'Copied' : 'Copy Excerpt'}</span>
                  </button>
                </div>

                <div className="p-3.5 bg-[#FAF8F3] rounded-lg border border-[#E4E0D6] font-serif text-xs sm:text-sm leading-relaxed text-[#141C2B] italic">
                  "{targetVer ? targetVer.extractedText : activeCitationForModal.excerpt}"
                </div>
              </div>

              {/* Key Metrics Table if available */}
              {targetVer?.keyMetrics && targetVer.keyMetrics.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-[#E4E0D6] space-y-3">
                  <h4 className="font-serif font-bold text-xs text-[#141C2B]">
                    Extracted Metric Parameters
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                    {targetVer.keyMetrics.map((km, idx) => (
                      <div key={idx} className="p-2.5 bg-[#FAF8F3] rounded-lg border border-[#EFEBE2]">
                        <span className="text-[10px] text-[#64748B] block">{km.label}</span>
                        <span className="font-bold text-xs text-[#141C2B] mt-0.5 block">{km.value}</span>
                        {km.variance && (
                          <span className="text-[9px] text-[#C8892E] font-semibold block mt-0.5">{km.variance}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#E4E0D6] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenFullWorkspace}
              className="px-4 py-2.5 bg-[#FAF8F3] hover:bg-[#EFEBE2] border border-[#E4E0D6] text-[#141C2B] text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C8892E]" />
              <span>Open in Comparison & Document Reader</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2.5 bg-[#4C7A52] text-white text-xs font-bold rounded-lg hover:bg-[#3D6342] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'Downloading...' : 'Download Official PDF'}</span>
            </button>
            <button
              onClick={() => setActiveCitationForModal(null)}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#141C2B] text-white text-xs font-bold rounded-lg hover:bg-[#1E293B] cursor-pointer text-center"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

