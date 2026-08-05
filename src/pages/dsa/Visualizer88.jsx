import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, GitMerge, Zap, Layers, ChevronRight, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function generateFrames(initialNums1, m, initialNums2, n) {
  const frames = [];
  let nums1 = [...initialNums1];
  let nums2 = [...initialNums2];
  
  let p1 = m - 1;
  let p2 = n - 1;
  let p = m + n - 1;
  
  // Frame 0: Init
  frames.push({
    p1, p2, p, nums1: [...nums1], 
    msg: `Init: Three pointers from the back. \np1=${p1} → end of nums1's real data.\np2=${p2} → end of nums2.\np=${p} → write position (start at last slot).`,
    codeLines: [2], algoStep: 1, action: null
  });
  
  while (p1 >= 0 && p2 >= 0) {
    let msg = "";
    let codeLines = [];
    if (nums1[p1] > nums2[p2]) {
      msg = `nums1[${p1}] = ${nums1[p1]} > nums2[${p2}] = ${nums2[p2]}\nWrite ${nums1[p1]} at position ${p}. Move p1 left.`;
      codeLines = [3, 4, 5];
      let oldP1 = p1, oldP = p;
      nums1[p] = nums1[p1];
      p--; p1--;
      frames.push({
        p1, p2, p, nums1: [...nums1], msg, codeLines, algoStep: 2, action: { from: 'nums1', idx: oldP1, to: oldP, val: nums1[oldP] }
      });
    } else {
      msg = `nums2[${p2}] = ${nums2[p2]} >= nums1[${p1}] = ${nums1[p1]}\nWrite ${nums2[p2]} at position ${p}. Move p2 left.`;
      codeLines = [3, 4, 6, 7];
      let oldP2 = p2, oldP = p;
      nums1[p] = nums2[p2];
      p--; p2--;
      frames.push({
        p1, p2, p, nums1: [...nums1], msg, codeLines, algoStep: 2, action: { from: 'nums2', idx: oldP2, to: oldP, val: nums1[oldP] }
      });
    }
  }
  
  while (p2 >= 0) {
    let msg = `nums1 exhausted (p1 < 0).\nCopy remaining nums2[${p2}] = ${nums2[p2]} to position ${p}.`;
    let codeLines = [10];
    let oldP2 = p2, oldP = p;
    nums1[p] = nums2[p2];
    p--; p2--;
    frames.push({
      p1, p2, p, nums1: [...nums1], msg, codeLines, algoStep: 3, action: { from: 'nums2', idx: oldP2, to: oldP, val: nums1[oldP] }
    });
  }
  
  // Final frame
  frames.push({
    p1, p2, p, nums1: [...nums1], msg: "Merge complete! nums1 is fully sorted.",
    codeLines: [11], algoStep: 4, action: null
  });
  
  return frames;
}

