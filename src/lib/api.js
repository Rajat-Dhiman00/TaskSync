import axios from "axios";

export const API = "http://localhost:8000/api";
export const api = axios.create({ baseURL: API });

// Ensure default user exists for offline mode so user session is never lost
const defaultUser = { id: "local-user", email: "demo@tasksync.app", full_name: "Demo User" };
if (!localStorage.getItem("tasksync_user")) {
  localStorage.setItem("tasksync_user", JSON.stringify(defaultUser));
  localStorage.setItem("tasksync_token", "offline-token-123");
}

const getStudentLifeTasks = () => {
  const now = Date.now();
  return [
    {
      id: "s-1",
      title: "CS301: Operating Systems & Kernel Threads Lecture",
      category: "class",
      priority: "high",
      completed: true,
      status: "completed",
      date: new Date(now - 86400000 * 3).toISOString(),
      due_date: new Date(now - 86400000 * 3).toISOString(),
      desc: "Review process synchronization, semaphores, & virtual memory.",
      description: "Review process synchronization, semaphores, & virtual memory.",
      subtasks: []
    },
    {
      id: "s-2",
      title: "Solve 3 DSA Graph Questions (LeetCode #210 Topological Sort)",
      category: "dsa",
      priority: "high",
      completed: true,
      status: "completed",
      date: new Date(now - 86400000 * 2).toISOString(),
      due_date: new Date(now - 86400000 * 2).toISOString(),
      desc: "Course Schedule II & Bipartite Graph BFS algorithm.",
      description: "Course Schedule II & Bipartite Graph BFS algorithm.",
      subtasks: []
    },
    {
      id: "s-3",
      title: "Weekly Organic Grocery Shopping & Healthy Food Prep",
      category: "food",
      priority: "medium",
      completed: false,
      status: "overdue",
      date: new Date(now - 86400000 * 1).toISOString(),
      due_date: new Date(now - 86400000 * 1).toISOString(),
      desc: "Buy oats, fruits, protein, veggies & brew fresh cold coffee.",
      description: "Buy oats, fruits, protein, veggies & brew fresh cold coffee.",
      subtasks: []
    },
    {
      id: "s-4",
      title: "Book Flight & Hotel Tickets for Hackathon Tech Fest",
      category: "travel",
      priority: "urgent",
      completed: false,
      status: "pending",
      date: new Date(now).toISOString(),
      due_date: new Date(now).toISOString(),
      desc: "Reserve accommodation & confirm travel pass.",
      description: "Reserve accommodation & confirm travel pass.",
      subtasks: []
    },
    {
      id: "s-5",
      title: "Dinner & Evening Hangout with Friends at Italian Bistro",
      category: "food",
      priority: "medium",
      completed: false,
      status: "pending",
      date: new Date(now + 86400000 * 1).toISOString(),
      due_date: new Date(now + 86400000 * 1).toISOString(),
      desc: "Catch up with college batchmates at 7:30 PM.",
      description: "Catch up with college batchmates at 7:30 PM.",
      subtasks: []
    },
    {
      id: "s-6",
      title: "System Design Class: Microservices & Redis Caching",
      category: "class",
      priority: "high",
      completed: false,
      status: "pending",
      date: new Date(now + 86400000 * 2).toISOString(),
      due_date: new Date(now + 86400000 * 2).toISOString(),
      desc: "Understand pub/sub queues, rate limiting & cache invalidation.",
      description: "Understand pub/sub queues, rate limiting & cache invalidation.",
      subtasks: []
    },
    {
      id: "s-7",
      title: "Solve 3 DSA Min-Heap & Priority Queue Problems",
      category: "dsa",
      priority: "high",
      completed: false,
      status: "pending",
      date: new Date(now + 86400000 * 3).toISOString(),
      due_date: new Date(now + 86400000 * 3).toISOString(),
      desc: "Kth largest element in array & median from data stream.",
      description: "Kth largest element in array & median from data stream.",
      subtasks: []
    },
    {
      id: "s-8",
      title: "Weekend Campus Trip & Bike Maintenance Check",
      category: "travel",
      priority: "medium",
      completed: false,
      status: "pending",
      date: new Date(now + 86400000 * 4).toISOString(),
      due_date: new Date(now + 86400000 * 4).toISOString(),
      desc: "Check tire pressure, oil levels, & pack weekend bag.",
      description: "Check tire pressure, oil levels, & pack weekend bag.",
      subtasks: []
    },
    {
      id: "s-9",
      title: "Pay Hostel Wi-Fi & Utility Bills",
      category: "finance",
      priority: "low",
      completed: false,
      status: "pending",
      date: new Date(now + 86400000 * 5).toISOString(),
      due_date: new Date(now + 86400000 * 5).toISOString(),
      desc: "Pay monthly high-speed internet & electricity bill online.",
      description: "Pay monthly high-speed internet & electricity bill online.",
      subtasks: []
    }
  ];
};

