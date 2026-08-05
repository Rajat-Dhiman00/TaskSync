import React, { useState, useEffect, useRef } from "react";
import {
  Cpu, Play, Pause, RotateCcw, Plus, Trash2,
  Search, Sparkles, Layers, Binary, GitFork,
  Network, Braces, ArrowRight, HelpCircle,
  Activity, CheckCircle2, Sliders, Maximize2,
  Terminal, Code2, SkipForward, SkipBack,
  Star, ListChecks
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DsaLab() {
  const [activeCategory, setActiveCategory] = useState("arrays");

  const categories = [
    { id: "arrays",      label: "Arrays & Sorting",    icon: Activity,    desc: "Sorting & Searching Algorithms" },
    { id: "terminal",    label: "Custom Code Terminal",icon: Terminal,    desc: "Run & Animate Custom Code" },
    { id: "stacks",      label: "Stacks (LIFO)",        icon: Layers,      desc: "Last-In, First-Out Operations" },
    { id: "queues",      label: "Queues (FIFO)",        icon: Braces,      desc: "First-In, First-Out Pipelines" },
    { id: "trees",       label: "Trees & Heaps",        icon: GitFork,     desc: "BST & Heap Operations" },
    { id: "graphs",      label: "Graph Algorithms",     icon: Network,     desc: "BFS, DFS, Dijkstra, Prim, Kruskal" },
    { id: "linkedlists", label: "Linked Lists",         icon: ArrowRight,  desc: "Node-based Pointer Manipulations" },
    { id: "hashing",     label: "Hash Tables",          icon: Binary,      desc: "Collision Handling & Chaining" }
  ];

  return (
    <div className="space-y-6 font-sans text-white pb-12" data-testid="dsa-lab-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500/30 to-violet-500/20 border border-indigo-500/30 text-indigo-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                DSA Algorithm Lab
                <span className="text-xs font-mono font-normal bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                  Interactive Visualizer
                </span>
              </h1>
              <p className="text-sm text-zinc-500 font-mono mt-0.5">
                Explore real-time data structures, step-by-step algorithms, Big-O complexities, and performance metrics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {categories.map(({ id, label, icon: Icon, desc }) => (
          <button
            key={id}
            onClick={() => setActiveCategory(id)}
            className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-200 group ${
              activeCategory === id
                ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/10"
                : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
            }`}
          >
            {activeCategory === id && (
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400" />
            )}
            <Icon className="w-4 h-4" />
            <span className="text-[10px] font-mono leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* Visualizer */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-5 min-h-[400px]">
        {activeCategory === "arrays"      && <ArraySortingVisualizer />}
        {activeCategory === "terminal"    && <CustomCodeTerminalVisualizer />}
        {activeCategory === "stacks"      && <StackVisualizer />}
        {activeCategory === "queues"      && <QueueVisualizer />}
        {activeCategory === "trees"       && <BSTVisualizer />}
        {activeCategory === "graphs"      && <GraphVisualizer />}
        {activeCategory === "linkedlists" && <LinkedListVisualizer />}
        {activeCategory === "hashing"     && <HashTableVisualizer />}
      </div>

      {/* AlgoBot */}
      <AlgoBotCard activeCategory={activeCategory} />
    </div>
  );
}

/* =========================================================================
   1. ARRAY SORTING VISUALIZER
   ========================================================================= */
function ArraySortingVisualizer() {
  const genArr = (n = 16) => Array.from({ length: n }, () => Math.floor(Math.random() * 85) + 15);
  const [arr, setArr] = useState(genArr());
  const [highlighted, setHighlighted] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sortAlg, setSortAlg] = useState("bubble");
  const [speed, setSpeed] = useState(120); // Delay ms
  const [activeLine, setActiveLine] = useState(null);
  const [logMsg, setLogMsg] = useState("Ready to animate algorithm steps.");
  const [searchVal, setSearchVal] = useState("");
  const [searchIdx, setSearchIdx] = useState(null);
  const stopRef = useRef(false);
  const pauseRef = useRef(false);

  useEffect(() => { pauseRef.current = paused; }, [paused]);

  const sleep = async (ms) => {
    let elapsed = 0;
    while (elapsed < ms && !stopRef.current) {
      if (pauseRef.current) {
        await new Promise((r) => setTimeout(r, 100));
      } else {
        await new Promise((r) => setTimeout(r, 20));
        elapsed += 20;
      }
    }
  };

  const reset = () => {
    stopRef.current = true;
    setPaused(false);
    setArr(genArr());
    setHighlighted([]);
    setSorted([]);
    setSorting(false);
    setActiveLine(null);
    setSearchIdx(null);
    setLogMsg("Reset array.");
  };

  const codeSnippets = {
    bubble: [
      { line: 0, text: "for i = 0 to n - 1:" },
      { line: 1, text: "  for j = 0 to n - i - 2:" },
      { line: 2, text: "    if arr[j] > arr[j + 1]:" },
      { line: 3, text: "      swap(arr[j], arr[j + 1])" }
    ],
    selection: [
      { line: 0, text: "for i = 0 to n - 1:" },
      { line: 1, text: "  min = i" },
      { line: 2, text: "  for j = i + 1 to n - 1:" },
      { line: 3, text: "    if arr[j] < arr[min]: min = j" },
      { line: 4, text: "  swap(arr[i], arr[min])" }
    ],
    insertion: [
      { line: 0, text: "for i = 1 to n - 1:" },
      { line: 1, text: "  key = arr[i], j = i - 1" },
      { line: 2, text: "  while j >= 0 and arr[j] > key:" },
      { line: 3, text: "    arr[j + 1] = arr[j]; j--" },
      { line: 4, text: "  arr[j + 1] = key" }
    ],
    quick: [
      { line: 0, text: "quickSort(arr, low, high):" },
      { line: 1, text: "  pivot = arr[high]" },
      { line: 2, text: "  for j = low to high - 1:" },
      { line: 3, text: "    if arr[j] < pivot: swap(i, j)" },
      { line: 4, text: "  swap(i + 1, high)" }
    ]
  };

  const bubbleSort = async (a) => {
    const ar = [...a];
    for (let i = 0; i < ar.length && !stopRef.current; i++) {
      setActiveLine(0);
      for (let j = 0; j < ar.length - i - 1 && !stopRef.current; j++) {
        setActiveLine(1);
        setHighlighted([j, j + 1]);
        setLogMsg(`Comparing arr[${j}] (${ar[j]}) with arr[${j + 1}] (${ar[j + 1]})`);
        await sleep(speed);

        setActiveLine(2);
        if (ar[j] > ar[j + 1]) {
          setActiveLine(3);
          setLogMsg(`Swapping arr[${j}] (${ar[j]}) > arr[${j + 1}] (${ar[j + 1]})`);
          [ar[j], ar[j + 1]] = [ar[j + 1], ar[j]];
          setArr([...ar]);
          await sleep(speed);
        }
      }
      setSorted((p) => [...p, ar.length - i - 1]);
    }
  };

  const selectionSort = async (a) => {
    const ar = [...a];
    for (let i = 0; i < ar.length && !stopRef.current; i++) {
      setActiveLine(0);
      let min = i;
      setActiveLine(1);
      for (let j = i + 1; j < ar.length && !stopRef.current; j++) {
        setActiveLine(2);
        setHighlighted([min, j]);
        setLogMsg(`Finding minimum: checking arr[${j}] (${ar[j]}) vs min arr[${min}] (${ar[min]})`);
        await sleep(speed);
        if (ar[j] < ar[min]) {
          setActiveLine(3);
          min = j;
          setLogMsg(`New min found at index ${min} (${ar[min]})`);
        }
      }
      if (min !== i) {
        setActiveLine(4);
        setLogMsg(`Swapping min arr[${min}] (${ar[min]}) into index ${i}`);
        [ar[i], ar[min]] = [ar[min], ar[i]];
        setArr([...ar]);
        await sleep(speed);
      }
      setSorted((p) => [...p, i]);
    }
  };

  const insertionSort = async (a) => {
    const ar = [...a];
    for (let i = 1; i < ar.length && !stopRef.current; i++) {
      setActiveLine(0);
      const key = ar[i];
      let j = i - 1;
      setActiveLine(1);
      setHighlighted([i]);
      setLogMsg(`Inserting key arr[${i}] (${key}) into sorted prefix`);
      await sleep(speed);

      while (j >= 0 && ar[j] > key && !stopRef.current) {
        setActiveLine(2);
        setActiveLine(3);
        setLogMsg(`Shifting arr[${j}] (${ar[j]}) right`);
        ar[j + 1] = ar[j];
        j--;
        setArr([...ar]);
        setHighlighted([j + 1]);
        await sleep(speed);
      }
      setActiveLine(4);
      ar[j + 1] = key;
      setArr([...ar]);
      setSorted((p) => [...p, i]);
      await sleep(speed);
    }
  };

  const quickSort = async (ar, lo, hi) => {
    if (lo >= hi || stopRef.current) return;
    setActiveLine(0);
    const pivot = ar[hi];
    let i = lo - 1;
    setActiveLine(1);
    setLogMsg(`Partitioning subarray [${lo}..${hi}] with pivot = ${pivot}`);

    for (let j = lo; j < hi && !stopRef.current; j++) {
      setActiveLine(2);
      setHighlighted([j, hi]);
      setLogMsg(`Comparing arr[${j}] (${ar[j]}) with pivot (${pivot})`);
      await sleep(speed);

      if (ar[j] <= pivot) {
        setActiveLine(3);
        i++;
        setLogMsg(`Swapping arr[${i}] (${ar[i]}) and arr[${j}] (${ar[j]})`);
        [ar[i], ar[j]] = [ar[j], ar[i]];
        setArr([...ar]);
      }
    }
    setActiveLine(4);
    [ar[i + 1], ar[hi]] = [ar[hi], ar[i + 1]];
    setArr([...ar]);
    setSorted((p) => [...p, i + 1]);
    await sleep(speed);

    await quickSort(ar, lo, i);
    await quickSort(ar, i + 2, hi);
  };

  const runSort = async () => {
    stopRef.current = false;
    setPaused(false);
    setSorting(true);
    setHighlighted([]);
    setSorted([]);
    setLogMsg(`Starting ${sortAlg.toUpperCase()} Sort animation…`);

    const a = [...arr];
    if (sortAlg === "bubble") await bubbleSort(a);
    else if (sortAlg === "selection") await selectionSort(a);
    else if (sortAlg === "insertion") await insertionSort(a);
    else if (sortAlg === "quick") await quickSort(a, 0, a.length - 1);

    if (!stopRef.current) {
      setHighlighted([]);
      setSorted(arr.map((_, i) => i));
      setActiveLine(null);
      setLogMsg("Animation Complete! Array fully sorted.");
      toast.success("Algorithm Complete!");
    }
    setSorting(false);
  };

  const binarySearch = () => {
    const v = parseInt(searchVal);
    if (isNaN(v)) return;
    const sortedArr = [...arr].sort((a, b) => a - b);
    setArr(sortedArr);
    setSorted(sortedArr.map((_, i) => i));
    let lo = 0, hi = sortedArr.length - 1, found = -1;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (sortedArr[mid] === v) { found = mid; break; }
      else if (sortedArr[mid] < v) lo = mid + 1;
      else hi = mid - 1;
    }
    setSearchIdx(found);
    setLogMsg(found >= 0 ? `Binary Search: Found value ${v} at index ${found}` : `Binary Search: Value ${v} not found`);
    toast[found >= 0 ? "success" : "error"](found >= 0 ? `Found ${v} at index ${found}` : `${v} not found`);
  };

  const maxVal = Math.max(...arr, 1);
  const currentSnippet = codeSnippets[sortAlg] || codeSnippets.bubble;

  return (
    <div className="space-y-5 font-mono text-xs select-none">
      {/* Animation Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 theme-card p-3 rounded-2xl border theme-border">
        <div className="flex items-center gap-2">
          <select
            value={sortAlg}
            onChange={(e) => { setSortAlg(e.target.value); reset(); }}
            className="bg-white/[0.04] theme-border theme-text rounded-xl px-3 py-1.5 text-xs font-bold"
          >
            <option value="bubble" className="bg-[#1a1d27] text-white">Bubble Sort</option>
            <option value="selection" className="bg-[#1a1d27] text-white">Selection Sort</option>
            <option value="insertion" className="bg-[#1a1d27] text-white">Insertion Sort</option>
            <option value="quick" className="bg-[#1a1d27] text-white">Quick Sort</option>
          </select>

          <Button onClick={runSort} disabled={sorting} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs">
            <Play className="w-3.5 h-3.5 mr-1" /> {sorting ? "Running" : "Start Animator"}
          </Button>

          {sorting && (
            <Button
              onClick={() => setPaused(!paused)}
              size="sm"
              variant="outline"
              className="theme-border theme-text font-mono text-xs"
            >
              {paused ? <Play className="w-3.5 h-3.5 mr-1" /> : <Pause className="w-3.5 h-3.5 mr-1" />}
              {paused ? "Resume" : "Pause"}
            </Button>
          )}

          <Button onClick={reset} size="sm" variant="outline" className="theme-border theme-text font-mono text-xs">
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2">
          <span className="theme-text-muted text-[11px]">Speed:</span>
          <input
            type="range"
            min="30"
            max="350"
            step="10"
            value={380 - speed}
            onChange={(e) => setSpeed(380 - Number(e.target.value))}
            className="w-24 accent-amber-500 cursor-pointer"
          />
          <span className="theme-text text-[11px] font-bold w-12">{Math.round(4000 / speed) / 10}x</span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Search val…"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-28 bg-white/[0.04] theme-border rounded-xl px-3 py-1.5 text-xs theme-text"
          />
          <Button onClick={binarySearch} size="sm" variant="outline" className="theme-border theme-text text-xs">
            <Search className="w-3.5 h-3.5 mr-1" /> Search
          </Button>
        </div>
      </div>

      {/* Main Animator Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bars Canvas Visualizer (2 cols) */}
        <div className="lg:col-span-2 theme-card rounded-2xl border theme-border p-4 flex flex-col justify-between min-h-[280px]">
          <div className="flex items-center justify-between text-[11px] theme-text-muted mb-2 border-b theme-border pb-2">
            <span className="font-bold theme-text uppercase">Array Animator Stage</span>
            <span>Elements: {arr.length}</span>
          </div>

          <div className="h-56 flex items-end gap-1 px-2 pb-2 overflow-hidden">
            {arr.map((v, i) => {
              const isHL = highlighted.includes(i);
              const isSorted = sorted.includes(i);
              const isFound = searchIdx === i;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className="w-full rounded-t-lg transition-all duration-200"
                    style={{
                      height: `${(v / maxVal) * 170}px`,
                      backgroundColor: isFound ? "#f59e0b" : isHL ? "#ff5f6d" : isSorted ? "#2dd4a0" : "#4f8ef7",
                      boxShadow: isHL ? "0 0 12px rgba(255, 95, 109, 0.6)" : isSorted ? "0 0 10px rgba(45, 212, 160, 0.4)" : "none"
                    }}
                  />
                  <span className={`text-[10px] font-bold ${isHL ? "text-rose-400" : isSorted ? "text-emerald-400" : "theme-text-muted"}`}>
                    {v}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Code Execution Highlight Box & Live Log (1 col) */}
        <div className="space-y-4">
          {/* Pseudocode Tracker */}
          <div className="theme-card rounded-2xl border theme-border p-4 space-y-2">
            <div className="text-[11px] font-bold theme-text uppercase tracking-wider border-b theme-border pb-2">
              Code Tracker ({sortAlg.toUpperCase()})
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              {currentSnippet.map((s, idx) => (
                <div
                  key={idx}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    activeLine === s.line
                      ? "bg-amber-500/20 text-amber-300 font-bold border-l-2 border-amber-500 pl-3"
                      : "theme-text-muted"
                  }`}
                >
                  {s.text}
                </div>
              ))}
            </div>
          </div>

          {/* Operations Log */}
          <div className="theme-card rounded-2xl border theme-border p-4 space-y-1">
            <div className="text-[11px] font-bold theme-text uppercase tracking-wider border-b theme-border pb-2">
              Step Explanation
            </div>
            <div className="text-xs theme-text font-bold py-1 leading-relaxed">
              {logMsg}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. STACK VISUALIZER
   ========================================================================= */
function StackVisualizer() {
  const [stack, setStack] = useState([30, 50, 70]);
  const [inputVal, setInputVal] = useState("");
  const [lastOp, setLastOp] = useState("");

  const push = () => {
    const v = inputVal.trim() || Math.floor(Math.random() * 90) + 10;
    setStack((p) => [...p, Number(v)]);
    setLastOp(`PUSH ${v} → Top`);
    setInputVal("");
    toast.success(`Pushed ${v}`);
  };
  const pop = () => {
    if (!stack.length) { toast.error("Stack underflow!"); return; }
    const top = stack[stack.length - 1];
    setStack((p) => p.slice(0, -1));
    setLastOp(`POP → removed ${top}`);
    toast.info(`Popped ${top}`);
  };
  const peek = () => {
    if (!stack.length) { toast.error("Empty stack!"); return; }
    setLastOp(`PEEK → ${stack[stack.length - 1]}`);
    toast.info(`Top = ${stack[stack.length - 1]}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
        <input type="text" placeholder="Value" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
          className="w-24 bg-black/50 border border-white/10 text-xs rounded-lg px-3 py-1.5 font-mono text-white" />
        <Button onClick={push} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs font-mono"><Plus className="w-3.5 h-3.5 mr-1" />Push</Button>
        <Button onClick={pop} size="sm" variant="outline" className="text-xs font-mono text-rose-400">Pop</Button>
        <Button onClick={peek} size="sm" variant="outline" className="text-xs font-mono text-amber-400">Peek</Button>
        {lastOp && <span className="font-mono text-xs text-zinc-400 ml-auto">{lastOp}</span>}
      </div>
      <div className="flex gap-8 items-start">
        <div className="flex flex-col-reverse gap-1.5 min-w-[160px]">
          {stack.length === 0 && <div className="text-zinc-600 font-mono text-xs text-center py-4">Empty stack</div>}
          {stack.map((v, i) => (
            <div key={i} className={`flex items-center justify-between px-4 py-2.5 rounded-lg border font-mono text-sm font-bold transition-all duration-300 ${
              i === stack.length - 1 ? "bg-indigo-600/30 border-indigo-400 text-indigo-200 shadow-lg shadow-indigo-500/20" : "bg-white/[0.03] border-white/10 text-zinc-300"
            }`}>
              <span>{v}</span>
              {i === stack.length - 1 && <span className="text-[10px] text-indigo-400 font-mono">← TOP</span>}
            </div>
          ))}
          <div className="h-1 bg-white/10 rounded-full" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="font-mono text-xs text-zinc-400 space-y-1.5">
            {[["push(x)", "Add x to top — O(1)"],["pop()", "Remove top — O(1)"],["peek()", "Read top — O(1)"],["isEmpty()", "Check empty — O(1)"]].map(([op, desc]) => (
              <div key={op} className="flex gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                <code className="text-indigo-300 w-20 shrink-0">{op}</code><span>{desc}</span>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 font-mono text-xs text-zinc-500">
            LIFO principle — Last In, First Out. Used in: undo/redo, call stack, expression parsing.
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. QUEUE VISUALIZER
   ========================================================================= */
function QueueVisualizer() {
  const [queue, setQueue] = useState([10, 25, 40]);
  const [inputVal, setInputVal] = useState("");
  const [lastOp, setLastOp] = useState("");

  const enqueue = () => {
    const v = inputVal.trim() || Math.floor(Math.random() * 90) + 10;
    setQueue((p) => [...p, Number(v)]);
    setLastOp(`ENQUEUE ${v} → Rear`);
    setInputVal(""); toast.success(`Enqueued ${v}`);
  };
  const dequeue = () => {
    if (!queue.length) { toast.error("Queue underflow!"); return; }
    const front = queue[0];
    setQueue((p) => p.slice(1));
    setLastOp(`DEQUEUE → removed ${front} (front)`);
    toast.info(`Dequeued ${front}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
        <input type="text" placeholder="Value" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
          className="w-24 bg-black/50 border border-white/10 text-xs rounded-lg px-3 py-1.5 font-mono text-white" />
        <Button onClick={enqueue} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs font-mono"><Plus className="w-3.5 h-3.5 mr-1" />Enqueue</Button>
        <Button onClick={dequeue} size="sm" variant="outline" className="text-xs font-mono text-rose-400">Dequeue</Button>
        {lastOp && <span className="font-mono text-xs text-zinc-400 ml-auto">{lastOp}</span>}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap min-h-[80px] bg-black/30 rounded-xl border border-white/5 p-4">
        <div className="font-mono text-[10px] text-zinc-600 mr-2">FRONT →</div>
        {queue.length === 0 && <div className="text-zinc-600 font-mono text-xs">Empty queue</div>}
        {queue.map((v, i) => (
          <div key={i} className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-lg border font-mono text-sm font-bold transition-all ${
            i === 0 ? "bg-emerald-600/20 border-emerald-400/50 text-emerald-300" :
            i === queue.length - 1 ? "bg-indigo-600/20 border-indigo-400/50 text-indigo-300" :
            "bg-white/[0.03] border-white/10 text-zinc-300"
          }`}>
            <span>{v}</span>
            <span className="text-[9px]">{i === 0 ? "front" : i === queue.length - 1 ? "rear" : i}</span>
          </div>
        ))}
        <div className="font-mono text-[10px] text-zinc-600 ml-2">← REAR</div>
      </div>
      <div className="font-mono text-xs text-zinc-500 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
        FIFO principle — First In, First Out. Used in: job scheduling, BFS, print queues, OS process management.
      </div>
    </div>
  );
}

/* =========================================================================
   4. BST VISUALIZER
   ========================================================================= */
function BSTVisualizer() {
  const newNode = (val) => ({ val, left: null, right: null });
  const insertBST = (node, val) => {
    if (!node) return newNode(val);
    if (val < node.val) node.left = insertBST(node.left, val);
    else if (val > node.val) node.right = insertBST(node.right, val);
    return node;
  };
  const deleteNodeBST = (node, val) => {
    if (!node) return null;
    if (val < node.val) { node.left = deleteNodeBST(node.left, val); return node; }
    if (val > node.val) { node.right = deleteNodeBST(node.right, val); return node; }
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    let min = node.right;
    while (min.left) min = min.left;
    node.val = min.val; node.right = deleteNodeBST(node.right, min.val); return node;
  };

  const buildInitBST = () => {
    let t = null;
    for (const v of [50, 30, 70, 20, 40, 60, 80]) t = insertBST(t, v);
    return t;
  };

  const [treeMode, setTreeMode] = useState("bst");
  const [tree, setTree] = useState(buildInitBST);
  const [heap, setHeap] = useState([10, 20, 15, 40, 50, 100, 25]);
  
  const [inputVal, setInputVal] = useState("");
  const [highlighted, setHighlighted] = useState([]);
  const [activeNode, setActiveNode] = useState(null);
  const [traversalType, setTraversalType] = useState("");
  const [visitedSeq, setVisitedSeq] = useState([]);
  const [traversalStepMsg, setTraversalStepMsg] = useState("");

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);
  const resetView = () => { setPan({ x: 0, y: 0 }); setZoom(1); };

  const doInsert = async () => {
    const v = parseInt(inputVal);
    if (!v) return;
    setInputVal("");
    
    if (treeMode === "bst") {
      setTree((t) => { const cp = JSON.parse(JSON.stringify(t)); return insertBST(cp, v); });
      toast.success(`Inserted ${v}`);
    } else {
      const newHeap = [...heap, v];
      setHeap(newHeap);
      toast.success(`Inserted ${v} into Heap`);
      let curr = newHeap.length - 1;
      const isMin = treeMode === "min_heap";
      while (curr > 0) {
        let parent = Math.floor((curr - 1) / 2);
        setActiveNode(newHeap[curr]);
        setHighlighted([newHeap[parent]]);
        await new Promise(r => setTimeout(r, 600));
        
        if ((isMin && newHeap[curr] < newHeap[parent]) || (!isMin && newHeap[curr] > newHeap[parent])) {
          let temp = newHeap[curr];
          newHeap[curr] = newHeap[parent];
          newHeap[parent] = temp;
          setHeap([...newHeap]);
          curr = parent;
        } else {
          break;
        }
      }
      setActiveNode(null);
      setHighlighted([]);
    }
  };

  const doDelete = async () => {
    if (treeMode === "bst") {
      const v = parseInt(inputVal);
      if (!v) return;
      setTree((t) => { const cp = JSON.parse(JSON.stringify(t)); return deleteNodeBST(cp, v); });
      setInputVal(""); toast.info(`Deleted ${v}`);
    } else {
      if (heap.length === 0) return;
      const extracted = heap[0];
      toast.info(`Extracted ${extracted}`);
      if (heap.length === 1) {
        setHeap([]);
        return;
      }
      const newHeap = [...heap];
      newHeap[0] = newHeap.pop();
      setHeap([...newHeap]);
      
      let curr = 0;
      const isMin = treeMode === "min_heap";
      const size = newHeap.length;
      
      while (true) {
        let left = 2 * curr + 1;
        let right = 2 * curr + 2;
        let extreme = curr;
        
        setActiveNode(newHeap[curr]);
        await new Promise(r => setTimeout(r, 600));
        
        if (left < size && ((isMin && newHeap[left] < newHeap[extreme]) || (!isMin && newHeap[left] > newHeap[extreme]))) extreme = left;
        if (right < size && ((isMin && newHeap[right] < newHeap[extreme]) || (!isMin && newHeap[right] > newHeap[extreme]))) extreme = right;
        
        if (extreme !== curr) {
          setHighlighted([newHeap[extreme]]);
          await new Promise(r => setTimeout(r, 400));
          let temp = newHeap[curr];
          newHeap[curr] = newHeap[extreme];
          newHeap[extreme] = temp;
          setHeap([...newHeap]);
          curr = extreme;
        } else {
          break;
        }
      }
      setActiveNode(null);
      setHighlighted([]);
    }
  };

  const doSearch = () => {
    if (treeMode !== "bst") return toast.error("Search only available in BST mode.");
    const v = parseInt(inputVal);
    if (!v) return;
    let node = tree; const path = [];
    while (node) {
      path.push(node.val);
      if (v === node.val) break;
      node = v < node.val ? node.left : node.right;
    }
    setHighlighted(path);
    setActiveNode(node ? v : null);
    toast[node ? "success" : "error"](node ? `Found ${v}!` : `${v} not found`);
    setTimeout(() => { setHighlighted([]); setActiveNode(null); }, 2500);
  };

  const doReset = () => {
    setTree(buildInitBST());
    setHeap([10, 20, 15, 40, 50, 100, 25]);
    setHighlighted([]);
    setActiveNode(null);
    setVisitedSeq([]);
    setTraversalType("");
    setTraversalStepMsg("");
    setInputVal("");
    resetView();
  };

  const doRandomize = () => {
    if (treeMode === "bst") return;
    const randomArr = Array.from({length: 10}, () => Math.floor(Math.random() * 90) + 10);
    setHeap([...randomArr]);
    toast.success("Randomized! Click Start Heapify to arrange.");
  };

  const doHeapify = async () => {
    if (treeMode === "bst") return;
    const isMin = treeMode === "min_heap";
    const arr = [...heap];
    
    const heapifyDown = async (idx, n) => {
      let curr = idx;
      while (true) {
        let left = 2 * curr + 1;
        let right = 2 * curr + 2;
        let extreme = curr;
        
        setActiveNode(arr[curr]);
        await new Promise(r => setTimeout(r, 400));
        
        if (left < n && ((isMin && arr[left] < arr[extreme]) || (!isMin && arr[left] > arr[extreme]))) extreme = left;
        if (right < n && ((isMin && arr[right] < arr[extreme]) || (!isMin && arr[right] > arr[extreme]))) extreme = right;
        
        if (extreme !== curr) {
          setHighlighted([arr[extreme]]);
          await new Promise(r => setTimeout(r, 400));
          let temp = arr[curr];
          arr[curr] = arr[extreme];
          arr[extreme] = temp;
          setHeap([...arr]);
          curr = extreme;
        } else {
          break;
        }
      }
      setActiveNode(null);
      setHighlighted([]);
    };

    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      await heapifyDown(i, arr.length);
    }
    toast.success("Heapify Complete!");
  };

  /* Traversal Algorithms */
  const getInOrder = (node, acc = []) => { if (!node) return acc; getInOrder(node.left, acc); acc.push(node.val); getInOrder(node.right, acc); return acc; };
  const getPreOrder = (node, acc = []) => { if (!node) return acc; acc.push(node.val); getPreOrder(node.left, acc); getPreOrder(node.right, acc); return acc; };
  const getPostOrder = (node, acc = []) => { if (!node) return acc; getPostOrder(node.left, acc); getPostOrder(node.right, acc); acc.push(node.val); return acc; };

  const runTraversal = (type) => {
    if (!tree) return;
    let path = [];
    let label = "";
    if (type === "inorder") { path = getInOrder(tree); label = "In-Order (Left ➔ Root ➔ Right)"; }
    else if (type === "preorder") { path = getPreOrder(tree); label = "Pre-Order (Root ➔ Left ➔ Right)"; }
    else if (type === "postorder") { path = getPostOrder(tree); label = "Post-Order (Left ➔ Right ➔ Root)"; }

    setTraversalType(label);
    setVisitedSeq([]); setHighlighted([]); setActiveNode(null);

    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= path.length) {
        clearInterval(interval);
        setActiveNode(null); setHighlighted(path);
        setTraversalStepMsg(`✅ ${type.toUpperCase()} Traversal Complete! Result: [${path.join(", ")}]`);
        toast.success(`Completed ${type.toUpperCase()} Traversal!`);
        return;
      }
      const currVal = path[idx];
      setActiveNode(currVal);
      setHighlighted(path.slice(0, idx + 1));
      setVisitedSeq(path.slice(0, idx + 1));
      setTraversalStepMsg(`Visiting node ${currVal} (${idx + 1} of ${path.length})`);
      idx++;
    }, 600);
  };

  const buildTreeFromHeap = (arr, index = 0) => {
    if (index >= arr.length) return null;
    return {
      val: arr[index],
      left: buildTreeFromHeap(arr, 2 * index + 1),
      right: buildTreeFromHeap(arr, 2 * index + 2)
    };
  };

  const getActiveTree = () => {
    if (treeMode === "bst") return tree;
    return buildTreeFromHeap(heap);
  };

  const renderTree = (node, x, y, spread) => {
    if (!node) return null;
    const isHL = highlighted.includes(node.val);
    const isActive = activeNode === node.val;
    return (
      <g key={`${node.val}-${x}-${y}`}>
        {node.left && <line x1={x} y1={y} x2={x - spread} y2={y + 60} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />}
        {node.right && <line x1={x} y1={y} x2={x + spread} y2={y + 60} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />}
        {isActive && <circle cx={x} cy={y} r={24} fill="none" stroke="#f59e0b" strokeWidth="2.5" className="animate-ping opacity-75" />}
        <circle
          cx={x} cy={y} r={19}
          fill={isActive ? "#f59e0b" : isHL ? "#8b5cf6" : "#1e1b4b"}
          stroke={isActive ? "#fbbf24" : isHL ? "#c084fc" : "#6366f1"}
          strokeWidth={isActive ? 3 : isHL ? 2.5 : 1.5}
          style={{ filter: isActive ? "drop-shadow(0 0 12px rgba(245,158,11,0.8))" : isHL ? "drop-shadow(0 0 10px rgba(192,132,252,0.6))" : "none", transition: "all 0.3s ease" }}
        />
        <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">
          {node.val}
        </text>
        {node.left && renderTree(node.left, x - spread, y + 60, spread / 1.8)}
        {node.right && renderTree(node.right, x + spread, y + 60, spread / 1.8)}
      </g>
    );
  };

  return (
    <div className="space-y-4 font-mono text-xs select-none">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.02] p-3 rounded-2xl border theme-border">
        
        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border theme-border">
          <button onClick={() => setTreeMode("bst")} className={`px-3 py-1.5 rounded-lg transition-all ${treeMode === "bst" ? "bg-indigo-500 text-white shadow-lg" : "text-zinc-400 hover:text-white"}`}>BST</button>
          <button onClick={() => setTreeMode("min_heap")} className={`px-3 py-1.5 rounded-lg transition-all ${treeMode === "min_heap" ? "bg-emerald-500 text-white shadow-lg" : "text-zinc-400 hover:text-white"}`}>Min Heap</button>
          <button onClick={() => setTreeMode("max_heap")} className={`px-3 py-1.5 rounded-lg transition-all ${treeMode === "max_heap" ? "bg-rose-500 text-white shadow-lg" : "text-zinc-400 hover:text-white"}`}>Max Heap</button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number" placeholder="Value" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
            className="w-20 bg-black/50 theme-border text-xs rounded-xl px-2 py-1.5 font-bold theme-text focus:outline-none focus:border-indigo-500 border"
          />
          <Button onClick={doInsert} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs font-mono text-white">
            <Plus className="w-3.5 h-3.5 mr-1" /> Insert
          </Button>
          <Button onClick={doDelete} size="sm" variant="outline" className="text-xs font-mono text-rose-400 theme-border">
            <Trash2 className="w-3.5 h-3.5 mr-1" /> {treeMode === "bst" ? "Delete" : "Extract"}
          </Button>
          {treeMode === "bst" && (
            <Button onClick={doSearch} size="sm" variant="outline" className="text-xs font-mono text-amber-400 theme-border">
              <Search className="w-3.5 h-3.5 mr-1" /> Search
            </Button>
          )}
          <Button onClick={doReset} size="sm" variant="ghost" className="text-xs font-mono text-zinc-400">
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
          </Button>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {treeMode === "bst" ? (
            <>
              <span className="text-[10px] theme-text-muted font-bold mr-1">Traversals:</span>
              <Button onClick={() => runTraversal("inorder")} size="sm" variant="outline" className="text-xs font-mono text-emerald-400 theme-border">🌳 In-Order</Button>
              <Button onClick={() => runTraversal("preorder")} size="sm" variant="outline" className="text-xs font-mono text-indigo-400 theme-border">🌿 Pre-Order</Button>
              <Button onClick={() => runTraversal("postorder")} size="sm" variant="outline" className="text-xs font-mono text-purple-400 theme-border">🍂 Post-Order</Button>
            </>
          ) : (
            <>
              <Button onClick={doRandomize} size="sm" variant="outline" className="text-xs font-mono text-fuchsia-400 theme-border">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Randomize
              </Button>
              <Button onClick={doHeapify} size="sm" variant="outline" className="text-xs font-mono text-emerald-400 theme-border">
                <Play className="w-3.5 h-3.5 mr-1" /> Start Heapify
              </Button>
            </>
          )}
        </div>
      </div>

      <div className={`relative h-[340px] bg-black/40 rounded-2xl border theme-border overflow-hidden select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span className="text-[10px] theme-text-muted bg-black/60 px-2.5 py-1 rounded-lg border theme-border backdrop-blur-sm font-bold flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3 text-indigo-400" /> Click & Drag to Move Canvas
          </span>
        </div>
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border theme-border backdrop-blur-sm">
          <button onClick={() => setZoom((z) => Math.min(2.2, z + 0.15))} className="w-7 h-7 rounded-lg hover:bg-white/10 text-white font-bold grid place-items-center text-xs">+</button>
          <button onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))} className="w-7 h-7 rounded-lg hover:bg-white/10 text-white font-bold grid place-items-center text-xs">-</button>
          <button onClick={resetView} className="px-2 h-7 rounded-lg hover:bg-white/10 text-xs theme-text-muted font-bold">Reset View</button>
        </div>

        <svg width="100%" height="100%" className="w-full h-full">
          <g transform={`translate(${400 + pan.x}, ${40 + pan.y}) scale(${zoom})`}>
            {renderTree(getActiveTree(), 0, 0, 140)}
          </g>
        </svg>
      </div>

      {traversalType && (
        <div className="theme-card p-3 rounded-2xl border theme-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-indigo-400" /> {traversalType}</span>
            <span className="text-[11px] theme-text-muted font-bold">{traversalStepMsg}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] theme-text-muted font-bold">Visited Nodes:</span>
            {visitedSeq.map((v, i) => (
              <span key={i} className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all duration-300 flex items-center gap-1 ${activeNode === v ? "bg-amber-500 text-black shadow-lg shadow-amber-500/50 scale-110" : "bg-purple-500/20 text-purple-300 border border-purple-500/30"}`}>
                {v} {i < visitedSeq.length - 1 && <span className="text-purple-400 ml-1">➔</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="font-mono text-xs theme-text-muted px-4 py-2.5 rounded-xl bg-white/[0.02] border theme-border flex items-center justify-between">
        <span>{treeMode === "bst" ? "BST Property: Left < Root < Right" : (treeMode === "min_heap" ? "Min Heap: Parent <= Children | Complete Tree" : "Max Heap: Parent >= Children | Complete Tree")}</span>
        <span className="text-[11px]">Time Complexity: {treeMode === "bst" ? "O(log n) avg | O(n) worst" : "O(log n) insert/extract | O(n) heapify"}</span>
      </div>
    </div>
  );
}
/* =========================================================================
   5. GRAPH ALGORITHMS VISUALIZER — fully interactive
   ========================================================================= */
function GraphVisualizer() {
  const INIT_NODES = [
    { id: "A", x: 120, y: 80 },
    { id: "B", x: 300, y: 60 },
    { id: "C", x: 200, y: 190 },
    { id: "D", x: 390, y: 190 },
    { id: "E", x: 490, y: 90 }
  ];
  const INIT_EDGES = [
    { from: "A", to: "B", weight: 4 },
    { from: "A", to: "C", weight: 2 },
    { from: "B", to: "C", weight: 1 },
    { from: "B", to: "D", weight: 5 },
    { from: "C", to: "D", weight: 8 },
    { from: "D", to: "E", weight: 3 }
  ];

  const [nodes, setNodes] = useState(INIT_NODES);
  const [edges, setEdges] = useState(INIT_EDGES);
  const [algorithm, setAlgorithm] = useState("bfs");
  const [running, setRunning] = useState(false);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [activeEdges, setActiveEdges] = useState([]);
  const [nodeLabels, setNodeLabels] = useState({});
  const [currentNode, setCurrentNode] = useState(null);
  const [log, setLog] = useState([]);
  const [mode, setMode] = useState("idle");
  const [selectedForEdge, setSelectedForEdge] = useState(null);
  const [pendingWeight, setPendingWeight] = useState("");
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);
  const stopRef = useRef(false);
  const nodeCounter = useRef(5);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const addLog = (msg) => setLog((p) => [...p.slice(-9), msg]);

  const resetViz = () => {
    stopRef.current = true;
    setVisitedNodes([]); setActiveEdges([]);
    setNodeLabels({}); setCurrentNode(null);
    setLog([]); setRunning(false);
  };

  const buildAdj = (nodeList, edgeList) => {
    const adj = {};
    nodeList.forEach(n => { adj[n.id] = []; });
    edgeList.forEach(({ from, to, weight }) => {
      if (adj[from]) adj[from].push({ to, weight });
      if (adj[to]) adj[to].push({ to: from, weight });
    });
    return adj;
  };

  const runBFS = async (startId, adj) => {
    const visited = new Set([startId]);
    const queue = [startId];
    setVisitedNodes([startId]);
    addLog(`BFS start: ${startId}`);
    while (queue.length && !stopRef.current) {
      const curr = queue.shift();
      setCurrentNode(curr);
      addLog(`Visit ${curr} | neighbors: ${(adj[curr]||[]).map(e=>e.to).join(", ")||"none"}`);
      await sleep(700);
      for (const { to, weight } of (adj[curr] || [])) {
        if (!visited.has(to)) {
          visited.add(to);
          setActiveEdges(p => [...p, { from: curr, to }]);
          queue.push(to);
          setVisitedNodes([...visited]);
          addLog(`  Enqueue ${to} (w=${weight})`);
          await sleep(350);
        }
      }
    }
    setCurrentNode(null);
    if (!stopRef.current) { addLog("BFS complete!"); toast.success("BFS Complete"); }
  };

  const runDFS = async (startId, adj) => {
    const visited = new Set();
    const dfs = async (id) => {
      if (visited.has(id) || stopRef.current) return;
      visited.add(id);
      setCurrentNode(id);
      setVisitedNodes([...visited]);
      addLog(`DFS enter ${id}`);
      await sleep(700);
      for (const { to } of (adj[id] || [])) {
        if (!visited.has(to)) {
          setActiveEdges(p => [...p, { from: id, to }]);
          await sleep(300);
          await dfs(to);
        }
      }
      addLog(`DFS backtrack from ${id}`);
    };
    await dfs(startId);
    setCurrentNode(null);
    if (!stopRef.current) { addLog("DFS complete!"); toast.success("DFS Complete"); }
  };

  const runDijkstra = async (startId, nodeList, adj) => {
    const dist = {};
    nodeList.forEach(n => { dist[n.id] = Infinity; });
    dist[startId] = 0;
    const unvisited = new Set(nodeList.map(n => n.id));
    setNodeLabels({ [startId]: "0" });
    addLog(`Dijkstra from ${startId}. dist=∞ except start=0`);
    while (unvisited.size && !stopRef.current) {
      let u = null;
      for (const id of unvisited) {
        if (u === null || dist[id] < dist[u]) u = id;
      }
      if (!u || dist[u] === Infinity) break;
      unvisited.delete(u);
      setCurrentNode(u);
      setVisitedNodes(p => [...p, u]);
      addLog(`Process ${u} (dist=${dist[u]})`);
      await sleep(700);
      for (const { to, weight } of (adj[u] || [])) {
        const alt = dist[u] + weight;
        if (alt < dist[to]) {
          dist[to] = alt;
          setNodeLabels(p => ({ ...p, [to]: String(alt) }));
          setActiveEdges(p => [...p.filter(e => e.to !== to), { from: u, to }]);
          addLog(`  Relax ${u}->${to}: dist=${alt}`);
          await sleep(400);
        }
      }
    }
    setCurrentNode(null);
    if (!stopRef.current) { addLog("Dijkstra done! Labels=shortest dist."); toast.success("Dijkstra Complete"); }
  };

  const runPrim = async (startId, nodeList, adj) => {
    const inMST = new Set([startId]);
    const mstEdges = [];
    setVisitedNodes([startId]);
    addLog(`Prim's MST from ${startId}`);
    while (inMST.size < nodeList.length && !stopRef.current) {
      let best = null;
      for (const u of inMST) {
        for (const { to, weight } of (adj[u] || [])) {
          if (!inMST.has(to) && (!best || weight < best.weight))
            best = { from: u, to, weight };
        }
      }
      if (!best) break;
      inMST.add(best.to);
      mstEdges.push(best);
      setCurrentNode(best.to);
      setVisitedNodes([...inMST]);
      setActiveEdges([...mstEdges]);
      addLog(`  Add ${best.from}->${best.to} (w=${best.weight})`);
      await sleep(800);
    }
    setCurrentNode(null);
    const total = mstEdges.reduce((s, e) => s + e.weight, 0);
    if (!stopRef.current) { addLog(`Prim's done! Weight=${total}`); toast.success(`Prim's MST weight=${total}`); }
  };

  const runKruskal = async (nodeList, edgeList) => {
    const sorted = [...edgeList].sort((a, b) => a.weight - b.weight);
    const parent = {};
    nodeList.forEach(n => { parent[n.id] = n.id; });
    const find = (x) => { if (parent[x] !== x) parent[x] = find(parent[x]); return parent[x]; };
    const union = (x, y) => { parent[find(x)] = find(y); };
    const mstEdges = [];
    addLog("Kruskal's: sorted edges by weight");
    for (const edge of sorted) {
      if (stopRef.current) break;
      setCurrentNode(edge.from);
      addLog(`  Check ${edge.from}->${edge.to} (w=${edge.weight})`);
      await sleep(600);
      if (find(edge.from) !== find(edge.to)) {
        union(edge.from, edge.to);
        mstEdges.push(edge);
        setActiveEdges([...mstEdges]);
        setVisitedNodes(mstEdges.flatMap(e => [e.from, e.to]).filter((v, i, a) => a.indexOf(v) === i));
        addLog(`    Added (no cycle)`);
        await sleep(600);
      } else {
        addLog(`    Skipped (cycle)`);
        await sleep(300);
      }
    }
    setCurrentNode(null);
    const total = mstEdges.reduce((s, e) => s + e.weight, 0);
    if (!stopRef.current) { addLog(`Kruskal's done! Weight=${total}`); toast.success(`Kruskal's MST weight=${total}`); }
  };

  const runAlgorithm = async () => {
    resetViz();
    await sleep(120);
    stopRef.current = false;
    setRunning(true);
    const nodeSnap = nodes;
    const edgeSnap = edges;
    const adj = buildAdj(nodeSnap, edgeSnap);
    const startId = nodeSnap[0]?.id;
    if (!startId) { toast.error("Add at least one node!"); setRunning(false); return; }
    try {
      if (algorithm === "bfs")      await runBFS(startId, adj);
      else if (algorithm === "dfs")      await runDFS(startId, adj);
      else if (algorithm === "dijkstra") await runDijkstra(startId, nodeSnap, adj);
      else if (algorithm === "prim")     await runPrim(startId, nodeSnap, adj);
      else if (algorithm === "kruskal")  await runKruskal(nodeSnap, edgeSnap);
    } catch (e) {}
    setRunning(false);
  };

  const handleSvgClick = (e) => {
    if (running || dragging || mode !== "addNode") return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const LETTERS = "FGHIJKLMNOPQRSTUVWXYZ";
    const id = LETTERS[nodeCounter.current % LETTERS.length] || String(nodeCounter.current);
    nodeCounter.current += 1;
    setNodes(p => [...p, { id, x, y }]);
    addLog(`Added node ${id}`);
    setMode("idle");
  };

  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation();
    if (running || mode !== "addEdge") return;
    if (!selectedForEdge) {
      setSelectedForEdge(nodeId);
      addLog(`Edge from ${nodeId} — click 2nd node`);
    } else if (selectedForEdge !== nodeId) {
      const w = parseInt(pendingWeight) || Math.floor(Math.random() * 8) + 1;
      setEdges(p => [...p, { from: selectedForEdge, to: nodeId, weight: w }]);
      addLog(`Added edge ${selectedForEdge}->${nodeId} (w=${w})`);
      setSelectedForEdge(null); setPendingWeight(""); setMode("idle");
    }
  };

  const handleNodeRightClick = (e, nodeId) => {
    e.preventDefault();
    if (running) return;
    setNodes(p => p.filter(n => n.id !== nodeId));
    setEdges(p => p.filter(e => e.from !== nodeId && e.to !== nodeId));
    setVisitedNodes(p => p.filter(v => v !== nodeId));
    addLog(`Deleted ${nodeId}`);
  };

  const handleMouseDown = (e, nodeId) => {
    if (mode !== "idle" || running) return;
    e.stopPropagation(); e.preventDefault();
    const rect = svgRef.current.getBoundingClientRect();
    const node = nodes.find(n => n.id === nodeId);
    setDragging(nodeId);
    setDragOffset({ x: e.clientX - rect.left - node.x, y: e.clientY - rect.top - node.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(22, Math.min(rect.width - 22, e.clientX - rect.left - dragOffset.x));
    const y = Math.max(22, Math.min(rect.height - 22, e.clientY - rect.top - dragOffset.y));
    setNodes(p => p.map(n => n.id === dragging ? { ...n, x, y } : n));
  };

  const isEdgeActive = (from, to) =>
    activeEdges.some(e => (e.from === from && e.to === to) || (e.from === to && e.to === from));

  const algMeta = {
    bfs:      { color: "#22d3ee", label: "BFS",       info: "Queue-based. Visits level by level. O(V+E)." },
    dfs:      { color: "#a855f7", label: "DFS",       info: "Recursive/stack. Goes deep first. O(V+E)." },
    dijkstra: { color: "#eab308", label: "Dijkstra",  info: "Greedy shortest path. Labels=min distance. O((V+E)logV)." },
    prim:     { color: "#22c55e", label: "Prim's",    info: "Greedy MST: cheapest edge to unvisited. O(E logV)." },
    kruskal:  { color: "#f97316", label: "Kruskal's", info: "Sort edges, add if no cycle (union-find). O(E logE)." }
  };
  const meta = algMeta[algorithm];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 bg-white/[0.02] p-3 rounded-xl border border-white/5">
        <select value={algorithm} onChange={(e) => { setAlgorithm(e.target.value); resetViz(); }}
          className="bg-black/50 border border-white/10 text-xs rounded-lg px-3 py-1.5 font-mono text-white">
          <option value="bfs">Breadth-First Search (BFS)</option>
          <option value="dfs">Depth-First Search (DFS)</option>
          <option value="dijkstra">Dijkstra's Algorithm</option>
          <option value="prim">Prim's MST</option>
          <option value="kruskal">Kruskal's MST</option>
        </select>
        <Button onClick={runAlgorithm} disabled={running} size="sm"
          style={{ backgroundColor: meta.color + "30", borderColor: meta.color + "80", color: meta.color }}
          className="text-xs font-mono border">
          <Play className="w-3.5 h-3.5 mr-1" />{running ? "Running…" : "Start"}
        </Button>
        <Button onClick={resetViz} disabled={running} size="sm" variant="outline" className="text-xs font-mono">
          <RotateCcw className="w-3.5 h-3.5 mr-1" />Stop
        </Button>
        <div className="flex-1" />
        <Button onClick={() => { setMode(m => m === "addNode" ? "idle" : "addNode"); setSelectedForEdge(null); }}
          size="sm" variant={mode === "addNode" ? "default" : "outline"} className="text-xs font-mono">
          <Plus className="w-3 h-3 mr-1" />Node
        </Button>
        <Button onClick={() => { setMode(m => m === "addEdge" ? "idle" : "addEdge"); setSelectedForEdge(null); }}
          size="sm" variant={mode === "addEdge" ? "default" : "outline"} className="text-xs font-mono">
          ⇌ Edge
        </Button>
        {mode === "addEdge" && (
          <input type="number" min="1" placeholder="wt" value={pendingWeight} onChange={e => setPendingWeight(e.target.value)}
            className="w-12 bg-black/60 border border-white/10 text-xs rounded px-2 py-1 font-mono text-white" />
        )}
        <Button onClick={() => { setNodes(INIT_NODES); setEdges(INIT_EDGES); resetViz(); nodeCounter.current = 5; }}
          size="sm" variant="ghost" className="text-xs font-mono text-zinc-500">
          <Trash2 className="w-3 h-3 mr-1" />Reset Graph
        </Button>
      </div>

      {mode !== "idle" && (
        <div className="text-[11px] font-mono px-3 py-2 rounded-lg border border-indigo-400/30 bg-indigo-500/10 text-indigo-300">
          {mode === "addNode" && "📍 Click anywhere on the canvas to place a node"}
          {mode === "addEdge" && !selectedForEdge && "🔗 Click the FIRST node"}
          {mode === "addEdge" && selectedForEdge && `🔗 Click SECOND node to connect from ${selectedForEdge}`}
        </div>
      )}

      <div className="rounded-xl border border-white/5 bg-black/40 select-none"
        style={{ cursor: mode === "addNode" ? "crosshair" : "default" }}>
        <svg ref={svgRef} width="100%" height="300"
          onClick={handleSvgClick}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setDragging(null)}
          onMouseLeave={() => setDragging(null)}>
          {edges.map((edge, i) => {
            const n1 = nodes.find(n => n.id === edge.from);
            const n2 = nodes.find(n => n.id === edge.to);
            if (!n1 || !n2) return null;
            const active = isEdgeActive(edge.from, edge.to);
            const mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2;
            return (
              <g key={i}>
                {active && <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={meta.color} strokeWidth={8} opacity={0.15} />}
                <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                  stroke={active ? meta.color : "rgba(255,255,255,0.1)"}
                  strokeWidth={active ? 2.5 : 1.5}
                  style={{ transition: "stroke 0.4s, stroke-width 0.3s" }} />
                <text x={mx} y={my - 7} fill={active ? meta.color : "#3f3f46"}
                  fontSize="11" fontFamily="monospace" textAnchor="middle">{edge.weight}</text>
              </g>
            );
          })}
          {nodes.map((node) => {
            const visited = visitedNodes.includes(node.id);
            const isCurrent = currentNode === node.id;
            const isSelected = selectedForEdge === node.id;
            const label = nodeLabels[node.id];
            const nodeColor = isCurrent ? meta.color : visited ? meta.color : "#6366f1";
            return (
              <g key={node.id}
                onClick={(e) => handleNodeClick(e, node.id)}
                onContextMenu={(e) => handleNodeRightClick(e, node.id)}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                style={{ cursor: mode === "addEdge" ? "pointer" : "grab" }}>
                {(isCurrent || isSelected) && (
                  <circle cx={node.x} cy={node.y} r={26} fill="none"
                    stroke={isSelected ? "#a855f7" : meta.color} strokeWidth={1.5} opacity={0.4}>
                    <animate attributeName="r" values="22;30;22" dur="1.2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.05;0.4" dur="1.2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={node.x} cy={node.y} r={20}
                  fill={visited || isCurrent ? nodeColor + "40" : "#1e1b4b"}
                  stroke={isSelected ? "#a855f7" : nodeColor}
                  strokeWidth={isCurrent || visited ? 2 : 1.5}
                  style={{ transition: "fill 0.4s, stroke 0.3s" }} />
                <text x={node.x} y={node.y + 1} textAnchor="middle" dominantBaseline="middle"
                  fill={visited || isCurrent ? "#fff" : "#a5b4fc"}
                  fontSize="12" fontFamily="monospace" fontWeight="bold">{node.id}</text>
                {label !== undefined && (
                  <text x={node.x} y={node.y - 28} textAnchor="middle"
                    fill={meta.color} fontSize="11" fontFamily="monospace" fontWeight="bold">d={label}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-black/50 border border-white/5 rounded-xl p-3 h-36 overflow-y-auto">
          <div className="font-mono text-[10px] text-zinc-600 mb-1">STEP LOG</div>
          {log.length === 0
            ? <div className="font-mono text-[11px] text-zinc-600">Press Start to begin…</div>
            : log.map((l, i) => <div key={i} className="font-mono text-[11px] text-zinc-300">{l}</div>)}
        </div>
        <div className="bg-black/50 border border-white/5 rounded-xl p-3 space-y-2">
          <div className="font-bold text-xs text-white font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: meta.color }} />
            {meta.label}
          </div>
          <div className="font-mono text-[11px] text-zinc-400">{meta.info}</div>
          <div className="font-mono text-[10px] text-zinc-600 border-t border-white/5 pt-2">
            Drag nodes • Right-click to delete • Add nodes/edges with buttons above
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. LINKED LISTS VISUALIZER
   ========================================================================= */
function LinkedListVisualizer() {
  const [list, setList] = useState([25, 17, 74, 83, 16, 45, 13, 63, 17, 76, 52, 18]);
  const [inputVal, setInputVal] = useState("");

  /* Animation Pointers & Sub-List State */
  const [activePrev, setActivePrev] = useState(null);
  const [activeCurr, setActiveCurr] = useState(null);
  const [activeNext, setActiveNext] = useState(null);
  const [slowIdx, setSlowIdx] = useState(null);
  const [fastIdx, setFastIdx] = useState(null);

  const [isReversing, setIsReversing] = useState(false);
  const [reversedList, setReversedList] = useState([]);
  const [remainingList, setRemainingList] = useState([]);

  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(400); // ms per step
  const [stepLog, setStepLog] = useState("");
  const [visitedSeq, setVisitedSeq] = useState([]);
  const [activeCodeLine, setActiveCodeLine] = useState(-1);

  const containerRef = useRef(null);
  const nodeRefs = useRef([]);
  const timerRef = useRef(null);
  const isPausedRef = useRef(false);

  /* Auto-scroll helper */
  const scrollToNode = (idx) => {
    if (idx !== null && nodeRefs.current[idx]) {
      nodeRefs.current[idx].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  /* Pause / Resume Handler */
  const togglePause = () => {
    if (!isAnimating) return;
    const nextState = !isPaused;
    setIsPaused(nextState);
    isPausedRef.current = nextState;
    if (nextState) {
      toast.info("Animation Paused ⏸");
    } else {
      toast.success("Resuming Animation ▶");
    }
  };

  /* Hard Reset Animation */
  const stopAnimation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    isPausedRef.current = false;
    setIsPaused(false);
    setIsAnimating(false);
    setIsReversing(false);
    resetAllPointers();
    toast.info("Animation reset");
  };

  /* Basic Insert / Delete */
  const insertHead = () => {
    if (isAnimating) return;
    const v = parseInt(inputVal) || Math.floor(Math.random() * 90) + 10;
    setList([v, ...list]); setInputVal("");
    toast.success(`Inserted ${v} at head`);
  };

  const insertTail = () => {
    if (isAnimating) return;
    const v = parseInt(inputVal) || Math.floor(Math.random() * 90) + 10;
    setList([...list, v]); setInputVal("");
    toast.success(`Inserted ${v} at tail`);
  };

  const removeHead = () => {
    if (isAnimating || !list.length) return;
    toast.info(`Removed head: ${list[0]}`);
    setList(list.slice(1));
  };

  const resetAllPointers = () => {
    setActivePrev(null);
    setActiveCurr(null);
    setActiveNext(null);
    setSlowIdx(null);
    setFastIdx(null);
    setVisitedSeq([]);
    setStepLog("");
    setIsReversing(false);
    setReversedList([]);
    setRemainingList([]);
    setActiveCodeLine(-1);
  };

  /* ── 1. Real-Time Memory Sub-List Mutation Reversal ── */
  const animateReverse = () => {
    if (isAnimating || list.length === 0) return;
    setIsAnimating(true);
    setIsReversing(true);
    setIsPaused(false);
    isPausedRef.current = false;

    let rev = [];
    let rem = [...list];

    setReversedList([]);
    setRemainingList([...rem]);

    let subStep = 0;
    let stepCount = 0;

    timerRef.current = setInterval(() => {
      if (isPausedRef.current) return; // Skip tick when paused

      if (rem.length === 0 && subStep === 0) {
        clearInterval(timerRef.current);
        setList(rev);
        setIsReversing(false);
        setIsAnimating(false);
        setStepLog(`✅ Linked List Reversal Complete! Final List: [${rev.join(" ➔ ")}]`);
        toast.success("Linked List Reversal Complete!");
        return;
      }

      if (subStep === 0) {
        setActiveCodeLine(0);
        const currVal = rem[0];
        const nextVal = rem.length > 1 ? rem[1] : "NULL";
        setActiveCurr(currVal);
        setActiveNext(nextVal === "NULL" ? null : nextVal);
        setStepLog(`Step ${stepCount + 1}: next = curr->next (${nextVal !== "NULL" ? `node[${nextVal}]` : "NULL"})`);
        subStep = 1;
      } else if (subStep === 1) {
        setActiveCodeLine(1);
        const currVal = rem[0];
        rev = [currVal, ...rev];
        rem = rem.slice(1);
        setReversedList([...rev]);
        setRemainingList([...rem]);
        setStepLog(`Step ${stepCount + 1}: curr->next = prev (linking ${currVal} ➔ ${rev.length > 1 ? rev[1] : "NULL"})`);
        subStep = 2;
      } else if (subStep === 2) {
        setActiveCodeLine(2);
        setActivePrev(rev[0]);
        setStepLog(`Step ${stepCount + 1}: prev = curr (${rev[0]})`);
        subStep = 3;
      } else if (subStep === 3) {
        setActiveCodeLine(3);
        const nextVal = rem.length > 0 ? rem[0] : "NULL";
        setActiveCurr(nextVal === "NULL" ? null : nextVal);
        setStepLog(`Step ${stepCount + 1}: curr = next (${nextVal})`);
        subStep = 0;
        stepCount++;
      }
    }, speed);
  };

  /* ── 2. Find Middle Element (Slow & Fast Pointers - Tortoise & Hare) ── */
  const animateFindMiddle = () => {
    if (isAnimating || list.length === 0) return;
    setIsAnimating(true);
    setIsPaused(false);
    isPausedRef.current = false;
    resetAllPointers();

    let slow = 0;
    let fast = 0;
    const n = list.length;

    setSlowIdx(slow);
    setFastIdx(fast);
    setStepLog(`Starting Middle Search: Slow (🐢) at index 0, Fast (🐇) at index 0`);

    timerRef.current = setInterval(() => {
      if (isPausedRef.current) return; // Skip tick when paused

      if (fast >= n - 1 || fast + 1 >= n - 1) {
        clearInterval(timerRef.current);
        setSlowIdx(slow);
        setFastIdx(null);
        setIsAnimating(false);
        const midVal = list[slow];
        setStepLog(`🌟 Middle Element Found at node[${slow}] = ${midVal}! (Total nodes: ${n})`);
        toast.success(`Middle Element is ${midVal} at index ${slow}!`);
        return;
      }

      slow = slow + 1;
      fast = Math.min(fast + 2, n - 1);

      setSlowIdx(slow);
      setFastIdx(fast);
      setStepLog(`Slow 🐢 ➔ node[${slow}] (${list[slow]}), Fast 🐇 ➔ node[${fast}] (${list[fast]})`);
    }, Math.max(speed, 300));
  };

  /* ── 3. Step-by-Step Traversal Algorithm ── */
  const animateTraversal = () => {
    if (isAnimating || list.length === 0) return;
    setIsAnimating(true);
    setIsPaused(false);
    isPausedRef.current = false;
    resetAllPointers();

    let idx = 0;
    const seq = [];

    timerRef.current = setInterval(() => {
      if (isPausedRef.current) return; // Skip tick when paused

      if (idx >= list.length) {
        clearInterval(timerRef.current);
        setIsAnimating(false);
        setStepLog(`✅ Traversal Complete! Visited ${list.length} nodes: [${seq.join(" ➔ ")}]`);
        toast.success("Completed Linked List Traversal!");
        return;
      }

      setActiveCurr(idx);
      seq.push(list[idx]);
      setVisitedSeq([...seq]);
      setStepLog(`Traversing: Visiting node[${idx}] = ${list[idx]}`);
      idx++;
    }, Math.max(speed, 200));
  };

  /* ── 4. Search Value Algorithm ── */
  const animateSearch = () => {
    if (isAnimating || list.length === 0) return;
    const target = parseInt(inputVal) || list[Math.floor(Math.random() * list.length)];
    setIsAnimating(true);
    setIsPaused(false);
    isPausedRef.current = false;
    resetAllPointers();

    let idx = 0;
    setStepLog(`Searching for target value = ${target}...`);

    timerRef.current = setInterval(() => {
      if (isPausedRef.current) return; // Skip tick when paused

      if (idx >= list.length) {
        clearInterval(timerRef.current);
        setIsAnimating(false);
        setStepLog(`❌ Target ${target} not found in the Linked List.`);
        toast.error(`Target ${target} not found`);
        return;
      }

      setActiveCurr(idx);
      setStepLog(`Checking node[${idx}] = ${list[idx]} vs target ${target}`);

      if (list[idx] === target) {
        clearInterval(timerRef.current);
        setIsAnimating(false);
        setStepLog(`🎉 Target ${target} FOUND at index node[${idx}]!`);
        toast.success(`Found ${target} at index ${idx}!`);
        return;
      }

      idx++;
    }, Math.max(speed, 200));
  };

  const codeSnippets = [
    "ListNode* next = curr->next; // 1. Save next node",
    "curr->next = prev;          // 2. Reverse link (points ⬅ backward)",
    "prev = curr;                // 3. Move prev pointer",
    "curr = next;                // 4. Move curr pointer"
  ];

  return (
    <div className="space-y-4 font-mono text-xs select-none">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.02] p-3 rounded-2xl border theme-border">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Value"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isAnimating}
            className="w-24 bg-black/50 theme-border text-xs rounded-xl px-3 py-1.5 font-bold theme-text focus:outline-none focus:border-indigo-500 border"
          />
          <Button onClick={insertHead} disabled={isAnimating} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs font-mono text-white">
            + Insert Head
          </Button>
          <Button onClick={insertTail} disabled={isAnimating} size="sm" variant="outline" className="text-xs font-mono theme-border">
            Insert Tail
          </Button>
          <Button onClick={removeHead} disabled={isAnimating} size="sm" variant="outline" className="text-xs font-mono text-rose-400 theme-border">
            Remove Head
          </Button>
        </div>

        {/* Algorithm & Speed Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {isAnimating ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={togglePause}
                size="sm"
                className={`text-xs font-mono font-bold text-white shadow-lg px-4 py-2 rounded-xl transition-all duration-200 ${
                  isPaused
                    ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30 ring-2 ring-emerald-400/50"
                    : "bg-rose-600 hover:bg-rose-500 shadow-rose-500/30"
                }`}
              >
                {isPaused ? "▶ Resume" : "⏸ Pause"}
              </Button>
              <Button onClick={stopAnimation} size="sm" variant="outline" className="text-xs font-mono text-zinc-400 theme-border">
                ⏹ Reset
              </Button>
            </div>
          ) : (
            <>
              <span className="text-[10px] theme-text-muted font-bold mr-1">Algorithms:</span>
              <Button onClick={animateReverse} size="sm" variant="outline" className="text-xs font-mono text-emerald-400 theme-border border-emerald-500/30">
                🔄 Reverse List
              </Button>
              <Button onClick={animateFindMiddle} size="sm" variant="outline" className="text-xs font-mono text-amber-400 theme-border border-amber-500/30">
                🐢🐇 Find Middle
              </Button>
              <Button onClick={animateTraversal} size="sm" variant="outline" className="text-xs font-mono text-indigo-400 theme-border border-indigo-500/30">
                🚶 Traverse
              </Button>
              <Button onClick={animateSearch} size="sm" variant="outline" className="text-xs font-mono text-purple-400 theme-border border-purple-500/30">
                🔎 Search
              </Button>
            </>
          )}

          {/* Speed Slider */}
          <div className="flex items-center gap-1.5 border-l theme-border pl-2 ml-1">
            <span className="text-[10px] theme-text-muted font-bold">Speed:</span>
            <input
              type="range"
              min="100"
              max="900"
              step="50"
              value={1000 - speed}
              onChange={(e) => setSpeed(1000 - Number(e.target.value))}
              className="w-20 accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Reversal Code Execution Tracker */}
      {isAnimating && activeCodeLine >= 0 && (
        <div className="theme-card p-3 rounded-2xl border theme-border space-y-1.5">
          <div className="text-[10px] font-bold theme-text uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> Reversal C++ Code Tracker
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
            {codeSnippets.map((snippet, idx) => (
              <div
                key={idx}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                  activeCodeLine === idx
                    ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold shadow-md"
                    : "bg-white/[0.02] text-zinc-500 border border-white/5"
                }`}
              >
                {activeCodeLine === idx && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-2 animate-pulse" />}
                {snippet}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Reversal Partition Visualizer OR Standard Chain Visualizer */}
      {isReversing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Sub-List: Reversed Portion */}
          <div className="theme-card p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/10 space-y-2">
            <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between border-b border-emerald-500/20 pb-1.5">
              <span>⬅ REVERSED PORTION (prev = {reversedList.length > 0 ? reversedList[0] : "NULL"})</span>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">{reversedList.length} nodes</span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto py-5 px-1 custom-scrollbar min-h-[110px]">
              {reversedList.length === 0 && <span className="text-zinc-500 italic text-xs">NULL</span>}
              {reversedList.map((val, idx) => (
                <React.Fragment key={idx}>
                  <div className="relative flex flex-col items-center shrink-0">
                    {idx === 0 && (
                      <span className="absolute -top-7 bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg border border-blue-300 animate-bounce">
                        🔵 prev
                      </span>
                    )}
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 font-bold flex items-center justify-center text-sm shadow-md">
                      {val}
                    </div>
                  </div>
                  <span className="text-emerald-400 font-extrabold text-sm shrink-0">➔</span>
                </React.Fragment>
              ))}
              {reversedList.length > 0 && <span className="text-zinc-500 font-bold text-xs shrink-0">NULL</span>}
            </div>
          </div>

          {/* Right Sub-List: Remaining Portion */}
          <div className="theme-card p-4 rounded-2xl border border-amber-500/40 bg-amber-950/10 space-y-2">
            <div className="text-[11px] font-bold text-amber-400 flex items-center justify-between border-b border-amber-500/20 pb-1.5">
              <span>➔ REMAINING PORTION (curr = {remainingList.length > 0 ? remainingList[0] : "NULL"})</span>
              <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">{remainingList.length} nodes</span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto py-5 px-1 custom-scrollbar min-h-[110px]">
              {remainingList.length === 0 && <span className="text-zinc-500 italic text-xs">NULL</span>}
              {remainingList.map((val, idx) => (
                <React.Fragment key={idx}>
                  <div className="relative flex flex-col items-center shrink-0">
                    {idx === 0 && (
                      <span className="absolute -top-7 bg-amber-500 text-black text-[9px] font-bold px-2 py-0.5 rounded shadow-lg border border-amber-300 animate-bounce">
                        🟡 curr
                      </span>
                    )}
                    {idx === 1 && (
                      <span className="absolute -top-7 bg-emerald-500 text-black text-[9px] font-bold px-2 py-0.5 rounded shadow-lg border border-emerald-300 animate-bounce">
                        🟢 next
                      </span>
                    )}
                    <div className={`w-14 h-14 rounded-2xl border font-bold flex items-center justify-center text-sm shadow-md ${
                      idx === 0 ? "bg-amber-500/20 border-amber-400 text-amber-200" :
                      idx === 1 ? "bg-emerald-500/20 border-emerald-400 text-emerald-200" :
                      "bg-white/[0.03] border-white/10 text-zinc-300"
                    }`}>
                      {val}
                    </div>
                  </div>
                  {idx < remainingList.length - 1 && <span className="text-zinc-500 font-bold text-sm shrink-0">➔</span>}
                </React.Fragment>
              ))}
              {remainingList.length > 0 && <><span className="text-zinc-500 font-bold text-sm shrink-0">➔</span><span className="text-zinc-500 font-bold text-xs shrink-0">NULL</span></>}
            </div>
          </div>
        </div>
      ) : (
        /* Standard Linked List Chain Canvas */
        <div className="theme-card rounded-2xl border theme-border p-5 space-y-3">
          <div className="flex items-center justify-between text-[11px] border-b theme-border pb-2">
            <span className="font-bold theme-text uppercase flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Singly Linked List ({list.length} nodes)
            </span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> <span className="theme-text-muted">prev</span></span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> <span className="theme-text-muted">curr / slow</span></span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> <span className="theme-text-muted">next / fast</span></span>
            </div>
          </div>

          {/* Scrollable Node Chain */}
          <div ref={containerRef} className="overflow-x-auto py-8 px-2 flex items-center gap-4 custom-scrollbar min-h-[160px] scroll-smooth">
            <div className="font-bold text-[10px] text-indigo-400 shrink-0 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1.5 rounded-lg border border-indigo-500/20">
              HEAD
            </div>

            {list.length === 0 && <div className="text-zinc-500 italic text-xs ml-4">List is empty. Add elements above!</div>}

            {list.map((v, i) => {
              const isPrev = activePrev === v;
              const isCurr = activeCurr === v;
              const isNext = activeNext === v;
              const isSlow = slowIdx === i;
              const isFast = fastIdx === i;

              return (
                <React.Fragment key={i}>
                  <div ref={(el) => (nodeRefs.current[i] = el)} className="relative flex flex-col items-center shrink-0">
                    {/* Floating Pointer Badges */}
                    <div className="absolute -top-8 flex items-center gap-1 z-10">
                      {isPrev && (
                        <span className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-lg border border-blue-300 animate-bounce">
                          🔵 prev
                        </span>
                      )}
                      {isCurr && (
                        <span className="bg-amber-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-md shadow-lg border border-amber-300 animate-bounce">
                          🟡 curr
                        </span>
                      )}
                      {isNext && (
                        <span className="bg-emerald-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-md shadow-lg border border-emerald-300 animate-bounce">
                          🟢 next
                        </span>
                      )}
                      {isSlow && (
                        <span className="bg-amber-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-md shadow-lg border border-amber-300 flex items-center gap-0.5">
                          🐢 slow
                        </span>
                      )}
                      {isFast && (
                        <span className="bg-emerald-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-md shadow-lg border border-emerald-300 flex items-center gap-0.5">
                          🐇 fast
                        </span>
                      )}
                    </div>

                    {/* Node Box */}
                    <div
                      className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border font-mono transition-all duration-300 ${
                        isSlow && !isFast
                          ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-xl shadow-amber-500/40 scale-110"
                          : isCurr
                          ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow-xl shadow-amber-500/40 scale-105"
                          : isPrev
                          ? "bg-blue-500/20 border-blue-400 text-blue-200 shadow-xl shadow-blue-500/40"
                          : isNext
                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-xl shadow-emerald-500/40"
                          : i === 0
                          ? "bg-indigo-600/20 border-indigo-400/50 text-indigo-200"
                          : i === list.length - 1
                          ? "bg-violet-600/20 border-violet-400/50 text-violet-200"
                          : "bg-white/[0.03] border-white/10 text-zinc-300"
                      }`}
                    >
                      <span className="text-base font-bold">{v}</span>
                      <span className="text-[9px] opacity-60">node[{i}]</span>
                    </div>
                  </div>

                  {/* Arrow Link Pointer */}
                  {i < list.length - 1 && (
                    <div className="flex flex-col items-center justify-center shrink-0 px-0.5">
                      <span className="text-zinc-600 font-bold text-sm">
                        ➔
                      </span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {list.length > 0 && (
              <>
                <div className="text-zinc-500 font-bold shrink-0 text-sm">➔</div>
                <div className="font-bold text-[10px] text-zinc-500 shrink-0 uppercase tracking-widest bg-white/[0.04] px-2.5 py-1.5 rounded-lg border theme-border">
                  NULL
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Execution Step Log */}
      {stepLog && (
        <div className="theme-card p-3 rounded-2xl border theme-border flex items-center justify-between">
          <div className="text-xs font-semibold theme-text flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {stepLog}
          </div>
        </div>
      )}

      {/* Traversal Visited Output Log */}
      {visitedSeq.length > 0 && (
        <div className="theme-card p-3 rounded-2xl border theme-border space-y-1.5">
          <div className="text-[11px] font-bold theme-text uppercase tracking-wider">Visited Sequence:</div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {visitedSeq.map((v, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                {v} {i < visitedSeq.length - 1 && <span className="text-indigo-400 ml-1">➔</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="font-mono text-xs theme-text-muted px-4 py-2.5 rounded-xl bg-white/[0.02] border theme-border flex items-center justify-between">
        <span>Singly Linked List: Head ➔ Nodes ➔ NULL</span>
        <span className="text-[11px]">Insert/Delete Head: O(1) | Reverse: O(n) | Search/Find Middle: O(n)</span>
      </div>
    </div>
  );
}

/* =========================================================================
   7. HASH TABLE VISUALIZER
   ========================================================================= */
function HashTableVisualizer() {
  const SIZE = 8;
  const [table, setTable] = useState(Array(SIZE).fill(null).map(() => []));
  const [inputKey, setInputKey] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [highlighted, setHighlighted] = useState(null);

  const hash = (key) => {
    let h = 0;
    for (const c of String(key)) h = (h * 31 + c.charCodeAt(0)) % SIZE;
    return h;
  };

  const insertKV = () => {
    const k = inputKey.trim(); const v = inputVal.trim() || "✓";
    if (!k) return;
    const idx = hash(k);
    setTable((t) => {
      const nt = t.map((b) => [...b]);
      const existing = nt[idx].findIndex((e) => e.key === k);
      if (existing >= 0) nt[idx][existing].val = v;
      else nt[idx].push({ key: k, val: v });
      return nt;
    });
    setHighlighted(idx);
    setTimeout(() => setHighlighted(null), 1200);
    setInputKey(""); setInputVal("");
    toast.success(`Inserted "${k}" → bucket ${idx}`);
  };

  const searchKV = () => {
    const k = inputKey.trim(); if (!k) return;
    const idx = hash(k);
    const found = table[idx].find((e) => e.key === k);
    setHighlighted(idx);
    toast[found ? "success" : "error"](found ? `Found "${k}" = "${found.val}" in bucket ${idx}` : `"${k}" not found`);
    setTimeout(() => setHighlighted(null), 1500);
  };

  const deleteKV = () => {
    const k = inputKey.trim(); if (!k) return;
    const idx = hash(k);
    setTable((t) => { const nt = t.map((b) => [...b]); nt[idx] = nt[idx].filter((e) => e.key !== k); return nt; });
    toast.info(`Deleted "${k}"`);
    setInputKey("");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 bg-white/[0.02] p-3 rounded-xl border border-white/5">
        <input type="text" placeholder="Key" value={inputKey} onChange={(e) => setInputKey(e.target.value)}
          className="w-24 bg-black/50 border border-white/10 text-xs rounded-lg px-3 py-1.5 font-mono text-white" />
        <input type="text" placeholder="Value" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
          className="w-24 bg-black/50 border border-white/10 text-xs rounded-lg px-3 py-1.5 font-mono text-white" />
        <Button onClick={insertKV} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs font-mono"><Plus className="w-3.5 h-3.5 mr-1" />Insert</Button>
        <Button onClick={searchKV} size="sm" variant="outline" className="text-xs font-mono text-amber-400"><Search className="w-3.5 h-3.5 mr-1" />Search</Button>
        <Button onClick={deleteKV} size="sm" variant="outline" className="text-xs font-mono text-rose-400"><Trash2 className="w-3.5 h-3.5 mr-1" />Delete</Button>
      </div>
      <div className="grid grid-cols-1 gap-1.5">
        {table.map((bucket, i) => (
          <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-xs font-mono transition-all ${
            highlighted === i ? "border-indigo-400/60 bg-indigo-500/10" : "border-white/5 bg-black/20"
          }`}>
            <span className="w-6 text-center text-zinc-500 font-bold">{i}</span>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-1.5 flex-wrap flex-1">
              {bucket.length === 0
                ? <span className="text-zinc-700">—</span>
                : bucket.map((e, j) => (
                  <span key={j} className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                    {e.key}: {e.val}
                  </span>
                ))
              }
            </div>
            {bucket.length > 1 && <span className="text-amber-400 text-[10px]">collision ({bucket.length})</span>}
          </div>
        ))}
      </div>
      <div className="font-mono text-xs text-zinc-500 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
        Hash function: h(key) = Σ(char × 31) mod {SIZE}. Chaining handles collisions. Insert/Search/Delete: O(1) avg.
      </div>
    </div>
  );
}

/* =========================================================================
   OFFLINE FALLBACK KB FOR ALGOBOT
   ========================================================================= */
function getOfflineFallback(query, category) {
  const q = query.toLowerCase();
  if (q.includes("big-o") || q.includes("complexity")) {
    return `## Big-O Complexity for ${category}\n\n| Operation | Time | Space |\n|-----------|------|-------|\n| Access | O(1) | — |\n| Search | O(n) | O(1) |\n| Insert | O(1) | O(1) |\n| Delete | O(n) | O(1) |\n\n**Key rule**: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)`;
  }
  if (q.includes("sort")) {
    return `## Sorting Algorithms\n\n\`\`\`js\n// Bubble Sort O(n²)\nfunction bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++)\n    for (let j = 0; j < arr.length-i-1; j++)\n      if (arr[j] > arr[j+1]) [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n  return arr;\n}\n\`\`\`\n\n**Comparison**: Merge Sort O(n log n) is fastest stable. Quick Sort O(n log n) avg is fastest in practice.`;
  }
  if (q.includes("bfs") || q.includes("breadth")) {
    return `## Breadth-First Search (BFS)\n\nUses a **queue**. Explores neighbors level-by-level.\n\n\`\`\`js\nfunction bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  while (queue.length) {\n    const node = queue.shift();\n    console.log(node);\n    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n}\n\`\`\`\n\n**Time**: O(V+E) | **Use**: shortest path in unweighted graph, level-order traversal`;
  }
  if (q.includes("dfs") || q.includes("depth")) {
    return `## Depth-First Search (DFS)\n\nUses a **stack** (or recursion). Goes deep before backtracking.\n\n\`\`\`js\nfunction dfs(graph, node, visited = new Set()) {\n  visited.add(node);\n  console.log(node);\n  for (const neighbor of graph[node]) {\n    if (!visited.has(neighbor)) dfs(graph, neighbor, visited);\n  }\n}\n\`\`\`\n\n**Time**: O(V+E) | **Use**: cycle detection, topological sort, maze solving`;
  }
  if (q.includes("dijkstra")) {
    return `## Dijkstra's Algorithm\n\nGreedy shortest path from a source to all nodes.\n\n**Key idea**: Always process the unvisited node with the smallest known distance.\n\n**Time**: O((V+E) log V) with min-heap\n**Limitation**: Doesn't work with negative weights (use Bellman-Ford instead).\n\nNode labels in the visualizer show the current shortest distance from start node A.`;
  }
  if (q.includes("tasksync") || q.includes("feature")) {
    return `## TaskSync Features\n\n- **Tasks**: Create, edit, complete, delete with priorities and due dates\n- **Calendar**: Visual timeline of your scheduled tasks\n- **Analytics**: Charts showing productivity, completion rates, categories\n- **DSA Lab**: Interactive visualizer for 7 data structures\n- **AlgoBot AI**: This AI assistant for coding & algorithm help\n- **Settings**: Theme, notifications, AI API key, data export`;
  }
  return `## ${category} — Quick Reference\n\nI'm running in offline mode. I can answer questions about:\n- Sorting algorithms (bubble, merge, quick, insertion, selection)\n- BFS / DFS traversals\n- Dijkstra's shortest path\n- Prim's and Kruskal's MST\n- Big-O complexity\n- TaskSync features\n\nTry asking something specific about any of these topics!`;
}

/* =========================================================================
   ALGOBOT AI CARD
   ========================================================================= */
function AlgoBotCard({ activeCategory }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I'm AlgoBot AI — your free DSA & TaskSync expert. No API key needed! Ask me anything about algorithms, Big-O complexity, code, or any TaskSync feature." }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const askBot = async (promptText) => {
    const query = promptText || inputMsg;
    if (!query.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setInputMsg("");
    setLoading(true);

    const systemPrompt = `You are AlgoBot, an expert AI DSA Tutor & Code Assistant embedded inside TaskSync app. The user is currently viewing the "${activeCategory}" module. TaskSync features: Array sorting/searching visualizers (Bubble, Selection, Insertion, Quick, Merge Sort; Binary & Linear Search), Stacks (LIFO), Queues (FIFO), Binary Search Trees (BST traversals), Graph algorithms (BFS, DFS, Dijkstra, Prim, Kruskal), Linked Lists, Hash Tables, Task Management, Calendar, AI Insights, Analytics. Answer concisely with code examples in JS, Python, or C++ when relevant.`;

    try {
      const res = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query }
          ],
          model: "openai",
          private: true
        })
      });
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 10) {
          setMessages((prev) => [...prev, { role: "bot", text }]);
          setLoading(false);
          return;
        }
      }
    } catch (e) {}

    setMessages((prev) => [...prev, { role: "bot", text: getOfflineFallback(query, activeCategory) }]);
    setLoading(false);
  };

  const renderMsg = (text) => {
    return text
      .replace(/```(\w+)?\n?([\s\S]*?)```/g, (_, lang, code) =>
        `<pre class="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-emerald-300 overflow-x-auto my-2 whitespace-pre">${code.trim()}</pre>`)
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-indigo-300 px-1 rounded text-xs font-mono">$1</code>')
      .replace(/^## (.+)$/gm, '<div class="font-bold text-white text-sm mt-2 mb-1">$1</div>')
      .replace(/^- (.+)$/gm, '<div class="flex gap-2 text-zinc-300"><span class="text-indigo-400">•</span><span>$1</span></div>')
      .replace(/\n/g, "<br/>");
  };

  const quickQuestions = [
    `Explain Big-O complexity for ${activeCategory}`,
    `Show me ${activeCategory} code in JavaScript`,
    "What features does TaskSync have?"
  ];

  return (
    <>
      <div className="flex justify-end pt-2">
        <Button
          onClick={() => setOpen(true)}
          size="sm"
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-mono text-white shadow-lg shadow-indigo-500/20 px-4 py-2 rounded-xl font-bold"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Talk with AI
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm grid place-items-center p-4">
          <div className="bg-[#0E0E12] border border-white/10 rounded-2xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl overflow-hidden font-sans">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 grid place-items-center text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">AlgoBot AI Code Assistant</h3>
                  <p className="text-[10px] font-mono text-zinc-400">Powered by Pollinations.ai • Free • No API Key • Context: {activeCategory}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-white text-xs font-mono px-2 py-1">✕ Close</button>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full grid place-items-center text-xs shrink-0 ${
                    m.role === "bot" ? "bg-indigo-600/30 text-indigo-400" : "bg-white/10 text-zinc-400"
                  }`}>{m.role === "bot" ? "🤖" : "👤"}</div>
                  <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.role === "bot" ? "bg-white/[0.04] border border-white/5 text-zinc-200" : "bg-indigo-600/20 border border-indigo-500/30 text-indigo-100"
                  }`} dangerouslySetInnerHTML={{ __html: renderMsg(m.text) }} />
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-600/30 grid place-items-center text-xs">🤖</div>
                  <div className="bg-white/[0.04] border border-white/5 rounded-xl px-3.5 py-2.5">
                    <div className="flex gap-1">
                      {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/5 bg-black/20 space-y-2">
              <div className="flex gap-1.5 flex-wrap">
                {quickQuestions.map((q, i) => (
                  <button key={i} onClick={() => askBot(q)}
                    className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-zinc-400 hover:text-white hover:border-indigo-500/50 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about DSA, algorithms, code, or TaskSync…"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askBot()}
                  className="flex-1 bg-black/60 border border-white/10 text-xs rounded-xl px-3 py-2 font-mono text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <Button onClick={() => askBot()} disabled={loading} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-xs font-mono">
                  {loading ? "…" : "Send"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================================
   CUSTOM CODE TERMINAL VISUALIZER (Universal Code & Array Animator)
   ========================================================================= */
function CustomCodeTerminalVisualizer() {
  const presetCodes = {
    custom: `// Custom C++ Array Code Canvas
// Available variables: arr (int[]), n (int size = arr.length)
// Operations: swap(arr[i], arr[j]), cout << "msg" << endl;, arr.push_back(val), arr.pop_back()

for (int i = 0; i < n; i++) {
    if (arr[i] > 30) {
        cout << "Element > 30 at index " << i << ": " << arr[i] << endl;
    }
}`,
    bubblesort: `// Bubble Sort Algorithm
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
    selectionsort: `// Selection Sort Algorithm
void selectionSort(int arr[], int n) {
    int minIdx = 0;
    for (int i = 0; i < n - 1; i++) {
        minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
    reversal: `// Array Reversal (Two Pointer)
void reverseArray(int arr[], int n) {
    int left = 0;
    int right = n - 1;
    while (left < right) {
        swap(arr[left], arr[right]);
        left++;
        right--;
    }
}`,
    insertionsort: `// Insertion Sort
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    pushpop: `// Dynamic Push & Pop
arr.push_back(85);
cout << "Pushed 85" << endl;
arr.push_back(99);
cout << "Pushed 99" << endl;
arr.pop_back();
cout << "Popped last element" << endl;`
  };

  const presetLabels = {
    custom: "✨ Custom C++ Code (Blank Canvas)",
    bubblesort: "Preset: Bubble Sort",
    selectionsort: "Preset: Selection Sort",
    reversal: "Preset: Reverse Array",
    insertionsort: "Preset: Insertion Sort",
    pushpop: "Preset: Push & Pop"
  };

  const [customArrayStr, setCustomArrayStr] = useState("42, 18, 88, 25, 7, 63, 31");
  const [code, setCode] = useState(presetCodes.bubblesort);
  const [preset, setPreset] = useState("bubblesort");
  const [frames, setFrames] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(350);
  const [errorMsg, setErrorMsg] = useState("");
  const timerRef = useRef(null);
  const consoleEndRef = useRef(null);
  const editorRef = useRef(null);

  const loadPreset = (key) => {
    setPreset(key);
    setCode(presetCodes[key] || "");
    setFrames([]);
    setCurrentIdx(0);
    setIsPlaying(false);
    setErrorMsg("");
  };

  const randomizeArray = () => {
    const a = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    setCustomArrayStr(a.join(", "));
    setFrames([]);
    setCurrentIdx(0);
    setIsPlaying(false);
    toast.success("New random array!");
  };

  /* ── Universal C++ → Instrumented JS Transpiler ── */
  const compileAndRun = () => {
    setIsPlaying(false);
    setErrorMsg("");
    setFrames([]);
    setCurrentIdx(0);

    const parsedArr = customArrayStr.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
    if (parsedArr.length === 0) { toast.error("Enter a valid array, e.g. 42, 18, 88"); return; }

    const sourceLines = code.split("\n");
    const recorded = [];
    const maxSteps = 600;
    let stepCount = 0;
    let currentSrcLine = -1;

    const recordFrame = (arrSnap, hl = [], hlType = "compare", msg = "") => {
      if (stepCount++ > maxSteps) return;
      recorded.push({ arr: [...arrSnap], highlighted: hl, hlType, srcLine: currentSrcLine, step: msg });
    };

    try {
      const arrTarget = [...parsedArr];
      const n = arrTarget.length;

      const funcNames = [];
      const jsLines = [];

      for (let si = 0; si < sourceLines.length; si++) {
        let line = sourceLines[si];
        const trimmed = line.trim();

        if (!trimmed || /^#include/.test(trimmed) || /^using\s+namespace/.test(trimmed)) {
          jsLines.push(`__line(${si});`);
          continue;
        }

        const fnHeaderMatch = line.match(/^\s*(?:void|int|float|double|char|bool|auto)\s+(\w+)\s*\([^)]*\)\s*(\{?)\s*$/);
        if (fnHeaderMatch) {
          const fnName = fnHeaderMatch[1];
          funcNames.push(fnName);
          const hasBrace = fnHeaderMatch[2] === "{";
          jsLines.push(`__line(${si}); function ${fnName}(arr, n) ${hasBrace ? "{" : ""}`);
          continue;
        }

        let jsLine = line;

        jsLine = jsLine.replace(/\b(int|double|float|long|short|char|boolean|bool|auto|size_t|unsigned)\b(\s*\[\s*\])?/g, "let");
        jsLine = jsLine.replace(/\blet\s+let\b/g, "let");

        jsLine = jsLine.replace(/(?:std::)?swap\s*\(\s*(.*?)\s*,\s*(.*?)\s*\)/g, "__swap($1, $2)");

        jsLine = jsLine.replace(/arr\.push_back\(([^)]+)\)/g, "__push($1)");
        jsLine = jsLine.replace(/arr\.pop_back\(\)/g, "__pop()");

        jsLine = jsLine.replace(/cout\s*<<\s*(.*?);/g, (m, body) => {
          const parts = body.split("<<").map(s => s.trim().replace(/^endl$/, '""').replace(/^"\\n"$/, '""')).filter(Boolean);
          return `__cout(${parts.join(", ")}) ;`;
        });

        jsLine = jsLine.replace(/\.size\(\)/g, ".length");

        jsLines.push(`__line(${si}); ${jsLine}`);
      }

      const jsCode = jsLines.join("\n");

      const arrProxy = new Proxy(arrTarget, {
        get(target, prop) {
          if (prop === "length") return target.length;
          if (typeof prop === "string" && !isNaN(Number(prop))) {
            const idx = Number(prop);
            if (idx >= 0 && idx < target.length) {
              recordFrame(target, [idx], "compare", `Accessed arr[${idx}] (${target[idx]})`);
              return target[idx];
            }
          }
          return target[prop];
        },
        set(target, prop, value) {
          if (typeof prop === "string" && !isNaN(Number(prop))) {
            const idx = Number(prop);
            target[idx] = Number(value);
            recordFrame(target, [idx], "swap", `Set arr[${idx}] = ${value} → [${target.join(", ")}]`);
            return true;
          }
          target[prop] = value;
          return true;
        }
      });

      const __swap = (i, j) => {
        let idx1 = Number(i);
        let idx2 = Number(j);
        if (isNaN(idx1)) idx1 = arrTarget.indexOf(i);
        if (isNaN(idx2)) idx2 = arrTarget.indexOf(j);

        if (idx1 >= 0 && idx2 >= 0 && idx1 < arrTarget.length && idx2 < arrTarget.length) {
          recordFrame(arrTarget, [idx1, idx2], "compare", `Comparing arr[${idx1}] (${arrTarget[idx1]}) & arr[${idx2}] (${arrTarget[idx2]})`);
          const temp = arrTarget[idx1];
          arrTarget[idx1] = arrTarget[idx2];
          arrTarget[idx2] = temp;
          recordFrame(arrTarget, [idx1, idx2], "swap", `Swapped arr[${idx1}] ↔ arr[${idx2}] → [${arrTarget.join(", ")}]`);
        }
      };

      const __push = (val) => {
        arrTarget.push(val);
        recordFrame(arrTarget, [arrTarget.length - 1], "swap", `Pushed ${val} → [${arrTarget.join(", ")}]`);
      };

      const __pop = () => {
        const val = arrTarget.pop();
        recordFrame(arrTarget, [], "swap", `Popped ${val} → [${arrTarget.join(", ")}]`);
        return val;
      };

      const __cout = (...args) => {
        const msg = args.map(a => String(a)).join("");
        recordFrame(arrTarget, [], "compare", `[cout] ${msg}`);
      };

      const __line = (lineNum) => {
        currentSrcLine = lineNum;
      };

      recordFrame(arrTarget, [], "compare", `Initial Array: [${arrTarget.join(", ")}] (n = ${n})`);

      const fullScript = `
        function swap(a, b) { __swap(a, b); }
        ${jsCode}
        ${funcNames.map(f => `if (typeof ${f} === 'function') ${f}(arr, n);`).join("\n")}
      `;

      const runner = new Function("arr", "n", "__swap", "__push", "__pop", "__cout", "__line", fullScript);
      runner(arrProxy, n, __swap, __push, __pop, __cout, __line);

      recordFrame(arrTarget, [], "compare", `✅ Execution Complete! Final Array: [${arrTarget.join(", ")}]`);

      if (recorded.length > 0) {
        setFrames(recorded);
        setCurrentIdx(0);
        setIsPlaying(true);
        toast.success(`Compiled C++ Code → ${recorded.length} animation steps generated!`);
      } else {
        toast.info("Code executed, but produced no array animations.");
      }
    } catch (err) {
      setErrorMsg(err.message);
      toast.error("Compilation Error: " + err.message);
    }
  };

  /* ── Playback timer ── */
  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      timerRef.current = setTimeout(() => {
        setCurrentIdx(prev => {
          if (prev < frames.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, currentIdx, frames, speed]);

  useEffect(() => { consoleEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [currentIdx]);

  const previewArr = customArrayStr.split(",").map(x => parseInt(x.trim())).filter(x => !isNaN(x));
  const currentFrame = frames[currentIdx] || {
    arr: previewArr.length > 0 ? previewArr : [42, 18, 88, 25, 7, 63, 31],
    highlighted: [], hlType: "compare", srcLine: -1,
    step: "Write C++ code → click ▶ Compile & Run"
  };
  const maxVal = Math.max(...currentFrame.arr, 1);
  const codeLines = code.split("\n");

  const getBarColor = (i) => {
    const isHL = currentFrame.highlighted.includes(i);
    if (!isHL) return { bg: "#4f8ef7", shadow: "0 0 8px rgba(79,142,247,0.4)" };
    if (currentFrame.hlType === "swap") return { bg: "#ff5f6d", shadow: "0 0 16px rgba(255,95,109,0.7)" };
    return { bg: "#f8c23a", shadow: "0 0 14px rgba(248,194,58,0.6)" };
  };

  /* ── Sync textarea scroll with line numbers ── */
  const lineNumRef = useRef(null);
  const handleEditorScroll = (e) => {
    if (lineNumRef.current) lineNumRef.current.scrollTop = e.target.scrollTop;
  };

  return (
    <div className="space-y-4 font-mono text-xs select-none">
      {/* Array Input & Controls */}
      <div className="theme-card p-4 rounded-2xl border theme-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold theme-text text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> C++ Array Code Editor & Visualizer
          </span>
          <Button onClick={randomizeArray} size="sm" variant="outline" className="theme-border theme-text text-xs">
            🎲 Randomize
          </Button>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <label className="block text-[11px] theme-text-muted mb-1 font-bold">Array Elements (comma-separated):</label>
            <input type="text" value={customArrayStr} onChange={e => setCustomArrayStr(e.target.value)}
              placeholder="e.g. 42, 18, 88, 25, 7, 63, 31"
              className="w-full bg-white/[0.04] theme-border rounded-xl px-3 py-2 text-xs font-bold theme-text focus:outline-none focus:border-indigo-500 border" />
          </div>
          <div className="w-full md:w-auto flex items-end">
            <Button onClick={compileAndRun}
              className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs shadow-lg px-5 py-5 rounded-xl font-bold">
              <Play className="w-4 h-4 mr-1.5" /> ▶ Compile & Run
            </Button>
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 theme-card p-3 rounded-2xl border theme-border">
        <div className="flex items-center gap-2">
          <span className="font-bold theme-text text-[11px]">Load Template:</span>
          <select value={preset} onChange={e => loadPreset(e.target.value)}
            className="bg-white/[0.04] theme-border theme-text rounded-xl px-3 py-1.5 text-xs font-bold border">
            {Object.entries(presetLabels).map(([k, v]) => (
              <option key={k} value={k} className="bg-[#1a1d27] text-white">{v}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button size="icon" variant="outline" onClick={() => { setIsPlaying(false); setCurrentIdx(Math.max(0, currentIdx - 1)); }}
              disabled={currentIdx === 0} className="w-8 h-8 theme-border theme-text"><SkipBack className="w-3.5 h-3.5" /></Button>
            <Button size="icon" variant="outline" onClick={() => setIsPlaying(!isPlaying)}
              disabled={frames.length === 0} className="w-8 h-8 theme-border theme-text">
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </Button>
            <Button size="icon" variant="outline" onClick={() => { setIsPlaying(false); setCurrentIdx(Math.min(frames.length - 1, currentIdx + 1)); }}
              disabled={currentIdx >= frames.length - 1} className="w-8 h-8 theme-border theme-text"><SkipForward className="w-3.5 h-3.5" /></Button>
          </div>
          <span className="text-[10px] theme-text-muted font-bold">Step {frames.length > 0 ? currentIdx + 1 : 0} / {frames.length}</span>
          <div className="flex items-center gap-1.5">
            <span className="theme-text-muted text-[10px]">Speed:</span>
            <input type="range" min="60" max="800" step="20" value={860 - speed}
              onChange={e => setSpeed(860 - Number(e.target.value))} className="w-20 accent-emerald-500 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* ═══ Main 2-Column Layout ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* LEFT: Editable C++ Code Editor with Line Numbers & Active Line Highlight */}
        <div className="space-y-3">
          <div className="theme-card rounded-2xl border theme-border overflow-hidden flex flex-col">
            {/* Editor Title Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b theme-border bg-white/[0.02]">
              <span className="font-bold theme-text flex items-center gap-2 text-[12px]">
                <Code2 className="w-4 h-4 text-emerald-400" /> C++ Code Editor
                <span className="text-[9px] theme-text-muted font-normal ml-1">— write or paste your C++ array code</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
            </div>

            {/* Editor Body: line numbers + textarea */}
            <div className="relative flex" style={{ height: "340px" }}>
              {/* Line Numbers Column */}
              <div ref={lineNumRef} className="w-11 shrink-0 overflow-hidden bg-white/[0.01] border-r border-white/5 pt-[10px] pb-[10px] select-none"
                style={{ fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace" }}>
                {codeLines.map((_, i) => {
                  const isActive = currentFrame.srcLine === i && frames.length > 0;
                  return (
                    <div key={i} className="text-right pr-2 transition-all duration-200"
                      style={{
                        lineHeight: "20px", fontSize: "11px",
                        color: isActive ? "#fbbf24" : "#4a5568",
                        backgroundColor: isActive ? "rgba(245,158,11,0.15)" : "transparent",
                        fontWeight: isActive ? "bold" : "normal"
                      }}>
                      {i + 1}
                    </div>
                  );
                })}
              </div>

              {/* Active Line Highlight Overlay (behind textarea) */}
              <div className="absolute left-11 right-0 top-0 pointer-events-none pt-[10px] pb-[10px]" style={{ zIndex: 0 }}>
                {codeLines.map((_, i) => {
                  const isActive = currentFrame.srcLine === i && frames.length > 0;
                  return (
                    <div key={i} style={{
                      height: "20px",
                      backgroundColor: isActive ? "rgba(245,158,11,0.12)" : "transparent",
                      borderLeft: isActive ? "3px solid #f59e0b" : "3px solid transparent",
                      transition: "all 0.25s ease"
                    }} />
                  );
                })}
              </div>

              {/* Textarea */}
              <textarea ref={editorRef} value={code} onChange={e => { setCode(e.target.value); setErrorMsg(""); }}
                onScroll={handleEditorScroll} spellCheck={false}
                className="flex-1 resize-none bg-transparent text-[11px] leading-[20px] p-[10px] pl-2 focus:outline-none relative"
                style={{
                  fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
                  color: "#c4cad6", caretColor: "#f59e0b", zIndex: 1, tabSize: 4
                }} />
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="px-4 py-2 bg-rose-500/10 border-t border-rose-500/30 text-rose-400 text-[11px] font-bold">
                🚨 Compile Error: {errorMsg}
              </div>
            )}
          </div>

          {/* Step Explanation Card */}
          <div className="theme-card rounded-2xl border theme-border p-4">
            <div className="text-[11px] font-bold theme-text uppercase tracking-wider flex items-center gap-2 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-violet-400" /> Step Explanation
            </div>
            <div className="text-sm font-semibold transition-all duration-300"
              style={{ color: currentFrame.step?.startsWith("✅") ? "#2dd4a0" : currentFrame.step?.startsWith("🚨") ? "#ff5f6d" : "#e2e8f0" }}>
              {currentFrame.step || "Waiting for execution..."}
            </div>
            {currentFrame.srcLine >= 0 && currentFrame.srcLine < codeLines.length && (
              <div className="mt-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                <span className="text-amber-500 font-bold">Line {currentFrame.srcLine + 1}:</span>{" "}
                <code>{codeLines[currentFrame.srcLine]?.trim()}</code>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Animated Array + Terminal Console */}
        <div className="space-y-4">
          {/* Animated Array Stage */}
          <div className="theme-card rounded-2xl border theme-border p-4 min-h-[240px]">
            <div className="flex items-center justify-between text-[11px] border-b theme-border pb-2 mb-3">
              <span className="font-bold theme-text uppercase flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Live Array Stage
              </span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f8c23a]" /> <span className="theme-text-muted">Comparing</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff5f6d]" /> <span className="theme-text-muted">Swap / Set</span></span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4f8ef7]" /> <span className="theme-text-muted">Idle</span></span>
              </div>
            </div>

            <div className="h-44 flex items-end gap-1 px-1 pb-1 overflow-hidden">
              {currentFrame.arr.map((v, i) => {
                const c = getBarColor(i);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-lg transition-all duration-300"
                      style={{ height: `${Math.max((v / maxVal) * 140, 8)}px`, backgroundColor: c.bg, boxShadow: c.shadow }} />
                    <span className="text-[10px] font-bold transition-colors duration-200"
                      style={{ color: currentFrame.highlighted.includes(i) ? (currentFrame.hlType === "swap" ? "#ff5f6d" : "#f8c23a") : "#6b7280" }}>{v}</span>
                    <span className="text-[8px]" style={{ color: "#4a5568" }}>[{i}]</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terminal Console */}
          <div className="theme-card rounded-2xl border theme-border p-4 max-h-[260px] overflow-y-auto">
            <div className="text-[11px] font-bold theme-text uppercase tracking-wider border-b theme-border pb-1.5 mb-2 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Terminal Output
            </div>
            <div className="space-y-0.5 font-mono text-[10px]">
              {frames.length > 0 ? (
                frames.slice(0, currentIdx + 1).map((f, i) => (
                  <div key={i} className="flex items-start gap-2 transition-all duration-200"
                    style={{ color: i === currentIdx ? "#e2e8f0" : "#6b7280" }}>
                    <span className="text-emerald-500 shrink-0">❯</span>
                    <span className="break-all">{f.step}</span>
                  </div>
                ))
              ) : (
                <div className="theme-text-muted italic text-[11px]">
                  Write your C++ code in the editor → click <strong>"▶ Compile & Run"</strong> to see step-by-step execution.
                </div>
              )}
              <div ref={consoleEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
