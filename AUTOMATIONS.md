# ⚡ MineMind-AI: Complete Automation Systems & Intelligent Workflows Specification

> **Project**: MineMind-AI — Autonomous Mining Knowledge Platform, Regulatory Compliance Engine & Cryptographic Audit System  
> **Target Ecosystem**: Coal India Limited (CIL) & Central Mine Planning & Design Institute (CMPDI)  
> **Problem Domain**: Smart India Hackathon / SIH 2024 (Problem Statement ID: 26023 — Ministry of Coal)  
> **Repository Documentation**: Production-grade specification of all background automation engines, rule-based processors, AI pipelines, and cryptographic workflows.

---

## 📑 Table of Contents
1. [Executive Summary of Automations](#1-executive-summary-of-automations)
2. [Master Automations Architecture](#2-master-automations-architecture)
3. [Deep-Dive: The 10 Core Automation Engines](#3-deep-dive-the-10-core-automation-engines)
   - [Automation 1: Automated Multi-Modal Document Extraction & OCR Chunking](#automation-1-automated-multi-modal-document-extraction--ocr-chunking)
   - [Automation 2: Automated Statutory Compliance & Category-Mismatch Pre-Screening](#automation-2-automated-statutory-compliance--category-mismatch-pre-screening)
   - [Automation 3: Automated Intelligent Benchmark Reference Matching](#automation-3-automated-intelligent-benchmark-reference-matching)
   - [Automation 4: Automated Cryptographic SHA-256 Merkle Audit Ledger](#automation-4-automated-cryptographic-sha-256-merkle-audit-ledger)
   - [Automation 5: Automated Source-Grounded RAG & Citation Synthesis](#automation-5-automated-source-grounded-rag--citation-synthesis)
   - [Automation 6: Automated Contradiction & Numerical Drift Detection Engine](#automation-6-automated-contradiction--numerical-drift-detection-engine)
   - [Automation 7: Automated Statutory Dossier & CMPDI Form IV Compilation](#automation-7-automated-statutory-dossier--cmpdi-form-iv-compilation)
   - [Automation 8: Automated Underground Pit Cache & Offline Edge Synchronization](#automation-8-automated-underground-pit-cache--offline-edge-synchronization)
   - [Automation 9: Automated Acoustic Telemetry & Hands-Free Voice Ingestion](#automation-9-automated-acoustic-telemetry--hands-free-voice-ingestion)
   - [Automation 10: Automated RBAC Triage, Routine Bulk Approval & Routing](#automation-10-automated-rbac-triage-routine-bulk-approval--routing)
4. [Comparative Matrix: Manual vs Automated Mining Operations](#4-comparative-matrix-manual-vs-automated-mining-operations)
5. [Operational Impact on Coal India Limited (CIL) & CMPDI](#5-operational-impact-on-coal-india-limited-cil--cmpdi)

---

## 1. Executive Summary of Automations

MineMind-AI replaces error-prone manual geological filing, cross-referencing, and safety auditing with **10 deterministic and AI-powered automation pipelines**.

| Automation System | Primary Engine / Module | Trigger Event | Key Autonomous Action |
|:---|:---|:---|:---|
| **1. Multi-Modal OCR & Chunking** | `pdfExtractor.ts`, `pdfjs-dist` | Document file upload / drop | Extracts text layers, calculates OCR quality scores, and segments pages into searchable chunks. |
| **2. Compliance & Category Pre-Screening** | `complianceEngine.ts` | New version / draft submission | Evaluates statutory taxonomy, detects out-of-domain files, flags safety risks, and drafts notices. |
| **3. Benchmark Reference Matching** | `complianceEngine.ts` | Review queue opening | Automatically pairs submitted drafts with the closest approved reference based on topic similarity. |
| **4. Cryptographic Merkle Audit Ledger** | `security.ts`, Web Crypto API | Every user or system mutation | Computes SHA-256 hashes, cryptographically links blocks, and verifies chain integrity in real-time. |
| **5. Source-Grounded RAG Pipeline** | `AiAssistant.tsx`, `@google/genai` | Engineer natural-language query | Retrieves top-k chunks, queries Gemini models, and injects mandatory verified page citations. |
| **6. Numerical Drift & Contradiction Detection** | `CompareVersionsModal.tsx` | Version comparison / diff view | Scans text & tabular logs for shifts in ash %, stripping ratio, or gas emission ratings. |
| **7. Statutory Report & Form IV Compiler** | `ReportGenerator.tsx`, `jspdf` | Export request / audit deadline | Compiles cross-subsidiary returns into official CMPDI/DGMS vector PDF dossiers. |
| **8. Underground Pit Edge Cache** | `offlineRAG.ts`, IndexedDB | Network disconnect / precache action | Activates offline vector indexing for safety circulars with zero cellular/Wi-Fi connection. |
| **9. Acoustic Telemetry & Voice Ingestion** | `soundEffects.ts`, Web Speech API | Spoken query / status event | Transcribes voice dictation (`en-IN`) and synthesizes programmatic acoustic alert chimes. |
| **10. RBAC Triage & Routine Bulk Approval** | `ApprovalQueue.tsx`, `AppContext` | Ingestion queue refresh | Filters routine low-risk filings for one-click bulk sign-off while locking high-risk safety items. |

---

## 2. Master Automations Architecture

```
                                  MINE MINED-AI AUTOMATION ARCHITECTURE
                                  
   +-----------------------+     +-----------------------+     +-----------------------+
   |   1. INGESTION AUTO   |     |  2. COMPLIANCE AUTO   |     |   3. AUDITING AUTO    |
   | • Client-side PDF.js  | --> | • Mining Taxonomy     | --> | • SHA-256 Web Crypto  |
   | • OCR Quality Scoring |     | • Out-of-Domain Filter|     | • Merkle Block Chain  |
   | • Semantic Chunking   |     | • Dual-Score Matrix   |     | • Tamper Verification |
   +-----------+-----------+     +-----------+-----------+     +-----------+-----------+
               |                             |                             |
               +-----------------------------+-----------------------------+
                                             |
                                             v
   +-----------------------------------------------------------------------------------+
   |                                4. INTELLIGENCE AUTOMATIONS                        |
   |  • Dual-Tier RAG Engine: Online (Gemini 2.5/3.7) + Offline (Vector BM25 Pit Cache)|
   |  • Automated Primary Source Citation Binding (Document, Version, Section, Page)   |
   |  • Automated Contradiction & Numerical Drift Detection across Borehole Records    |
   +-----------------------------------------+-----------------------------------------+
                                             |
               +-----------------------------+-----------------------------+
               |                                                           |
               v                                                           v
   +-----------------------+                                   +-----------------------+
   |   5. WORKFLOW AUTO    |                                   |   6. DISPATCH AUTO    |
   | • Intelligent Benchmarks                                  | • CMPDI Form IV PDF   |
   | • Routine Bulk Signoff|                                   | • Acoustic Telemetry  |
   | • DGMS Compliance Lock|                                   | • Voice Dictation     |
   +-----------------------+                                   +-----------------------+
```

---

## 3. Deep-Dive: The 10 Core Automation Engines

### Automation 1: Automated Multi-Modal Document Extraction & OCR Chunking
* **Module / File**: `/src/utils/pdfExtractor.ts`, `/src/context/AppContext.tsx`
* **Trigger**: Drag-and-drop or file upload of PDF reports, borehole lithology books, or DGMS safety circulars.
* **Internal Mechanism**:
  1. **Binary Buffer Streaming**: Reads ArrayBuffers directly in client memory via `pdfjs-dist`.
  2. **Page-by-Page Extraction**: Traverses every page to extract text, tables, and positional metadata.
  3. **Automated OCR Confidence Scoring**: Calculates the ratio of recognized alphanumeric characters vs garbled unprintable glyphs:
     $$\text{OCR Confidence (\%)} = \left( \frac{\text{Valid Mining Glyphs}}{\text{Total Unicode Characters Extracted}} \right) \times 100$$
  4. **Dynamic Semantic Chunking**: Segments the document into 500-token chunks with 100-token sliding-window overlaps, preserving section headers, borehole coordinates, and page numbers.
* **Operational Importance**: Eliminates manual data entry of 100+ page geological reports, making documents instantly searchable within seconds of upload.
* **Why Chosen**: Client-side execution eliminates expensive cloud server upload bottlenecks and privacy leaks.

---

### Automation 2: Automated Statutory Compliance & Category-Mismatch Pre-Screening
* **Module / File**: `/src/utils/complianceEngine.ts`
* **Trigger**: Document upload or new version submission by field engineers.
* **Internal Mechanism**:
  1. **Taxonomy Verification**: Scans the text against 5 statutory mining categories (*Geological Exploration, Mine Planning, DGMS Safety & Ventilation, EMP Environmental Compliance, Coal Dispatch & Washery*).
  2. **Out-of-Domain Detection**: Analyzes text against non-mining blacklists (*Digital Electronics, College Lab Manuals, AI Prompt Manuals, General Software Frameworks*).
  3. **Dual-Score Calculation**:
     * $\text{Format Score} = f(\text{OCR Confidence}, \text{Digital Signature}, \text{Hash Collision})$
     * $\text{Content Score} = f(\text{Taxonomy Keyword Frequency}, \text{Category Alignment})$
     * $\text{Overall Score} = (0.4 \times \text{Format}) + (0.6 \times \text{Content}) - \text{Risk Penalty}$
  4. **Autonomous Action**: If a non-mining file is detected (e.g., student lab report), the system automatically flags `CATEGORY_MISMATCH_REJECT`, drops the compliance score to $\le 34\%$, blocks vector indexing, and auto-drafts a statutory rejection memo.
* **Operational Importance**: Prevents accidental or malicious contamination of the CIL knowledge base with irrelevant documents.

---

### Automation 3: Automated Intelligent Benchmark Reference Matching
* **Module / File**: `/src/utils/complianceEngine.ts` (`findTopicalBenchmarkReference`)
* **Trigger**: Opening any document in the Approvals Queue or Version Diff Workbench.
* **Internal Mechanism**:
  1. Analyzes the submitted draft’s category, subsidiary colliery jurisdiction, and technical keywords.
  2. Traverses the entire repository of previously approved documents.
  3. Scores candidates using an affinity formula:
     $$\text{Match Score} = \text{Category Match (45 pts)} + \text{Subsidiary Proximity (25 pts)} + \text{Keyword Overlap (up to 30 pts)}$$
  4. Automatically selects the highest-scoring approved reference and prepares the side-by-side diffing workbench.
* **Operational Importance**: Eliminates hours spent searching through file archives to find the historical baseline for comparing new mining proposals.

---

### Automation 4: Automated Cryptographic SHA-256 Merkle Audit Ledger
* **Module / File**: `/src/utils/security.ts`, `/src/components/AuditTrail.tsx`
* **Trigger**: Every user action (login, upload, approval, version change, AI query, statutory report export).
* **Internal Mechanism**:
  1. Extracts execution metadata: $\text{Timestamp}, \text{UserId}, \text{Subsidiary}, \text{Action}, \text{Payload}$.
  2. Retrieves the cryptographic hash of the immediate predecessor ($\text{Hash}_{n-1}$).
  3. Computes a deterministic SHA-256 digest using hardware-accelerated Web Crypto API:
     $$\text{Block Hash}_n = \text{SHA-256}(\text{Timestamp} + \text{UserId} + \text{Action} + \text{Payload} + \text{Hash}_{n-1})$$
  4. **Automated Chain Traversal**: Continuously verifies that every block's `previousHash` matches the computed hash of the prior block, instantly detecting and pinpointing any unauthorized modifications.
* **Operational Importance**: Satisfies legal non-repudiation and statutory audit standards required by the Directorate General of Mines Safety (DGMS).

---

### Automation 5: Automated Source-Grounded RAG & Citation Synthesis
* **Module / File**: `/src/components/AiAssistant.tsx`, `/server/gemini.ts`
* **Trigger**: Natural-language query from an engineer or manager in the AI Assistant.
* **Internal Mechanism**:
  1. **Query Pre-Processing**: Tokenizes inquiry and applies subsidiary filtering constraints.
  2. **Top-K Chunk Retrieval**: Computes vector similarity and lexical relevance to extract the top matching chunks.
  3. **Context Injection**: Injects extracted excerpts into the Gemini system prompt with strict zero-hallucination instructions.
  4. **Automated Citation Binding**: Attaches interactive citations indicating exact Document Title, Version Number, Section Header, and Page Number.
* **Operational Importance**: Gives mining engineers 100% verifiable answers backed by statutory circulars rather than unverified AI guesses.

---

### Automation 6: Automated Contradiction & Numerical Drift Detection Engine
* **Module / File**: `/src/components/CompareVersionsModal.tsx`, `/src/components/AiAssistant.tsx`
* **Trigger**: Version comparison workbench activation (e.g. comparing Geological Report v1.0 vs v2.0).
* **Internal Mechanism**:
  1. **Lexical & Numerical Diff**: Compares document revisions line-by-line and table-by-table.
  2. **Threshold Monitoring**: Scans for deviations in key mining parameters:
     * Overburden Stripping Ratio ($\Delta \text{SR} > \pm 0.5$)
     * Ash Content ($\Delta \text{Ash} > \pm 2.0\%$)
     * Gross Calorific Value ($\Delta \text{GCV} > \pm 250 \text{ kcal/kg}$)
     * Methane Emission Classification (Degree-I vs Degree-II/III shifts)
  3. **Visual Delta Highlighting**: Automatically generates split-screen curtain diffs with color-coded warning banners.
* **Operational Importance**: Flags hidden or unapproved parameter changes before safety approvals are signed.

---

### Automation 7: Automated Statutory Dossier & CMPDI Form IV Compilation
* **Module / File**: `/src/components/ReportGenerator.tsx`, `jspdf`
* **Trigger**: Report generation request from the Executive Dashboard or Compliance module.
* **Internal Mechanism**:
  1. Gathers active production data, borehole lithology summaries, audit ledger hashes, and AI risk evaluations.
  2. Constructs standardized statutory layouts (CMPDI Exploration Brief, DGMS Form IV Safety Return, EIA/EMP Clearance Summary).
  3. Uses `jspdf` to render vector tables, risk indicators, page headers, and digital signature boxes.
  4. Automatically downloads a publication-ready PDF dossier.
* **Operational Importance**: Reduces statutory filing preparation time from 3–5 days to under 10 seconds.

---

### Automation 8: Automated Underground Pit Cache & Offline Edge Synchronization
* **Module / File**: `/src/utils/offlineRAG.ts`, `/src/context/AppContext.tsx`
* **Trigger**: Loss of network connection (`window.addEventListener('offline')`) or manual "Underground Mode" toggle.
* **Internal Mechanism**:
  1. **Automatic Network Monitoring**: Detects disconnection and switches the application into offline mode.
  2. **Pit Cache Indexing**: Pre-loads essential safety circulars, rescue guidelines, and ventilation norms into browser memory and `localStorage`.
  3. **Local Vector & BM25 Scoring**: When offline, processes queries using local TF-IDF and keyword vector scoring to deliver instant safety guidance.
  4. **Auto-Reconciliation on Reconnect**: Synchronizes offline query logs and audit entries back to the primary database when connectivity returns.
* **Operational Importance**: Keeps safety-critical procedures accessible 500 meters underground where cellular and Wi-Fi signals cannot penetrate.

---

### Automation 9: Automated Acoustic Telemetry & Hands-Free Voice Ingestion
* **Module / File**: `/src/utils/soundEffects.ts`, `/src/components/AiAssistant.tsx`
* **Trigger**: Microphone button click (`#btn-voice-input`) or system event trigger.
* **Internal Mechanism**:
  1. **Dynamic Speech Recognition**: Initializes native `webkitSpeechRecognition` configured for Indian English (`en-IN`) mining terminology.
  2. **Live Audio Streaming**: Transcribes spoken input into the query field in real time.
  3. **Synthesized Acoustic Telemetry**: Uses the browser's `AudioContext` to generate programmatic audio cues (dispatch chimes, safety warning pulses, confirmation tones) with zero external audio files.
  4. **Voice Readback**: Automatically speaks technical recommendations aloud via `speechSynthesis`.
* **Operational Importance**: Enables hands-free operation for engineers in noisy field cabins or heavy machinery control rooms.

---

### Automation 10: Automated RBAC Triage, Routine Bulk Approval & Routing
* **Module / File**: `/src/components/ApprovalQueue.tsx`, `/src/context/AppContext.tsx`
* **Trigger**: Ingestion queue refresh or administrative login.
* **Internal Mechanism**:
  1. **Automated Triage**: Classifies submissions into **Routine** (low risk, high OCR score, verified category) vs **Urgent** (critical safety items, parameter drift, flagged risks).
  2. **Bulk Approval Automation**: Allows authorized Chief Mining Engineers to review and approve all routine filings in a single click (`bulkApproveRoutine`).
  3. **Safety Locks**: Prevents bulk approval on urgent or high-risk items, requiring mandatory manual review.
  4. **Automated Audit Logging**: Generates SHA-256 signed audit entries for every approved or rejected document.
* **Operational Importance**: Eliminates administrative backlogs while maintaining strict oversight over high-risk safety filings.

---

## 4. Comparative Matrix: Manual vs Automated Mining Operations

| Operational Workflow | Traditional Manual Process | MineMind-AI Automated Workflow | Velocity Multiplier |
|:---|:---|:---|:---|
| **Geological Report Ingestion** | Manual scanning, typing borehole data, filing paper binders (2–4 hours). | Automated PDF.js text extraction, OCR scoring, and semantic chunking (< 5 seconds). | **~150x Faster** |
| **Category & Domain Verification** | Manual visual inspection of submitted filing by administrative clerks (1–2 days). | Automated mining taxonomy & out-of-domain rejection engine (< 100 ms). | **Instant** |
| **Historical Baseline Matching** | Manually browsing physical archives or file folders for baseline reports (3–6 hours). | Automated benchmark reference selector matching topic and subsidiary (< 50 ms). | **~300x Faster** |
| **Numerical Drift Detection** | Line-by-line manual comparison of borehole depth tables and ash percentages (1–2 days). | Automated discrepancy detection highlighting parameter shifts (< 1 second). | **~500x Faster** |
| **Audit Trail Verification** | Paper logbooks and signed registers vulnerable to loss or tampering. | Hardware-accelerated SHA-256 Merkle chain with real-time tamper detection. | **Continuous & Tamper-Proof** |
| **Underground Knowledge Access** | Zero access to safety manuals underground; requires returning to surface. | Offline edge pit cache delivering instant vector query responses underground. | **Zero Downtime** |
| **Statutory Return Compilation** | Manually compiling data from multiple departments into DGMS Form IV (3–5 days). | Automated vector PDF synthesis and official report compilation (< 10 seconds). | **~2000x Faster** |

---

## 5. Operational Impact on Coal India Limited (CIL) & CMPDI

1. **Massive Reduction in Filing Cycle Times**: Cuts end-to-end statutory filing and review cycles from weeks to minutes.
2. **Zero Contamination of Mining Knowledge**: Automated category mismatch filters prevent non-mining documents from corrupting the RAG knowledge base.
3. **Statutory Non-Repudiation**: The SHA-256 Merkle ledger provides verifiable evidence for DGMS regulatory audits and post-incident inquiries.
4. **Underground Worker Safety**: Offline edge caching guarantees that emergency rescue procedures and gas cutoff thresholds remain available in deep seams.
5. **Cross-Subsidiary Alignment**: Standardizes data formatting, parameter tracking, and approval workflows across all 8 Coal India subsidiaries.

---
*Authored for Coal India Limited (CIL) & Central Mine Planning and Design Institute (CMPDI) — Smart India Hackathon (SIH 2024).*