let storedRaw = localStorage.getItem("tasksync_tasks");
let mockTasks;

try {
  let parsed = storedRaw ? JSON.parse(storedRaw) : null;
  const hasOldTasks = parsed && parsed.some(t => t.title === "cloth" || (t.date && Math.abs(Date.now() - new Date(t.date).getTime()) > 30 * 86400000));
  if (!parsed || !Array.isArray(parsed) || parsed.length === 0 || hasOldTasks) {
    mockTasks = getStudentLifeTasks();
    localStorage.setItem("tasksync_tasks", JSON.stringify(mockTasks));
  } else {
    mockTasks = parsed;
  }
} catch {
  mockTasks = getStudentLifeTasks();
  localStorage.setItem("tasksync_tasks", JSON.stringify(mockTasks));
}

let mockUser = JSON.parse(localStorage.getItem("tasksync_user") || JSON.stringify(defaultUser));

const saveTasks = () => {
  localStorage.setItem("tasksync_tasks", JSON.stringify(mockTasks));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("tasks:refresh"));
  }
};
const saveUser = (u) => {
  mockUser = u;
  if (u) {
    localStorage.setItem("tasksync_user", JSON.stringify(u));
    localStorage.setItem("tasksync_token", "offline-token-123");
  } else {
    localStorage.removeItem("tasksync_user");
    localStorage.removeItem("tasksync_token");
  }
};

