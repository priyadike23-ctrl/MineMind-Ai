# 🛠️ MineMind-AI: Complete Technical Stack & Architectural Deep Dive

> **Document Purpose**: Comprehensive, production-grade technical stack breakdown for **MineMind-AI** (Smart India Hackathon 2024 / Problem Statement ID: 26023 — Ministry of Coal / Coal India Limited & CMPDI).  
> This specification details every tool, framework, library, and protocol used in the system, how they interact, why they were chosen, and their critical importance to mining operations.

---

## 📑 Table of Contents
1. [Executive Summary of Tech Stack](#1-executive-summary-of-tech-stack)
2. [Detailed Technology Breakdown](#2-detailed-technology-breakdown)
   - [Frontend & UI Framework](#frontend--ui-framework)
   - [Styling & Design System](#styling--design-system)
   - [Backend & Server Infrastructure](#backend--server-infrastructure)
   - [AI & Large Language Model (LLM) Orchestration](#ai--large-language-model-llm-orchestration)
   - [Document Processing & Multi-Modal OCR](#document-processing--multi-modal-ocr)
   - [Cryptographic Security & Tamper-Evident Ledger](#cryptographic-security--tamper-evident-ledger)
   - [Offline-First & Edge Pit Computing (PWA)](#offline-first--edge-pit-computing-pwa)
   - [Voice, Acoustics & Hands-Free Audio Engine](#voice-acoustics--hands-free-audio-engine)
   - [Mobile Runtime & Edge Packaging](#mobile-runtime--edge-packaging)
3. [Component Interconnection & Data Flow](#3-component-interconnection--data-flow)
4. [Why This Stack Was Chosen (Trade-Off Analysis)](#4-why-this-stack-was-chosen-trade-off-analysis)
5. [Importance to CIL & Mining Operations](#5-importance-to-cil--mining-operations)

---

## 1. Executive Summary of Tech Stack

| Layer / Category | Technology / Library | Version | Core Responsibility |
|:---|:---|:---|:---|
| **Client UI Framework** | **React** | `18.3.1` | Declarative, component-driven UI for mining dashboards, split-screen diffing & workflows. |
| **Language & Typing** | **TypeScript** | `5.6.2` | End-to-end type safety across geological schemas, audit logs, and compliance rules. |
| **Build & Bundler** | **Vite** | `6.0.5` | Lightning-fast ESM dev server, optimized tree-shaken static production bundling. |
| **Design & Styling** | **Tailwind CSS** | `@tailwindcss/vite` | High-contrast, responsive industrial UI theme tuned for field readability. |
| **Icons & UI Micro-motion**| **Lucide React + Motion** | `^0.469.0` / `motion` | Standardized technical iconography and smooth state transitions between dashboards. |
| **Backend API Gateway** | **Node.js + Express** | `4.21.2` | Secure REST API layer, Gemini key proxying, and enterprise production asset serving. |
| **Server Runtime Tooling** | **tsx + esbuild** | `^4.19.2` / `^0.24.2` | High-performance direct TypeScript execution and CommonJS production compilation. |
| **AI / LLM Engine** | **Google GenAI SDK (`@google/genai`)** | `0.1.2` | Gemini 2.5/3 multimodal reasoning, compliance contradiction detection & statutory synthesis. |
| **Document Parsing** | **PDF.js (`pdfjs-dist`) + html2canvas + jsPDF** | `4.10.38` / `1.4.1` / `2.5.2` | Client-side tabular PDF extraction, DOM rendering, and official statutory PDF compilation. |
| **Data Visualization** | **Recharts + Lucide Data Visualizers** | `^2.15.0` | Production trends, borehole assay depth charts, stripping ratios & compliance metrics. |
| **Security & Auditing** | **Web Crypto API (`crypto.subtle`)** | Native Hardware SHA-256 | SHA-256 Merkle chain verification, tamper-evident document hashing, and immutable logs. |
| **Offline Vector Retrieval**| **Custom In-Memory / IndexedDB RAG** | Vector Cosine + BM25 | Underground pit cache enabling full search & compliance querying with zero internet. |
| **Acoustic & Voice UI** | **Web Speech API + Web Audio Synthesizer** | Native Browser APIs | Industrial hands-free voice dictation (`en-IN`) and acoustic telemetry chimes. |
| **Mobile Portability** | **Capacitor (`@capacitor/core`)** | `^7.0.0` | Native Android APK containerization for field tablets and ruggedized pit devices. |

---

## 2. Detailed Technology Breakdown

### Frontend & UI Framework
* **React 18 (`react`, `react-dom`)**:
  * **Role**: Powering the entire Single Page Application (SPA) architecture across 8 dedicated operational modules: *Executive Dashboard, Knowledge Center, AI Assistant, Regulatory Approvals, Version Comparison, Audit Trail, Report Generator, and System Settings*.
  * **How it works**: Uses functional components with React Context (`AppContext.tsx`) to manage global state without bloated third-party state managers. Coordinates upload queues, document diffing overlays, and role switches seamlessly.
  * **Why it matters**: React's virtual DOM reconciliation guarantees instant UI responsiveness even when rendering massive data tables containing hundreds of borehole records or audit hashes.

* **TypeScript (`typescript`)**:
  * **Role**: Enforces strict structural typing for complex mining domain models (`Chunk`, `SourceCitation`, `ComplianceRule`, `AuditLogEntry`, `SubsidiaryCode`, `VersionDiff`).
  * **How it works**: Compiles directly down to JavaScript with zero runtime overhead while catching schema mismatches during development.
  * **Why it matters**: Geological data and statutory parameters cannot tolerate runtime `undefined` errors. Strict types ensure calculations (like Stripping Ratio = Overburden / Coal) remain mathematically sound across all modules.

---

### Styling & Design System
* **Tailwind CSS v4 (`@tailwindcss/vite`)**:
  * **Role**: Provides utility-first styling with an enterprise industrial aesthetic.
  * **How it works**: Compiled natively via Vite. Incorporates an intentional industrial color palette: Slate Dark (`#141C2B`), Muted Charcoal (`#1E293B`), Warm Canvas (`#FAF8F3`), and Mining Gold (`#C8892E`).
  * **Why it matters**: Mining field engineers work under extreme lighting conditions (bright open-cast sunlight or dimly lit underground control cabins). The high-contrast palette and mathematically scaled typography ensure WCAG AA accessibility.

* **Lucide React & Motion (`lucide-react`, `motion`)**:
  * **Role**: Professional industrial iconography and physics-based fluid layout animations.
  * **How it works**: Treeshaken SVG vector icons and lightweight CSS-accelerated transition states.
  * **Why it matters**: Eliminates cognitive overload for operators navigating dense regulatory and geological dashboards.

---

### Backend & Server Infrastructure
* **Node.js & Express (`express`, `@types/express`)**:
  * **Role**: Full-stack backend API server running on port `3000`.
  * **How it works**:
    1. Proxies LLM and sensitive queries through `/api/*` endpoints.
    2. Serves client SPA static assets in production (`dist/index.html`).
    3. Handles health-checks and secure server-to-server integrations.
  * **Why it matters**: **Complete Security Isolation**. The Google Gemini API key is stored strictly on the server (`process.env.GEMINI_API_KEY`) and is **never sent to the client browser**, eliminating any risk of API key extraction.

* **`tsx` & `esbuild`**:
  * **Role**: Development TypeScript execution and blazing-fast CommonJS production bundling into `dist/server.cjs`.
  * **How it works**: `tsx` executes `server.ts` directly during development. In production, `esbuild` compiles the server in milliseconds with `--packages=external` for minimal container cold-starts.

---

### AI & Large Language Model (LLM) Orchestration
* **Google GenAI SDK (`@google/genai`)**:
  * **Role**: Primary intelligence layer utilizing Gemini models (Gemini 2.5 Flash / Gemini 3.7).
  * **How it works**:
    1. **Retrieval-Augmented Generation (RAG)**: Combines user queries with verified document text chunks.
    2. **Contradiction Detection**: Scans newly uploaded draft reports against statutory baselines (DGMS safety circulars, Coal Mines Regulations 2017) to catch regulatory violations.
    3. **Automated Synthesis**: Generates official multi-page reports with executive summaries, risk matrices, and lithological summaries.
  * **Why it matters**: Gemini's massive context window and reasoning capabilities allow it to analyze entire 100-page geological reports in a single inference call, identifying subtle numerical shifts (e.g. ash % increase from 28% to 34%).

---

### Document Processing & Multi-Modal OCR
* **PDF.js (`pdfjs-dist`)**:
  * **Role**: Client-side parsing and rendering of multi-page technical PDFs.
  * **How it works**: Reads raw ArrayBuffers directly from user uploads or drag-and-drop actions, extracts text layers page-by-page, and segments documents into semantic chunks.
  * **Why it matters**: Zero server-side upload bottlenecks. Mining engineers can parse 50MB borehole reports in seconds directly inside their browser.

* **jsPDF & html2canvas (`jspdf`, `html2canvas`)**:
  * **Role**: Statutory report generation and PDF exportation.
  * **How it works**: Captures DOM elements, converts tables and charts into high-DPI vector PDF layouts, and embeds official CMPDI headers and signatures.

---

### Cryptographic Security & Tamper-Evident Ledger
* **Web Crypto API (`crypto.subtle`)**:
  * **Role**: Hardware-accelerated SHA-256 cryptographic hashing and Merkle chain verification.
  * **How it works**:
    * Every document upload, approval, revision, or statutory query computes a deterministic SHA-256 hash:
      $$\text{Hash}_n = \text{SHA256}(\text{Timestamp} + \text{User} + \text{Action} + \text{Payload} + \text{Hash}_{n-1})$$
    * Each block points to the previous block's hash. If any past record is tampered with in storage, the cryptographic verification algorithm immediately flags the broken block.
  * **Why it matters**: Complies with statutory accountability mandates from the Ministry of Coal and DGMS, preventing retroactive tampering of safety audits or production figures.

---

### Offline-First & Edge Pit Computing (PWA)
* **Offline Vector & BM25 Knowledge Retrieval (`offlineRAG.ts`)**:
  * **Role**: Zero-connectivity knowledge retrieval in deep underground mines and remote exploration sites.
  * **How it works**: Indexes essential statutory circulars (DGMS safety guidelines, rescue protocols, ventilation norms) directly in browser memory and `localStorage`. When the user is disconnected, it uses TF-IDF and keyword vector scoring to provide instant answers with zero internet.
  * **Why it matters**: Underground coal mines have no cellular or Wi-Fi reception. Safety procedures must be instantly accessible offline.

---

### Voice, Acoustics & Hands-Free Audio Engine
* **Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)**:
  * **Role**: Hands-free voice inquiry and dictation optimized for Indian English (`en-IN`).
  * **How it works**: Streams real-time audio from the microphone, converting spoken inquiries (e.g., *"What is the statutory liquid nitrogen infusion rate for Jharia?"*) into technical search queries.
* **Web Audio API Sound Engine (`soundEffects.ts`)**:
  * **Role**: Synthesized acoustic telemetry for industrial dispatch sounds, error alerts, and verification chimes without external `.mp3` dependencies.

---

### Mobile Portability
* **Capacitor (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`)**:
  * **Role**: Bridges the web application into an installable native Android APK for rugged field tablets (Panasonic Toughbook, Samsung Galaxy Active).

---

## 3. Component Interconnection & Data Flow

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER / PWA                               |
|                                                                                       |
|   +-----------------------+     +-----------------------+     +-------------------+   |
|   |  Mining Engineer UI   |     |  Executive Admin UI   |     | Audio/Voice Engine|   |
|   +-----------+-----------+     +-----------+-----------+     +---------+---------+   |
|               |                             |                           |             |
|               +--------------+--------------+---------------------------+             |
|                              |                                                        |
|                              v                                                        |
|               +-----------------------------+                                         |
|               | React Context & State Store |                                         |
|               +--------------+--------------+                                         |
|                              |                                                        |
|       +----------------------+----------------------+                                 |
|       |                      |                      |                                 |
|       v                      v                      v                                 |
|  +---------+          +--------------+       +--------------+                         |
|  | PDF.js  |          | Offline RAG  |       |  Web Crypto  |                         |
|  | Parser  |          |  (Pit Cache) |       | (SHA-256 ML) |                         |
|  +----+----+          +-------+------+       +-------+------+                         |
+-------|-----------------------|----------------------|--------------------------------+
        |                       |                      |
        | (Online Mode)         | (Offline Fallback)   | (Cryptographic Audit Verification)
        v                       v                      v
+---------------------------------------------------------------------------------------+
|                               EXPRESS GATEWAY (server.ts)                             |
|                           [Port 3000 / Reverse Proxy Guard]                           |
+---------------------------------------+-----------------------------------------------+
                                        |
                                        | Secure Server-to-Server HTTPS
                                        v
+---------------------------------------------------------------------------------------+
|                               GOOGLE GEMINI AI PLATFORM                               |
|                [Gemini 2.5 / 3.7 Multi-Modal Document & Compliance Engine]             |
+---------------------------------------------------------------------------------------+
```

---

## 4. Why This Stack Was Chosen (Trade-Off Analysis)

| Alternative Considered | Chosen Stack | Why MineMind Chose This Stack |
|:---|:---|:---|
| **Python FastAPI / Django** | **Node.js + Express (TypeScript)** | **Unified Codebase**: Enables sharing TypeScript interfaces across client and server. No context switching, smaller container footprint, and faster startup on edge servers. |
| **Heavy External SQL Server** | **Hybrid In-Memory + WebCrypto + Supabase-Ready Schema** | **Zero Latency & Offline Capability**: Mining engineers in pit areas can run local validations without requiring an active database connection. |
| **Traditional Cloud AI (Client Key)** | **Server-Side Proxied Gemini SDK** | **Security & Compliance**: Keeps enterprise Google API keys safe from exposure in browser inspector tools. |
| **Bulky MP3 Audio Files** | **Web Audio Synthesizer (Oscillator Nodes)** | **Zero Asset Weight**: Audio chimes are generated programmatically via math formulas in pure code, adding 0 KB to network payload. |
| **Native Kotlin/Java Android** | **React + Vite + Capacitor** | **Cross-Platform Velocity**: 100% code reuse across Desktop Web, Tablets, and Android rugged devices without maintaining two separate codebases. |

---

## 5. Importance to CIL & Mining Operations

1. **Zero Hallucination with Primary Source Citations**: Unlike generic AI chatbots, MineMind binds every AI output to verified document chunks with exact page, paragraph, and subsidiary metadata.
2. **Statutory Integrity Enforcement**: Cryptographic SHA-256 Merkle chain guarantees that safety reports cannot be altered post-incident.
3. **Deep Pit Underground Continuity**: Offline RAG ensures that ventilation norms, methane thresholds, and DGMS emergency procedures remain accessible 500 meters underground without internet connectivity.
4. **Cross-Subsidiary Standardization**: Unifies disparate reporting formats across all 8 CIL subsidiaries into standardized, compliant formats.

---
*Authored for Coal India Limited (CIL) & Central Mine Planning and Design Institute (CMPDI) — Smart India Hackathon 2024.*
