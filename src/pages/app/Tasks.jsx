import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Clock, Calendar, Search, Plus,
  Edit2, Trash2, Check, CheckCircle2, Circle, FileText, Sparkles,
  Pin, Copy, Filter
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function getRelativeTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.round(diffMs / 86400000);
  if (Math.abs(diffDays) >= 30) {
    const months = Math.round(Math.abs(diffDays) / 30);
    return diffDays > 0 ? `(${months} month${months > 1 ? "s" : ""} ago)` : `(in ${months} month${months > 1 ? "s" : ""})`;
  }
  if (Math.abs(diffDays) >= 1) {
    return diffDays > 0 ? `(${diffDays} day${diffDays > 1 ? "s" : ""} ago)` : `(in ${diffDays} day${diffDays > 1 ? "s" : ""})`;
  }
  const diffHours = Math.round(diffMs / 3600000);
  if (Math.abs(diffHours) >= 1) {
    return diffHours > 0 ? `(${diffHours} hour${diffHours > 1 ? "s" : ""} ago)` : `(in ${diffHours} hour${diffHours > 1 ? "s" : ""})`;
  }
  return "(just now)";
}

const catLabels = {
  class: "Class & Study",
  study: "Class & Study",
  food: "Food & Dining",
  travel: "Travel & Commute",
  dsa: "DSA Practice",
  work: "Work & Projects",
  health: "Health & Gym",
  finance: "Bills & Finance",
  personal: "Home & Personal",
  other: "Other"
};

