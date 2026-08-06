<div align="center">

# ⚡ TaskSync — AI-Powered Engineer Productivity Suite & DSA Lab

[![Live Demo](https://img.shields.io/badge/Live%20Demo-https%3A%2F%2Ftasksync--app.surge.sh-6366f1?style=for-the-badge&logo=surge&logoColor=white)][https://tasksync-20na.onrender.com]
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)](LICENSE)

**TaskSync** is an engineer-first productivity workspace featuring interactive Data Structures & Algorithms (DSA) visualizers, natural language task parsing, calendar scheduling, real-time analytics, and GPU-accelerated glassmorphic UI shaders.

[🚀 **Explore Live Demo**](https://tasksync-20na.onrender.com) • [📖 **View Architecture**](#-project-architecture) • [🛠️ **Local Setup**](#%EF%B8%8F-getting-started)

</div>

---

## 🌟 Key Features

### 🧠 1. Interactive DSA Laboratory & Algorithm Visualizers
- **Binary Search Tree (BST) & Heap Visualizers:** Real-time animated insertions, root extractions (bubble-down), min/max heap conversions, and array-to-tree SVG rendering.
- **Randomize & Step-by-Step Heapify:** Dedicated step controls to visualize array heapification in real-time.
- **LeetCode Algorithm Visualizers:** Built-in step-by-step state visualizers for Problem #1929 (*Concatenation of Array*) and Problem #88 (*Merge Sorted Array*).

### ⚡ 2. Magic Add & Natural Language Task Parser
- Type expressions like `"Study DSA tomorrow 7pm for 2h"` — TaskSync automatically parses date, time, duration, cognitive load tags, and categories.

### 🎯 3. AI Planner & Cognitive Load Balancer
- One-click focus plan generator that sorts tasks by priority, upcoming deadlines, and mental effort.
- Built-in Pomodoro focus timer with break mode toggles and customizable timers.

### 📊 4. Engineering Command Center & Analytics
- Dynamic dashboard powered by **Recharts** for visualizing streak trends, topic mastery radar charts, and focus distribution.
- **Gamified Engineer Stats:** Live streak counters, brain capacity progress monitors, and level progress indicators.

### 🎨 5. Glassmorphic Design System & GPU Shaders
- **Lightfall Shader:** Interactive GPU-accelerated light streak canvas built with `ogl` and custom WebGL shaders.
- **PixelBlast & LiquidEther:** Interactive particle effects for landing and ambient backgrounds.
- **BorderGlow & StrokeText:** Glowing neon borders responding to cursor proximity and GSAP SVG stroke animations.

### 📱 6. 100% Mobile Responsive Layout
- Adaptive mobile drawer sidebar with backdrop blur overlays and hamburger menu toggles for phones and tablets.

---

## 📁 Project Architecture

```text
TaskSync/
├── setup/                  # Documentation & installer tools
├── scripts/                # Utility & diagnostic scripts
├── public/                 # Static assets & favicon
├── src/
│   ├── assets/             # Images & static assets
│   ├── components/
│   │   ├── landing/        # Hero, Navbar, Pricing, Footer
│   │   ├── sandbox/        # Experimental mockups & UI archetypes
│   │   └── ui/             # Reusable UI library (BorderGlow, Lightfall, Button, etc.)
│   ├── constants/          # Application constants
│   ├── data/               # DSA algorithm datasets & mock initializers
│   ├── lib/                # Utility helpers & Auth context provider
│   └── pages/
│       ├── app/            # AppShell, Dashboard, Tasks, CalendarPage, Analytics, Insights, Settings
│       ├── auth/           # Login, Register, Forgot Password
│       ├── dsa/            # DSA Laboratory (DsaLab, QuestionsGuide, Visualizers)
│       └── landing/        # Product Landing Page
├── .github/workflows/      # Automated GitHub Actions CI/CD deployment workflow
├── index.html              # Standalone bundled production entrypoint
├── package.json            # Dependencies & npm scripts
├── tailwind.config.js      # Tailwind CSS design system configuration
└── vite.config.js          # Vite build configuration & singlefile inlining
```

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** v9.0.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rajat-Dhiman00/TaskSync.git
   cd TaskSync
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 💻 Tech Stack

| Domain | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Styling** | [TailwindCSS 3](https://tailwindcss.com/) + Custom Glassmorphism CSS |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) + [GSAP](https://gsap.com/) |
| **GPU Shaders** | [OGL](https://github.com/oframe/ogl) + [Three.js](https://threejs.org/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Deployment** | [Surge.sh](https://surge.sh/) (Live CDN) |

---

## 🌐 Live Deployment

The production application is live and hosted on Surge CDN:
👉 **[https://tasksync-app.surge.sh](https://tasksync-app.surge.sh)**

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ for engineers & problem solvers.</sub>
</div>