export default function Visualizer88() {
  const [customNums1, setCustomNums1] = useState("1, 2, 3, 0, 0, 0");
  const [customM, setCustomM] = useState("3");
  const [customNums2, setCustomNums2] = useState("2, 5, 6");
  const [customN, setCustomN] = useState("3");

  const [initialData, setInitialData] = useState({
    nums1: [1, 2, 3, 0, 0, 0],
    m: 3,
    nums2: [2, 5, 6],
    n: 3
  });

  const frames = useMemo(() => {
    return generateFrames(initialData.nums1, initialData.m, initialData.nums2, initialData.n);
  }, [initialData]);

  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const totalSteps = frames.length;
  const isComplete = step >= totalSteps - 1;

  useEffect(() => {
    let timer;
    if (isPlaying && !isComplete) {
      timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, speed);
    } else if (isComplete) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, speed, isComplete]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReset = () => { setIsPlaying(false); setStep(0); };
  const handlePrev = () => setStep(prev => Math.max(0, prev - 1));
  const handleNext = () => setStep(prev => Math.min(totalSteps - 1, prev + 1));

  const handleRunCustom = () => {
    try {
      const arr1 = customNums1.split(",").map(s => parseInt(s.trim())).filter(num => !isNaN(num));
      const arr2 = customNums2.split(",").map(s => parseInt(s.trim())).filter(num => !isNaN(num));
      const parsedM = parseInt(customM);
      const parsedN = parseInt(customN);
      
      let finalNums1 = [...arr1];
      // If user only provided the `m` real elements, pad with `n` zeros automatically
      if (finalNums1.length === parsedM) {
        for(let i=0; i<parsedN; i++) finalNums1.push(0);
      }

      if (finalNums1.length === parsedM + parsedN && arr2.length === parsedN) {
        setInitialData({ nums1: finalNums1, m: parsedM, nums2: arr2, n: parsedN });
        setStep(0);
        setIsPlaying(false);
      } else {
        alert(`Make sure nums1 length is m (${parsedM}) and nums2 length is n (${parsedN}).`);
      }
    } catch(e) {}
  };

  const currentFrame = frames[step];

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-20">
      
      {/* Dynamic Header */}
      <div className="relative overflow-hidden theme-card border theme-border rounded-3xl p-8 mb-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link to="/app/guide" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium mb-4 w-fit bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" /> Back to Guide
            </Link>
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-orange-400 mb-4 tracking-tight">
              Merge Sorted Array
            </h1>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="border border-orange-500/30 text-orange-300 px-3 py-1 rounded-full bg-orange-500/10 backdrop-blur-md">LC #88</span>
              <span className="border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full bg-emerald-500/10 backdrop-blur-md flex items-center gap-1"><Zap className="w-3 h-3"/> EASY</span>
              <span className="border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full bg-purple-500/10 backdrop-blur-md">Two Pointers</span>
            </div>
          </div>

          <div className="bg-[#121629] border border-white/5 p-5 rounded-[24px] w-full md:w-auto shadow-2xl">
            <h3 className="text-[11px] text-white font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="text-zinc-400">&gt;_</span> TRY CUSTOM INPUT
            </h3>
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-end">
              
              <div className="flex flex-col gap-3">
                <input type="text" value={customNums1} onChange={(e) => setCustomNums1(e.target.value)} placeholder="nums1 (e.g. 1, 2, 3)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-purple-500 w-48 font-mono transition-colors" />
                <input type="text" value={customNums2} onChange={(e) => setCustomNums2(e.target.value)} placeholder="nums2 (e.g. 2, 5, 6)" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-purple-500 w-48 font-mono transition-colors" />
              </div>

              <div className="flex flex-col gap-3">
                <input type="text" value={customM} onChange={(e) => setCustomM(e.target.value)} placeholder="m" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-purple-500 w-16 font-mono transition-colors text-center" />
                <input type="text" value={customN} onChange={(e) => setCustomN(e.target.value)} placeholder="n" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-purple-500 w-16 font-mono transition-colors text-center" />
              </div>

              <button onClick={handleRunCustom} className="bg-[#ab5df3] hover:bg-[#b876f5] text-white px-5 py-2 h-[38px] rounded-xl text-sm font-bold transition-colors shadow-[0_0_20px_-5px_#ab5df3] self-end mb-[1px]">
                Run
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Section: Visualization & State */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          
          {/* Visualizer Canvas */}
          <div className="theme-card border theme-border rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden bg-white/[0.01]">
            
            {/* Playback Controls (Floating Top Right) */}
            <div className="absolute top-6 right-6 flex items-center gap-1 bg-black/40 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md z-20">
              <button onClick={handlePrev} disabled={step === 0} className="hover:bg-white/10 disabled:opacity-30 text-white p-2 rounded-xl transition-colors">
                <SkipBack className="w-4 h-4 fill-current" />
              </button>
              <button onClick={handlePlayPause} disabled={isComplete} className="bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-white p-3 rounded-xl transition-colors shadow-lg shadow-purple-500/30">
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button onClick={handleNext} disabled={isComplete} className="hover:bg-white/10 disabled:opacity-30 text-white p-2 rounded-xl transition-colors">
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <button onClick={handleReset} className="hover:bg-white/10 text-white p-2 rounded-xl transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-sm font-bold theme-text mb-12 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" /> Array Memory State
            </h2>

            {/* Arrays Animation Area */}
            <div className="space-y-16 pb-8">
              
              {/* NUMS1 Array */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-mono font-bold text-zinc-400 tracking-wider">NUMS1</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono">Target Array (Extra Zeros at End)</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {currentFrame.nums1.map((val, idx) => {
                    const isP1 = idx === currentFrame.p1;
                    const isP = idx === currentFrame.p;
                    const isRecentlyWritten = currentFrame.action && currentFrame.action.to === idx;
                    
                    return (
                      <div key={idx} className="relative">
                        <motion.div 
                          initial={false}
                          animate={{ 
                            scale: (isP1 || isP) ? 1.1 : 1,
                            y: (isP1 || isP) ? -5 : 0,
                            borderColor: isP ? "#f97316" : isP1 ? "#60a5fa" : isRecentlyWritten ? "#34d399" : "rgba(255,255,255,0.1)",
                            backgroundColor: isP ? "rgba(249,115,22,0.15)" : isP1 ? "rgba(96,165,250,0.15)" : isRecentlyWritten ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.03)"
                          }}
                          className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border flex items-center justify-center text-xl md:text-2xl font-bold font-mono shadow-xl backdrop-blur-md relative z-10 ${val === 0 && idx >= initialData.m && !isRecentlyWritten ? 'text-zinc-600' : 'text-white'}`}
                        >
                          {val}
                        </motion.div>
                        
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 w-full">
                          {isP1 && (
                            <motion.div layoutId="pointer-p1" className="flex flex-col items-center">
                              <div className="w-1 h-2 bg-blue-400 rounded-t-full mb-0.5" />
                              <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-400/10 px-1.5 rounded">p1</span>
                            </motion.div>
                          )}
                          {isP && (
                            <motion.div layoutId="pointer-p" className="flex flex-col items-center">
                              <div className="w-1 h-2 bg-orange-400 rounded-t-full mb-0.5" />
                              <span className="text-[10px] font-mono text-orange-400 font-bold bg-orange-400/10 px-1.5 rounded">p</span>
                            </motion.div>
                          )}
                          <span className="text-[9px] text-zinc-600 font-mono absolute top-8">{idx}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* NUMS2 Array */}
              <div>
                <div className="flex items-center gap-3 mb-6 mt-8">
                  <span className="text-xs font-mono font-bold text-zinc-400 tracking-wider">NUMS2</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-mono">Source Array</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {initialData.nums2.map((val, idx) => {
                    const isP2 = idx === currentFrame.p2;
                    const isUsed = idx > currentFrame.p2;
                    
                    return (
                      <div key={idx} className="relative">
                        <motion.div 
                          initial={false}
                          animate={{ 
                            scale: isP2 ? 1.1 : 1,
                            y: isP2 ? -5 : 0,
                            borderColor: isP2 ? "#c084fc" : "rgba(255,255,255,0.1)",
                            backgroundColor: isP2 ? "rgba(192,132,252,0.15)" : "rgba(255,255,255,0.03)",
                            opacity: isUsed ? 0.3 : 1
                          }}
                          className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl border flex items-center justify-center text-xl md:text-2xl font-bold font-mono shadow-xl backdrop-blur-md relative z-10 text-white`}
                        >
                          {val}
                        </motion.div>
                        
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 w-full">
                          {isP2 && (
                            <motion.div layoutId="pointer-p2" className="flex flex-col items-center">
                              <div className="w-1 h-2 bg-purple-400 rounded-t-full mb-0.5" />
                              <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-400/10 px-1.5 rounded">p2</span>
                            </motion.div>
                          )}
                          <span className="text-[9px] text-zinc-600 font-mono absolute top-8">{idx}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Variable Tracker */}
          <div className="theme-card border theme-border rounded-3xl p-6 bg-white/[0.01]">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Memory State</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className={`p-4 rounded-2xl border transition-colors ${currentFrame.p1 >= 0 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-black/20 border-white/5'}`}>
                <div className="text-[10px] text-zinc-500 font-mono mb-1 text-center">P1 (NUMS1)</div>
                <div className={`text-2xl font-mono font-bold text-center ${currentFrame.p1 >= 0 ? 'text-blue-400' : 'text-zinc-600'}`}>{currentFrame.p1 >= 0 ? currentFrame.p1 : "-"}</div>
              </div>
              <div className={`p-4 rounded-2xl border transition-colors ${currentFrame.p2 >= 0 ? 'bg-purple-500/10 border-purple-500/30' : 'bg-black/20 border-white/5'}`}>
                <div className="text-[10px] text-zinc-500 font-mono mb-1 text-center">P2 (NUMS2)</div>
                <div className={`text-2xl font-mono font-bold text-center ${currentFrame.p2 >= 0 ? 'text-purple-400' : 'text-zinc-600'}`}>{currentFrame.p2 >= 0 ? currentFrame.p2 : "-"}</div>
              </div>
              <div className={`p-4 rounded-2xl border transition-colors ${currentFrame.p >= 0 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-black/20 border-white/5'}`}>
                <div className="text-[10px] text-zinc-500 font-mono mb-1 text-center">P (WRITE)</div>
                <div className={`text-2xl font-mono font-bold text-center ${currentFrame.p >= 0 ? 'text-orange-400' : 'text-zinc-600'}`}>{currentFrame.p >= 0 ? currentFrame.p : "-"}</div>
              </div>
              <div className="p-4 rounded-2xl border bg-black/20 border-white/5">
                <div className="text-[10px] text-zinc-500 font-mono mb-1 text-center">WRITTEN</div>
                <div className="text-2xl font-mono font-bold text-center text-blue-400">{initialData.m + initialData.n - 1 - currentFrame.p}</div>
              </div>
            </div>
          </div>

          {/* Step Logic */}
          <div className="theme-card border theme-border rounded-3xl p-6 relative overflow-hidden bg-white/[0.01]">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-500 to-orange-500" />
            <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              💡 Step Logic
            </h3>
            
            <div className="min-h-[60px] text-sm leading-relaxed theme-text">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {isComplete ? (
                    <div className="space-y-4">
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                        <div className="text-emerald-400 font-bold mb-1 flex items-center gap-2">
                          <Zap className="w-4 h-4" /> Merged! nums1 = [{currentFrame.nums1.join(", ")}]
                        </div>
                        <div className="text-emerald-200/70 text-sm">All {initialData.m + initialData.n} elements sorted in non-decreasing order.</div>
                      </div>
                      <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-4 flex items-center gap-4">
                        <span className="text-2xl">🎉</span>
                        <div>
                          <div className="text-emerald-400 font-bold">Merged Array</div>
                          <div className="text-emerald-300 font-mono text-sm">[{currentFrame.nums1.join(", ")}]</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    currentFrame.msg.split('\n').map((line, i) => (
                      <span key={i} className={i === 0 && step > 0 ? "text-white font-bold block mb-2 font-mono" : "text-zinc-400 block"}>{line}</span>
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Progress Detailed Log */}
          <div className="theme-card border theme-border rounded-3xl p-6 relative bg-white/[0.01]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white font-mono">
                {isComplete 
                  ? `Done! nums1 = [${currentFrame.nums1.join(", ")}]` 
                  : (step === 0 ? "Initialization" : currentFrame.msg.split('\n')[0])
                }
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">{step + 1} / {totalSteps}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1 w-full bg-white/10 rounded-full mb-4 overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300" 
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>
            
            <div className="text-xs text-zinc-400 leading-relaxed font-mono">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isComplete ? (
                    <p>All {initialData.m + initialData.n} elements merged in-place.</p>
                  ) : (
                    currentFrame.msg.split('\n').slice(1).map((line, i) => (
                      <p key={i} className="mb-1">{line}</p>
                    ))
                  )}
                  {!isComplete && currentFrame.action && (
                    <p className="mt-2 text-zinc-500">
                      p1 → {currentFrame.p1}, p2 → {currentFrame.p2}, p → {currentFrame.p}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Right Section: Code & Execution */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* Mac-Style Code Window */}
          <div className="theme-card border theme-border rounded-3xl overflow-hidden shadow-2xl bg-[#0d0f14]">
            <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Solution.java</span>
            </div>
            
            <div className="p-5 font-mono text-[13px] leading-relaxed overflow-x-auto">
              <div className="text-zinc-300"><span className="text-pink-400 font-bold">public void</span> merge(<span className="text-pink-400 font-bold">int</span>[] nums1, <span className="text-pink-400 font-bold">int</span> m, <span className="text-pink-400 font-bold">int</span>[] nums2, <span className="text-pink-400 font-bold">int</span> n) {'{'}</div>
              
              <div className={`px-2 -mx-2 rounded transition-all duration-300 ${currentFrame.codeLines.includes(2) ? 'bg-indigo-500/20 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'}`}>
                {'    '}<span className="text-pink-400 font-bold">int</span> p1 = m - <span className="text-cyan-400">1</span>, p2 = n - <span className="text-cyan-400">1</span>, p = m + n - <span className="text-cyan-400">1</span>;
              </div>
              
              <div className={`px-2 -mx-2 rounded transition-all duration-300 ${currentFrame.codeLines.includes(3) ? 'bg-indigo-500/20 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'}`}>
                {'    '}<span className="text-pink-400 font-bold">while</span> (p1 &gt;= <span className="text-cyan-400">0</span> && p2 &gt;= <span className="text-cyan-400">0</span>) {'{'}
              </div>
              
              <div className={`px-2 -mx-2 rounded transition-all duration-300 ${currentFrame.codeLines.includes(4) ? 'bg-indigo-500/20 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'}`}>
                {'        '}<span className="text-pink-400 font-bold">if</span> (nums1[p1] &gt; nums2[p2]) {'{'}
              </div>
              <div className={`px-2 -mx-2 rounded transition-all duration-300 ${currentFrame.codeLines.includes(5) ? 'bg-emerald-500/20 border-l-2 border-emerald-500' : 'border-l-2 border-transparent'}`}>
                {'            '}nums1[p--] = nums1[p1--];
              </div>
              <div className={`px-2 -mx-2 rounded transition-all duration-300 ${currentFrame.codeLines.includes(6) ? 'bg-indigo-500/20 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'}`}>
                {'        '}else {'{'}
              </div>
              <div className={`px-2 -mx-2 rounded transition-all duration-300 ${currentFrame.codeLines.includes(7) ? 'bg-emerald-500/20 border-l-2 border-emerald-500' : 'border-l-2 border-transparent'}`}>
                {'            '}nums1[p--] = nums2[p2--];
              </div>
              <div className="text-zinc-300">{'        }'}</div>
              <div className="text-zinc-300">{'    }'}</div>
              
              <div className={`px-2 -mx-2 rounded transition-all duration-300 ${currentFrame.codeLines.includes(10) ? 'bg-indigo-500/20 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'}`}>
                {'    '}<span className="text-pink-400 font-bold">while</span> (p2 &gt;= <span className="text-cyan-400">0</span>) nums1[p--] = nums2[p2--];
              </div>
              
              <div className="text-zinc-300">{'}'}</div>
            </div>
          </div>

          {/* Minimal Algorithm Track */}
          <div className="theme-card border theme-border rounded-3xl p-6 bg-white/[0.01]">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Execution Track</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              
              <div className={`relative flex items-center gap-4 transition-all duration-300 ${currentFrame.algoStep === 1 ? 'scale-105 opacity-100' : 'opacity-40'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 bg-[#0f1117] ${currentFrame.algoStep === 1 ? 'border-purple-500 text-purple-400' : 'border-white/20 text-zinc-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${currentFrame.algoStep === 1 ? 'bg-purple-500' : 'bg-transparent'}`} />
                </div>
                <div className="flex-1 bg-white/5 border border-white/5 p-3 rounded-2xl text-xs text-zinc-300">
                  Set pointers <code className="text-purple-300">p1, p2, p</code> from end
                </div>
              </div>

              <div className={`relative flex items-center gap-4 transition-all duration-300 ${currentFrame.algoStep === 2 ? 'scale-105 opacity-100' : 'opacity-40'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 bg-[#0f1117] ${currentFrame.algoStep === 2 ? 'border-emerald-500 text-emerald-400' : 'border-white/20 text-zinc-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${currentFrame.algoStep === 2 ? 'bg-emerald-500' : 'bg-transparent'}`} />
                </div>
                <div className="flex-1 bg-white/5 border border-white/5 p-3 rounded-2xl text-xs text-zinc-300">
                  Compare <code className="text-blue-300">nums1[p1]</code> vs <code className="text-purple-300">nums2[p2]</code>
                  <br/><span className="text-zinc-400 mt-1 block">Write larger at <code className="text-orange-300">nums1[p]</code></span>
                </div>
              </div>

              <div className={`relative flex items-center gap-4 transition-all duration-300 ${currentFrame.algoStep === 3 ? 'scale-105 opacity-100' : 'opacity-40'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 bg-[#0f1117] ${currentFrame.algoStep === 3 ? 'border-cyan-500 text-cyan-400' : 'border-white/20 text-zinc-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${currentFrame.algoStep === 3 ? 'bg-cyan-500' : 'bg-transparent'}`} />
                </div>
                <div className="flex-1 bg-white/5 border border-white/5 p-3 rounded-2xl text-xs text-zinc-300">
                  Copy any remaining <code className="text-purple-300">nums2</code>
                </div>
              </div>

              <div className={`relative flex items-center gap-4 transition-all duration-300 ${currentFrame.algoStep === 4 ? 'scale-105 opacity-100' : 'opacity-40'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 bg-[#0f1117] ${currentFrame.algoStep === 4 ? 'border-orange-500 text-orange-400' : 'border-white/20 text-zinc-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${currentFrame.algoStep === 4 ? 'bg-orange-500' : 'bg-transparent'}`} />
                </div>
                <div className="flex-1 bg-white/5 border border-white/5 p-3 rounded-2xl text-xs text-zinc-300">
                  Array is sorted!
                </div>
              </div>

            </div>
          </div>
          
          {/* Why Merge from Back */}
          <div className="theme-card border theme-border rounded-3xl p-6 bg-white/[0.01]">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Why Merge from Back?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Merging from the front would overwrite unseen nums1 elements. By starting at the <strong className="text-orange-400">end of nums1</strong> (where the zeros are), we fill the largest slot first. The write pointer <code className="text-zinc-300">p</code> always lands in the "used-up" region — we never clobber an unread value.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