const priorityColor = {
  urgent: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | pending | overdue | completed
  const [catFilter, setCatFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority"); // priority | date | title
  const [editingTask, setEditingTask] = useState(null);
  const [openNewTask, setOpenNewTask] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data.tasks || []);
    } catch {
      const now = Date.now();
      setTasks([
        { id: "1", title: "Operating Systems Lecture & Notes", date: new Date(now - 86400000 * 3).toISOString(), due_date: new Date(now - 86400000 * 3).toISOString(), priority: "high", category: "class", desc: "Review memory management & process threads.", completed: true, status: "completed", subtasks: [] },
        { id: "2", title: "Solve DSA Graph Questions (LeetCode #210 & #785)", date: new Date(now - 86400000 * 2).toISOString(), due_date: new Date(now - 86400000 * 2).toISOString(), priority: "high", category: "dsa", desc: "Topological Sort & Bipartite Graph BFS.", completed: true, status: "completed", subtasks: [] },
        { id: "3", title: "Weekly Organic Grocery & Healthy Food Prep", date: new Date(now - 86400000 * 1).toISOString(), due_date: new Date(now - 86400000 * 1).toISOString(), priority: "medium", category: "food", desc: "Buy fruits, veggies, protein & meal prep for week.", completed: false, status: "overdue", subtasks: [] },
        { id: "4", title: "Flight & Hotel Booking for Tech Conference", date: new Date(now).toISOString(), due_date: new Date(now).toISOString(), priority: "urgent", category: "travel", desc: "Book flight tickets & reserve hotel room.", completed: false, status: "pending", subtasks: [] },
        { id: "5", title: "Dinner with College Friends at Bistro", date: new Date(now + 86400000 * 1).toISOString(), due_date: new Date(now + 86400000 * 1).toISOString(), priority: "medium", category: "food", desc: "Reserve table for 4 at 7:30 PM.", completed: false, status: "pending", subtasks: [] },
        { id: "6", title: "System Design Class & Architecture Review", date: new Date(now + 86400000 * 2).toISOString(), due_date: new Date(now + 86400000 * 2).toISOString(), priority: "high", category: "class", desc: "Study distributed caching & microservices.", completed: false, status: "pending", subtasks: [] },
        { id: "7", title: "Solve 3 Heap & Priority Queue DSA Problems", date: new Date(now + 86400000 * 3).toISOString(), due_date: new Date(now + 86400000 * 3).toISOString(), priority: "high", category: "dsa", desc: "Kth largest element & Min-Heap implementation.", completed: false, status: "pending", subtasks: [] },
        { id: "8", title: "Weekend Road Trip & Car Inspection", date: new Date(now + 86400000 * 4).toISOString(), due_date: new Date(now + 86400000 * 4).toISOString(), priority: "medium", category: "travel", desc: "Check tire pressure & pack luggage.", completed: false, status: "pending", subtasks: [] },
        { id: "9", title: "Pay Wi-Fi & Electricity Bills", date: new Date(now + 86400000 * 5).toISOString(), due_date: new Date(now + 86400000 * 5).toISOString(), priority: "low", category: "finance", desc: "Pay auto-debit bills online.", completed: false, status: "pending", subtasks: [] }
      ]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const handleRefresh = () => load();
    window.addEventListener("tasks:refresh", handleRefresh);
    return () => window.removeEventListener("tasks:refresh", handleRefresh);
  }, [load]);

  // Compute status for each task (completed, overdue, pending)
  const computedTasks = tasks.map((t) => {
    const isComp = t.completed || t.status === "completed";
    const d = t.due_date || t.date;
    const isOver = !isComp && d && new Date(d).getTime() < Date.now();
    const computedStatus = isComp ? "completed" : isOver ? "overdue" : "pending";
    return { ...t, computedStatus, isOverdue: isOver };
  });

  const toggleComplete = async (t) => {
    const nextCompleted = !t.completed;
    try {
      const { data } = await api.patch(`/tasks/${t.id}`, { completed: nextCompleted, status: nextCompleted ? "completed" : "pending" });
      setTasks((prev) => prev.map((x) => x.id === t.id ? (data.task || { ...x, completed: nextCompleted, status: nextCompleted ? "completed" : "pending" }) : x));
    } catch {
      setTasks((prev) => prev.map((x) => x.id === t.id ? { ...x, completed: nextCompleted, status: nextCompleted ? "completed" : "pending" } : x));
    }
    window.dispatchEvent(new Event("tasks:refresh"));
  };

  const deleteTask = async (id) => {
    try { await api.delete(`/tasks/${id}`); } catch {}
    setTasks((prev) => prev.filter((x) => x.id !== id));
    toast.success("Task deleted");
    window.dispatchEvent(new Event("tasks:refresh"));
  };

  const pinTask = async (t) => {
    try {
      const { data } = await api.patch(`/tasks/${t.id}`, { pinned: !t.pinned });
      setTasks((prev) => prev.map((x) => x.id === t.id ? (data.task || { ...x, pinned: !x.pinned }) : x));
    } catch {
      setTasks((prev) => prev.map((x) => x.id === t.id ? { ...x, pinned: !x.pinned } : x));
    }
    window.dispatchEvent(new Event("tasks:refresh"));
  };

  // Stat counts
  const pendingCount = computedTasks.filter((t) => t.computedStatus === "pending").length;
  const highPriorityCount = computedTasks.filter((t) => t.computedStatus !== "completed" && (t.priority === "high" || t.priority === "urgent")).length;
  const completedCount = computedTasks.filter((t) => t.computedStatus === "completed").length;
  const overdueCount = computedTasks.filter((t) => t.computedStatus === "overdue").length;

  // Urgent Banner Task
  const activeUncompleted = computedTasks.filter((t) => t.computedStatus !== "completed");
  const pMap = { urgent: 0, high: 1, medium: 2, low: 3 };
  const urgentBannerTask = [...activeUncompleted].sort((a, b) => {
    const d = (pMap[a.priority] ?? 2) - (pMap[b.priority] ?? 2);
    if (d !== 0) return d;
    return new Date(a.due_date || a.date).getTime() - new Date(b.due_date || b.date).getTime();
  })[0];

  // Filters & Sorting
  const filteredTasks = computedTasks.filter((t) => {
    if (statusFilter !== "all" && t.computedStatus !== statusFilter) return false;
    if (catFilter !== "all" && (t.category || "").toLowerCase() !== catFilter.toLowerCase()) return false;
    if (q && !t.title.toLowerCase().includes(q.toLowerCase()) && !(t.desc || t.description || "").toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const d = (pMap[a.priority] ?? 2) - (pMap[b.priority] ?? 2);
      if (d !== 0) return d;
      return new Date(a.due_date || a.date).getTime() - new Date(b.due_date || b.date).getTime();
    }
    if (sortBy === "date") {
      return new Date(a.due_date || a.date).getTime() - new Date(b.due_date || b.date).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="space-y-6 font-sans select-none" data-testid="tasks-page">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading theme-text">Events & Schedule Manager</h1>
          <p className="text-xs font-mono theme-text-muted mt-0.5">
            {computedTasks.length} total scheduled items · {activeUncompleted.length} active
          </p>
        </div>
        <Button
          onClick={() => setOpenNewTask(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold rounded-xl shadow-lg"
        >
          <Plus className="w-4 h-4 mr-1.5" /> New Event / Task
        </Button>
      </div>

      {/* URGENT BANNER */}
      {urgentBannerTask && (
        <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-r from-rose-500/15 via-rose-500/5 to-transparent p-4 flex items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 grid place-items-center text-rose-500 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold theme-text flex items-center gap-2">
                <span>{urgentBannerTask.title}</span>
                <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-500 px-1.5 py-0.5 rounded border border-rose-500/30 font-bold">
                  {urgentBannerTask.computedStatus === "overdue" ? "OVERDUE" : urgentBannerTask.priority}
                </span>
              </div>
              <div className="text-xs text-rose-500/90 font-mono mt-0.5">
                {urgentBannerTask.computedStatus === "overdue" ? "OVERDUE" : `Due ${getRelativeTime(urgentBannerTask.due_date || urgentBannerTask.date)}`}
              </div>
            </div>
          </div>
          <Button
            onClick={() => toggleComplete(urgentBannerTask)}
            size="sm"
            className="bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs shadow-md shrink-0 rounded-xl"
          >
            Mark Done ✓
          </Button>
        </div>
      )}

      {/* 4 STAT CARDS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border theme-border theme-card p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 grid place-items-center text-sky-500 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono theme-text">{pendingCount}</div>
            <div className="text-xs theme-text-muted font-medium">Pending</div>
          </div>
        </div>

        <div className="rounded-2xl border theme-border theme-card p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 grid place-items-center text-rose-500 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono theme-text">{highPriorityCount}</div>
            <div className="text-xs theme-text-muted font-medium">High Priority</div>
          </div>
        </div>

        <div className="rounded-2xl border theme-border theme-card p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 grid place-items-center text-emerald-500 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono theme-text">{completedCount}</div>
            <div className="text-xs theme-text-muted font-medium">Completed</div>
          </div>
        </div>

        <div className="rounded-2xl border theme-border theme-card p-4 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 grid place-items-center text-amber-500 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono theme-text">{overdueCount}</div>
            <div className="text-xs theme-text-muted font-medium">Overdue</div>
          </div>
        </div>
      </div>

      {/* TASK LIST CONTAINER */}
      <div className="rounded-2xl border theme-border theme-card p-5 space-y-4 shadow-sm">
        {/* Controls & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-lg theme-text">All Tasks</span>
            <span className="text-xs font-mono theme-text-muted bg-white/[0.06] px-2 py-0.5 rounded-full border theme-border">
              {sortedTasks.length} tasks
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 theme-text-muted" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search tasks…"
                className="pl-8 h-8 w-44 bg-white/[0.04] theme-border text-xs theme-text rounded-xl"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32 bg-white/[0.04] theme-border text-xs theme-text rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 w-32 bg-white/[0.04] theme-border text-xs theme-text rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">By Priority</SelectItem>
                <SelectItem value="date">By Due Date</SelectItem>
                <SelectItem value="title">By Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tasks Rows */}
        <div className="space-y-2 pt-2">
          <AnimatePresence>
            {sortedTasks.map((t) => {
              const isComp = t.computedStatus === "completed";
              const isOver = t.computedStatus === "overdue";

              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-3.5 rounded-xl border theme-border bg-white/[0.015] hover:bg-white/[0.04] transition-all gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => toggleComplete(t)}
                      className="mt-0.5 transition-transform active:scale-95 text-indigo-400"
                    >
                      {isComp ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 theme-border hover:border-indigo-500 transition-colors" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-bold text-sm ${isComp ? "line-through theme-text-muted" : "theme-text"}`}>
                          {t.title}
                        </span>

                        <Badge variant="outline" className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 ${priorityColor[t.priority] || priorityColor.medium}`}>
                          {t.priority}
                        </Badge>

                        {isComp && (
                          <Badge variant="outline" className="text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                            DONE
                          </Badge>
                        )}

                        {isOver && (
                          <Badge variant="outline" className="text-[10px] font-mono font-bold uppercase bg-rose-500/15 text-rose-400 border-rose-500/30">
                            OVERDUE
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs theme-text-muted font-mono flex-wrap">
                        {(t.due_date || t.date) && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(t.due_date || t.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                            {" "}
                            {getRelativeTime(t.due_date || t.date)}
                          </span>
                        )}

                        {t.category && (
                          <span>· {catLabels[t.category.toLowerCase()] || t.category}</span>
                        )}
                      </div>

                      {(t.desc || t.description) && (
                        <p className="text-xs theme-text-muted line-clamp-1 italic">
                          {t.desc || t.description}
                        </p>
                      )}

                      {/* Subtasks Progress */}
                      {t.subtasks && t.subtasks.length > 0 && (
                        <div className="text-[11px] font-mono theme-text-muted pt-1">
                          {t.subtasks.filter((s) => s.completed || s.done).length}/{t.subtasks.length} subtasks
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity self-end md:self-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingTask(t)}
                      className="h-8 w-8 theme-text-muted hover:text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteTask(t.id)}
                      className="h-8 w-8 text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {sortedTasks.length === 0 && (
            <div className="p-12 text-center text-xs theme-text-muted font-mono space-y-2">
              <div>No tasks found matching your filters.</div>
              <Button onClick={() => { setQ(""); setStatusFilter("all"); }} size="sm" variant="outline" className="theme-border text-xs">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* EDIT TASK DIALOG */}
      {editingTask && (
        <EditTaskModalDialog
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSaved={() => { setEditingTask(null); load(); }}
        />
      )}

      {/* NEW TASK DIALOG */}
      {openNewTask && (
        <EditTaskModalDialog
          onClose={() => setOpenNewTask(false)}
          onSaved={() => { setOpenNewTask(false); load(); }}
        />
      )}
    </div>
  );
}

/* Edit / Create Task Dialog */
function EditTaskModalDialog({ task, onClose, onSaved }) {
  const [title, setTitle] = useState(task?.title || "");
  const [desc, setDesc] = useState(task?.desc || task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [category, setCategory] = useState(task?.category || "work");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      if (task) {
        await api.patch(`/tasks/${task.id}`, { title, desc, description: desc, priority, category });
        toast.success("Task updated");
      } else {
        await api.post("/tasks", { title, desc, description: desc, priority, category, completed: false, status: "pending" });
        toast.success("Task created");
      }
      window.dispatchEvent(new Event("tasks:refresh"));
      onSaved();
    } catch {
      toast.error("Could not save task");
    }
    setSaving(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md font-mono text-xs theme-card theme-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="theme-text">
            {task ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div>
            <label className="block theme-text-muted mb-1 font-bold">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task name…"
              className="bg-white/[0.04] theme-border theme-text font-bold"
            />
          </div>

          <div>
            <label className="block theme-text-muted mb-1 font-bold">Notes</label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Task details…"
              rows={3}
              className="bg-white/[0.04] theme-border theme-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block theme-text-muted mb-1 font-bold">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="bg-white/[0.04] theme-border theme-text">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block theme-text-muted mb-1 font-bold">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/[0.04] theme-border theme-text capitalize">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Class & Study</SelectItem>
                  <SelectItem value="dsa">DSA Practice</SelectItem>
                  <SelectItem value="food">Food & Dining</SelectItem>
                  <SelectItem value="travel">Travel & Commute</SelectItem>
                  <SelectItem value="work">Work & Projects</SelectItem>
                  <SelectItem value="health">Health & Gym</SelectItem>
                  <SelectItem value="finance">Bills & Finance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="theme-text-muted font-mono text-xs">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white font-mono text-xs font-bold">
            {saving ? "Saving…" : "Save Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