api.interceptors.request.use(async (config) => {
  const url = (config.url || "").replace(API, "").replace(/^\//, "");
  const method = (config.method || "GET").toUpperCase();
  const data = config.data ? (typeof config.data === "string" ? JSON.parse(config.data) : config.data) : {};

  // Quick simulated delay
  await new Promise((r) => setTimeout(r, 100));

  let responseData = null;
  let status = 200;

  try {
    if (url.startsWith("auth/register") || url.startsWith("auth/login")) {
      const user = {
        id: "local-user",
        email: data.email || "demo@tasksync.app",
        full_name: data.name || data.full_name || "Demo User"
      };
      saveUser(user);
      responseData = { token: "offline-token-123", access_token: "offline-token-123", user };
    } 
    else if (url.startsWith("auth/me")) {
      if (!mockUser) mockUser = defaultUser;
      responseData = { user: { ...mockUser } };
    }
    else if (url.startsWith("tasks")) {
      if (!mockUser) mockUser = defaultUser;
      
      if (method === "GET") {
        responseData = { tasks: mockTasks };
      } 
      else if (method === "POST") {
        if (url.includes("/duplicate")) {
          const parts = url.split("/");
          const id = parts[parts.length - 2];
          const orig = mockTasks.find(t => String(t._id || t.id) === String(id));
          const dup = {
            ...orig,
            _id: Date.now().toString(),
            id: Date.now().toString(),
            title: `${orig?.title || "Task"} (Copy)`,
            completed: false,
            created_at: new Date().toISOString()
          };
          mockTasks.unshift(dup);
          saveTasks();
          responseData = { task: dup };
        } else {
          const newTask = {
            _id: Date.now().toString(),
            id: Date.now().toString(),
            title: data.title || "New Task",
            completed: false,
            priority: data.priority || "medium",
            category: data.category || "work",
            due_date: data.due_date || new Date().toISOString(),
            created_at: new Date().toISOString(),
            ...data,
            user_id: mockUser.id
          };
          mockTasks.unshift(newTask);
          saveTasks();
          responseData = { task: newTask, ...newTask };
        }
      }
      else if (method === "PUT" || method === "PATCH") {
        const parts = url.split("/");
        const id = parts[parts.length - 1];
        const idx = mockTasks.findIndex(t => String(t._id || t.id) === String(id));
        if (idx !== -1) {
          mockTasks[idx] = { ...mockTasks[idx], ...data };
          saveTasks();
          responseData = { task: mockTasks[idx], ...mockTasks[idx] };
        } else {
          const updated = { _id: id, id, ...data };
          mockTasks.unshift(updated);
          saveTasks();
          responseData = { task: updated, ...updated };
        }
      }
      else if (method === "DELETE") {
        const parts = url.split("/");
        const id = parts[parts.length - 1];
        mockTasks = mockTasks.filter(t => String(t._id || t.id) !== String(id));
        saveTasks();
        responseData = { ok: true };
      }
    }
    else if (url.startsWith("ai/magic-add")) {
      const text = data.text || "New Task";
      const isUrgent = text.toLowerCase().includes("urgent") || text.toLowerCase().includes("asap");
      const isHigh = text.toLowerCase().includes("high") || text.toLowerCase().includes("important");
      const priority = isUrgent ? "urgent" : isHigh ? "high" : "medium";
      const category = text.toLowerCase().includes("dsa") || text.toLowerCase().includes("study") ? "study" :
                       text.toLowerCase().includes("health") || text.toLowerCase().includes("run") ? "health" : "work";
      
      const newTask = {
        _id: Date.now().toString(),
        id: Date.now().toString(),
        title: text.replace(/(urgent|high|priority|work|study)/gi, "").trim() || text,
        completed: false,
        priority,
        category,
        due_date: new Date(Date.now() + 86400000).toISOString(),
        created_at: new Date().toISOString(),
        user_id: mockUser.id
      };
      mockTasks.unshift(newTask);
      saveTasks();
      responseData = { task: newTask };
    }
    else if (url.startsWith("ai/breakdown")) {
      responseData = {
        subtasks: [
          { title: "Define scope & requirements", estimated_minutes: 15 },
          { title: "Execute core task implementation", estimated_minutes: 45 },
          { title: "Verify results & test outcome", estimated_minutes: 15 }
        ]
      };
    }
    else if (url.startsWith("ai/planner")) {
      const active = mockTasks.filter(t => !t.completed);
      responseData = {
        narrative: `Optimized 3-step schedule based on Min-Heap Priority Queue. You have ${active.length} active tasks.`,
        plan: active.slice(0, 4).map((t, i) => ({
          time_block: `${9 + i * 2}:00 - ${10 + i * 2}:30`,
          task_id: t.id,
          reason: `High priority item: ${t.title}`
        }))
      };
    }
    else if (url.startsWith("ai/daily-summary")) {
      responseData = {
        title: "Productive Focus Cycle Completed",
        summary: "Great job completing your tasks today! You achieved high velocity. Tomorrow's primary focus should be your pending high priority items."
      };
    }
    else if (url.startsWith("ai/prioritize")) {
      responseData = {
        recommendation: "Focus on these items first.",
        top: mockTasks.filter(t => !t.completed).slice(0, 3).map(t => ({ title: t.title || "Task", reason: "Pending active task" }))
      };
    }
    else {
      responseData = { ok: true };
    }

    config.adapter = async () => ({
      data: responseData,
      status,
      statusText: "OK",
      headers: {},
      config,
      request: {}
    });

  } catch (err) {
    config.adapter = async () => Promise.reject({
      response: {
        status: err.status || 500,
        data: err.data || { detail: "Server Error" }
      },
      config,
      request: {}
    });
  }

  return config;
});

export function apiError(e) {
  const d = e?.response?.data?.detail;
  if (!d) return e?.message || "Something went wrong";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x.msg || JSON.stringify(x)).join(" ");
  return String(d);
}
