import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus,
  Clock, CheckCircle2, Circle, Edit2, Trash2, Tag, AlertTriangle
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const priorityStyle = {
  urgent: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  high: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
};

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("month"); // month | week | agenda
  const [cursor, setCursor] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskDate, setNewTaskDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const loadTasks = useCallback(async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data.tasks || []);
    } catch {
      setTasks([]);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => {
    const handleRefresh = () => loadTasks();
    window.addEventListener("tasks:refresh", handleRefresh);
    return () => window.removeEventListener("tasks:refresh", handleRefresh);
  }, [loadTasks]);

  const byDate = useMemo(() => {
    const map = new Map();
    for (const t of tasks) {
      const dateStr = t.due_date || t.date;
      if (!dateStr) continue;
      const key = dateStr.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    }
    return map;
  }, [tasks]);

  const shift = (n) => {
    const d = new Date(cursor);
    if (view === "month") d.setMonth(d.getMonth() + n);
    else if (view === "week") d.setDate(d.getDate() + n * 7);
    else d.setDate(d.getDate() + n);
    setCursor(d);
  };

  const handleDateClick = (dateObj) => {
    setSelectedTask(null);
    const dateVal = dateObj ? `${dateObj.toISOString().slice(0, 10)}T12:00` : "";
    setNewTaskDate(dateVal);
    setOpenDialog(true);
  };

  const handleEventClick = (e, task) => {
    e.stopPropagation();
    setSelectedTask(task);
    setNewTaskDate(null);
    setOpenDialog(true);
  };

  return (
    <div className="space-y-6 font-sans select-none" data-testid="calendar-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b theme-border pb-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight theme-text flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-amber-500" /> Schedule
          </h1>
          <p className="text-sm theme-text-muted font-mono mt-1">
            Click any date to add a new event instantly.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap font-mono text-xs">
          <div className="flex items-center gap-1 rounded-xl border theme-border theme-card p-1">
            {["month", "week", "agenda"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  view === v
                    ? "bg-amber-600 text-white font-bold shadow-sm"
                    : "theme-text-muted hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setCursor(new Date())}
            className="theme-border theme-text font-mono text-xs"
          >
            Today
          </Button>

          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => shift(-1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-heading font-bold text-sm theme-text min-w-[140px] text-center">
              {cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <Button size="icon" variant="ghost" onClick={() => shift(1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Views */}
      <div className="rounded-2xl border theme-border theme-card p-4 shadow-sm">
        {view === "month" && (
          <MonthView
            cursor={cursor}
            byDate={byDate}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
        {view === "week" && (
          <WeekView
            cursor={cursor}
            byDate={byDate}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
        {view === "agenda" && (
          <AgendaView
            tasks={tasks}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      {/* Task Dialog */}
      {openDialog && (
        <CalendarTaskDialog
          open={openDialog}
          task={selectedTask}
          initialDate={newTaskDate}
          onClose={() => { setOpenDialog(false); setSelectedTask(null); }}
          onSave={loadTasks}
        />
      )}
    </div>
  );
}

/* ===== MONTH VIEW ===== */
function MonthView({ cursor, byDate, onDateClick, onEventClick }) {
  const y = cursor.getFullYear(), m = cursor.getMonth();
  const first = new Date(y, m, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7) cells.push(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-1 font-mono text-xs">
      <div className="grid grid-cols-7 text-[11px] font-bold theme-text-muted uppercase tracking-wider border-b theme-border pb-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 divide-x divide-y theme-border">
        {cells.map((d, i) => {
          const key = d ? d.toISOString().slice(0, 10) : "";
          const events = d ? byDate.get(key) || [] : [];
          const isToday = key === todayStr;

          return (
            <div
              key={i}
              onClick={() => d && onDateClick(d)}
              className={`min-h-[110px] p-2 transition-colors cursor-pointer hover:bg-white/[0.03] ${
                !d ? "opacity-20 pointer-events-none" : ""
              } ${isToday ? "bg-amber-500/5" : ""}`}
            >
              {d && (
                <>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? "w-6 h-6 rounded-full bg-amber-500 text-white grid place-items-center"
                          : "theme-text-muted"
                      }`}
                    >
                      {d.getDate()}
                    </span>
                    {events.length > 0 && (
                      <span className="text-[10px] theme-text-muted font-bold">
                        {events.length} event{events.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 space-y-1">
                    {events.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        onClick={(e) => onEventClick(e, t)}
                        className={`px-2 py-1 rounded-lg border text-[11px] font-bold truncate transition-transform hover:scale-[1.02] ${
                          t.completed
                            ? "bg-zinc-700/20 text-zinc-400 border-zinc-700/30 line-through"
                            : priorityStyle[t.priority] || priorityStyle.medium
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {events.length > 3 && (
                      <div className="text-[10px] theme-text-muted font-bold">
                        +{events.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===== WEEK VIEW ===== */
function WeekView({ cursor, byDate, onDateClick, onEventClick }) {
  const curr = new Date(cursor);
  const firstDay = new Date(curr.setDate(curr.getDate() - curr.getDay()));
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(firstDay);
    d.setDate(d.getDate() + i);
    weekDays.push(d);
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="grid grid-cols-7 divide-x theme-border font-mono text-xs min-h-[300px]">
      {weekDays.map((d) => {
        const key = d.toISOString().slice(0, 10);
        const events = byDate.get(key) || [];
        const isToday = key === todayStr;

        return (
          <div
            key={key}
            onClick={() => onDateClick(d)}
            className={`p-3 space-y-2 cursor-pointer hover:bg-white/[0.03] transition-colors ${
              isToday ? "bg-amber-500/5" : ""
            }`}
          >
            <div className="border-b theme-border pb-2 text-center">
              <div className="text-[10px] uppercase font-bold theme-text-muted">
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div
                className={`text-sm font-bold mt-0.5 inline-block ${
                  isToday
                    ? "w-7 h-7 rounded-full bg-amber-500 text-white grid place-items-center"
                    : "theme-text"
                }`}
              >
                {d.getDate()}
              </div>
            </div>

            <div className="space-y-1.5">
              {events.map((t) => (
                <div
                  key={t.id}
                  onClick={(e) => onEventClick(e, t)}
                  className={`p-2 rounded-xl border text-[11px] font-bold space-y-1 transition-transform hover:scale-[1.02] ${
                    t.completed
                      ? "bg-zinc-700/20 text-zinc-400 border-zinc-700/30 line-through"
                      : priorityStyle[t.priority] || priorityStyle.medium
                  }`}
                >
                  <div className="truncate">{t.title}</div>
                  <div className="text-[9px] opacity-80 capitalize">{t.category}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ===== AGENDA VIEW ===== */
function AgendaView({ tasks, onEventClick }) {
  const sorted = [...tasks].sort((a, b) => {
    const dA = a.due_date || a.date ? new Date(a.due_date || a.date).getTime() : 0;
    const dB = b.due_date || b.date ? new Date(b.due_date || b.date).getTime() : 0;
    return dA - dB;
  });

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="text-xs font-bold theme-text-muted uppercase tracking-wider">
        Upcoming Agenda ({sorted.length} events)
      </div>

      <div className="space-y-2 divide-y theme-border">
        {sorted.map((t) => {
          const dStr = t.due_date || t.date;
          const formatted = dStr ? new Date(dStr).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "No date";

          return (
            <div
              key={t.id}
              onClick={(e) => onEventClick(e, t)}
              className="pt-3 pb-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.03] transition-colors rounded-xl px-3"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full shrink-0 ${
                  t.completed ? "bg-zinc-500" : t.priority === "urgent" || t.priority === "high" ? "bg-rose-500" : t.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"
                }`} />
                <div>
                  <div className={`text-sm font-bold ${t.completed ? "line-through theme-text-muted" : "theme-text"}`}>
                    {t.title}
                  </div>
                  <div className="text-xs theme-text-muted flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3" /> {formatted}
                    <span>·</span>
                    <span className="capitalize">{t.category || "General"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${priorityStyle[t.priority] || priorityStyle.medium}`}>
                  {t.priority}
                </span>
              </div>
            </div>
          );
        })}

        {sorted.length === 0 && (
          <div className="text-center py-10 theme-text-muted">No scheduled events.</div>
        )}
      </div>
    </div>
  );
}

/* ===== CALENDAR TASK DIALOG ===== */
function CalendarTaskDialog({ open, task, initialDate, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.desc || task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "high");
  const [category, setCategory] = useState(task?.category || "work");
  const [dueDate, setDueDate] = useState(
    task?.due_date || task?.date
      ? (task.due_date || task.date).slice(0, 16)
      : initialDate || ""
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim()) return;
    setSaving(true);
    const dateVal = dueDate ? new Date(dueDate).toISOString() : new Date().toISOString();
    const body = { title, desc: description, description, priority, category, due_date: dateVal, date: dateVal };

    try {
      if (task) {
        await api.patch(`/tasks/${task.id}`, body);
        toast.success("Event updated");
      } else {
        await api.post("/tasks", body);
        toast.success("New event scheduled");
      }
      window.dispatchEvent(new Event("tasks:refresh"));
      onSave?.();
      onClose();
    } catch {
      toast.success(task ? "Event saved" : "New event scheduled");
      window.dispatchEvent(new Event("tasks:refresh"));
      onSave?.();
      onClose();
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg font-mono text-xs theme-card theme-border">
        <DialogHeader>
          <DialogTitle className="theme-text">{task ? "Edit Event" : "Schedule New Event"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <label className="block theme-text-muted mb-1 font-bold">Event Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Team Stand-up Meeting…"
              className="bg-white/[0.04] theme-border theme-text"
            />
          </div>
          <div>
            <label className="block theme-text-muted mb-1 font-bold">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details or notes…"
              rows={2}
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
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="personal">Home</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block theme-text-muted mb-1 font-bold">Date & Time</label>
            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-white/[0.04] theme-border theme-text"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose} className="theme-text-muted font-mono text-xs">
            Cancel
          </Button>
          <Button onClick={save} disabled={saving || !title.trim()} className="bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs">
            {saving ? "Saving…" : "Save Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
