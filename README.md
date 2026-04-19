# FlowPulse 🏟️

> **Know before you go. Inside the stadium.**

FlowPulse is a mobile-first Progressive Web App (PWA) designed to give live event and sports attendees ultimate control and insight inside stadium environments. It replaces physical signage and guesswork with real-time crowd density maps, dynamic smart entry routing, predictive food stall queue times, and a live match timeline. 

Its dark-mode, zero-noise interface relies heavily on high-contrast variables, minimalist geometries, and pill-shaped scalable components for intuitive user interaction even when distracted in a densely packed arena.

---

## ⚡ Core Features

- **Live Indoor Routing:** Complete custom SVG stadium engine generating dynamic heat overlays based on crowdsourced gateway density.
- **Queue Time Predictions:** Incorporates the Google Gemini Flash API to predict food stall queues based on match progression, zone congestion, and historical event loads.
- **Smart Gate Routing:** Ranks entrance gateways live, analyzing baseline route walking distance multiplied by live congestion modifiers from Firebase real-time user reports.
- **Event Timeline Tracking:** See event progression statuses injected directly above live mapping so you know the urgency.
- **True PWA Output:** Offline-resilient, minimal Next.js app optimized to look natively installed with high scalability.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS V3 + Deep Custom System (Inter, Montserrat geometries)
- **State Management:** Zustand
- **Database:** Firebase Realtime Database
- **AI Core:** Google Gemini (`@google/genai` API)
- **Containerization:** Multi-stage Dockerized build.

---

## 🚀 Getting Started Locally

### 1. Requirements
- Node.js 18.17+
- npm or yarn

### 2. Environment Setup

Create a `.env.local` file in the root directory based on `.env.example`.

You will need the following keys:
```env
# Firebase Credentials (For real-time density)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Google Gemini API (For live queue predictions)
GEMINI_API_KEY=your_gemini_key
```

*(Note: The Firebase Realtime Database requires read/write rules to be exposed or authenticated. By default for testing, set `".read": true, ".write": true` temporarily).*

### 3. Installation & Run

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 
*(Pro tip: Hit `F12`, open device developer tools, and view the app in native iOS/Android resolution for the true user experience).*

---

## 🧪 Testing

The algorithm for intelligent routing and crowd density modification runs purely mathematically, decoupled from Google Maps for absolute indoor flexibility.

Run the test suite confirming density weighting parameters manually:

```bash
npx vitest
```

---

## 🔒 License
Proprietary / Open (Determine based on project launch). Built explicitly for optimized crowd pulse mechanics.
