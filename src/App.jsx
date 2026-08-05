import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import Landing from "@/pages/landing/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Forgot from "@/pages/auth/Forgot";
import AppShell from "@/pages/app/AppShell";
import Dashboard from "@/pages/app/Dashboard";
import Tasks from "@/pages/app/Tasks";
import CalendarPage from "@/pages/app/CalendarPage";
import Analytics from "@/pages/app/Analytics";
import Insights from "@/pages/app/Insights";
import DsaLab from "@/pages/dsa/DsaLab";
import QuestionsGuide from "@/pages/dsa/QuestionsGuide";
import Visualizer1929 from "@/pages/dsa/Visualizer1929";
import Visualizer88 from "@/pages/dsa/Visualizer88";
import Settings from "@/pages/app/Settings";
import "@/App.css";

function Protected({ children }) {
  const { user } = useAuth();
  if (user === null) return <div className="min-h-screen grid place-items-center text-zinc-400">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route element={<Protected><AppShell /></Protected>}>
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/tasks" element={<Tasks />} />
        <Route path="/app/calendar" element={<CalendarPage />} />
        <Route path="/app/dsa" element={<DsaLab />} />
        <Route path="/app/guide" element={<QuestionsGuide />} />
        <Route path="/app/guide/1929" element={<Visualizer1929 />} />
        <Route path="/app/guide/88" element={<Visualizer88 />} />
        <Route path="/app/analytics" element={<Analytics />} />
        <Route path="/app/insights" element={<Insights />} />
        <Route path="/app/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="App">
      <HashRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="bottom-right" theme="dark" richColors />
        </AuthProvider>
      </HashRouter>
    </div>
  );
}
