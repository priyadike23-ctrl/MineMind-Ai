# 🛠️ MineMind-AI — Technology Stack Specification

Comprehensive technical specification and architecture breakdown for the **MineMind-AI** Geological, Mining, and Statutory Governance Platform.

---

## 🏗️ Architecture Overview

MineMind-AI is built on an enterprise full-stack architecture combining a **Vite + React 18 TypeScript** Single-Page Application (SPA) frontend, an **Express.js API gateway**, a hybrid client/server **RAG pipeline powered by Google Gemini**, and an **offline-first PWA / Capacitor cross-platform runtime**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│  React 18 + TypeScript • Tailwind CSS 3.4 • Motion • Lucide Icons       │
├────────────────────────────────────────────────────────────────────────┤
│                       DATA VISUALIZATION & CAD                         │
│  Recharts • Lucide Visualizers • Canvas Lithology • Diff Workbench    │
├────────────────────────────────────────────────────────────────────────┤
│                          CORE AI & RAG LAYER                           │
│  @google/genai (Gemini 2.5 Flash) • Client Embeddings • Pit Cache RAG  │
├────────────────────────────────────────────────────────────────────────┤
│                       BACKEND & API GATEWAY                            │
│  Node.js + Express.js • TSX • Vite Dev Middleware • REST Endpoints     │
├────────────────────────────────────────────────────────────────────────┤
│                     SECURITY & GOVERNANCE LAYER                        │
│  SHA-256 Hashing • RBAC Matrix • DGMS Compliance • Audit Trail Engine  │
├────────────────────────────────────────────────────────────────────────┤
│                     OFFLINE & MOBILE RUNTIME                           │
│  Progressive Web App (PWA) • Service Workers • Capacitor (Android/iOS) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 1. Frontend & Client Runtime

| Technology | Version | Purpose & Usage in MineMind-AI |
| :--- | :--- | :--- |
| **React** | `^18.3.1` | Core UI library providing declarative, component-driven architecture for the Dual-Portal workbench (Mining Engineer & Executive Admin). |
| **TypeScript** | `~5.5.3` | Strict type-safety across all geological schemas, borehole strata models, statutory compliance objects, and audit records. |
| **Vite** | `^5.4.2` | High-speed frontend build tool and dev server with optimized tree-shaking and bundling. |
| **Tailwind CSS** | `^3.4.1` | Utility-first responsive CSS styling with custom industrial palette (Slate, Amber, Coal Charcoal, and Mineral Green). |
| **Motion** | `^11.0.0` | High-performance spring animations, page transitions, and interactive visual slider controls for diff comparisons. |
| **Lucide React** | `^0.344.0` | Clean, standardized vector iconography across all navigation, document badges, tools, and telemetry displays. |

---

## 🧠 2. Artificial Intelligence & RAG Pipeline

| Technology | Purpose & Usage in MineMind-AI |
| :--- | :--- |
| **Google Gemini API (`@google/genai`)** | Powers natural language search, contradiction detection across versions, and 5-step statutory report synthesis using **Gemini 2.5 Flash**. |
| **Vector Retrieval (RAG)** | Grounded retrieval engine embedding and searching approved technical filings and DGMS statutory regulations. |
| **Deterministic Contradiction Engine** | Semantic and numerical difference detection comparing v1.0 and v2.0 files for altered reserve grades or stripping ratios. |
| **Client-Side Pit Cache** | Local indexing of safety circulars and borehole logs enabling zero-connectivity queries inside underground mines. |

---

## 📊 3. Data Visualization & Document Processing

| Technology | Version | Purpose & Usage |
| :--- | :--- | :--- |
| **Recharts** | `^2.12.0` | Responsive charts for Knowledge Distribution, Monthly Exploration Frequency, Stripping Ratio metrics, and Mine Trends. |
| **Canvas Image Processor** | Custom HTML5 | Pixel-level rendering of core borehole logs, lithological strata columns, and visual cross-sections. |
| **Visual Diff Workbench** | Custom Engine | Side-by-side split view, Wipe Curtain slider, and Onion Skin opacity overlay for instant version comparison. |
| **PDF Generation (`jsPDF` + `html2canvas`)** | Client Engine | Dynamic synthesis and client-side PDF export of DGMS returns, drilling summaries, and environmental audits. |

---

## ⚙️ 4. Backend, Server & Middleware

| Technology | Version | Purpose & Usage |
| :--- | :--- | :--- |
| **Node.js** | `>=18.x` | Server-side JavaScript runtime powering the API gateway and Gemini proxy. |
| **Express.js** | `^4.19.2` | RESTful API server routing AI requests, health telemetry, and static asset distribution. |
| **TSX** | `^4.19.0` | TypeScript execution engine running `server.ts` seamlessly in development. |
| **ESBuild** | Production | High-performance bundling of backend TypeScript into production-ready standalone CommonJS (`dist/server.cjs`). |

---

## 🔒 5. Security, Access Control & Compliance

| Layer | Implementation Strategy |
| :--- | :--- |
| **Role-Based Access Control (RBAC)** | Strict separation of permissions across **Viewer**, **Mining Engineer**, **Lead Reviewer**, and **Super Admin**. |
| **Cryptographic Integrity** | SHA-256 document and vector chunk fingerprinting to prevent unauthorized tampering of safety thresholds. |
| **Immutable Audit Trail** | Non-repudiable activity logging tracking all user actions, document approvals, role changes, and threat events. |
| **IDOR Defense** | Subsidiary-scoped data validation ensuring confidential mine plans cannot be accessed cross-subsidiary without explicit clearance. |

---

## 📱 6. Offline & Cross-Platform Mobile Deployment

| Technology | Version | Purpose & Usage |
| :--- | :--- | :--- |
| **Capacitor Core / CLI** | `^7.0.1` | Cross-platform container packaging the web application into native Android and iOS applications. |
| **Service Workers / PWA** | Web Standard | Caching static assets, styles, and essential knowledge packs for field operations without network coverage. |

---

## 📦 7. Complete Dependency Manifest

```json
{
  "dependencies": {
    "@google/genai": "^0.1.1",
    "express": "^4.19.2",
    "lucide-react": "^0.344.0",
    "motion": "^11.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "@capacitor/cli": "^7.0.1",
    "@capacitor/core": "^7.0.1",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.24",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "esbuild": "^0.20.1",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "tsx": "^4.19.0",
    "typescript": "~5.5.3",
    "vite": "^5.4.2"
  }
}
```

---

## 🚀 Quick Start & Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start full-stack development server (binds to http://localhost:3000)
npm run dev

# 4. Build for production
npm run build

# 5. Launch compiled server
npm start
```
