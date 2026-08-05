# TaskSync — AI Reminder & Productivity Suite

TaskSync is an engineer-first productivity workspace featuring interactive DSA algorithm visualizers, smart task management, calendar scheduling, real-time analytics, and AI insights.

---

## 📁 Project Architecture

```
src/
├── assets/          # Static assets & icons
├── components/      
│   ├── landing/     # Landing page sections (Hero, Navbar, Pricing, Footer)
│   ├── sandbox/     # Experimental components & mockups
│   └── ui/          # Reusable UI component library (Shadcn/UI, BorderGlow, etc.)
├── constants/       # App constants & configurations
├── data/            # Mock datasets & algorithm initializers
├── lib/             # Utility functions, API clients, and Auth context
├── pages/           
│   ├── app/         # Core application views (Dashboard, Tasks, Calendar, Analytics, Insights, Settings)
│   ├── auth/        # Authentication views (Login, Register, Forgot Password)
│   ├── dsa/         # DSA Laboratory & Interactive Visualizers (BST/Heaps, Array Sorting, Two Pointers)
│   └── landing/     # Public product landing page
├── App.css          # Core CSS variables & theme overrides
├── App.jsx          # App router configuration & layout definitions
└── main.jsx         # Application entrypoint
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
# Create bundled single-file distribution
npm run build
```

---

## 🛠️ Key Features

- **Interactive DSA Lab**: Visualizers for Binary Search Trees, Min/Max Heaps, Array Sorting, and LeetCode problems (#1929, #88).
- **Engineering Command Center**: Dashboard analytics built with Recharts, glassmorphism UI, and dark mode theme switching.
- **AI Insights & Scheduler**: Task velocity tracking, pomodoro focus timers, and event management.
- **Glassmorphic UI**: Custom shaders, GSAP animations, particle effects (`Lightfall`, `PixelBlast`, `LiquidEther`, `BorderGlow`).

---

## 📄 License
MIT License
