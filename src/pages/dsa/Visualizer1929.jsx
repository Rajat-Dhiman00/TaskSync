import React, { useState, useEffect } from "react";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, RotateCcw, Code2, Zap, Layers, ChevronRight, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Visualizer1929() {
  const [nums, setNums] = useState([1, 2, 1]);
  const [customInput, setCustomInput] = useState("");
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); 

  const n = nums.length;
  const totalSteps = n + 1; 

  useEffect(() => {
    let timer;
    if (isPlaying && step < n + 1) {
      timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, speed);
    } else if (step >= n + 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, speed, n]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReset = () => { setIsPlaying(false); setStep(0); };
  const handlePrev = () => setStep(prev => Math.max(0, prev - 1));
  const handleNext = () => setStep(prev => Math.min(n + 1, prev + 1));

  const handleRunCustom = () => {
    try {
      const arr = customInput.split(",").map(s => parseInt(s.trim())).filter(num => !isNaN(num));
      if (arr.length > 0 && arr.length <= 8) { // cap at 8 for layout
        setNums(arr);
        setStep(0);
        setIsPlaying(false);
      }
    } catch(e) {}
  };

  const currentI = step > 0 && step <= n ? step - 1 : null;
  const ans = new Array(2 * n).fill(null);
  
  for (let idx = 0; idx < Math.min(step, n); idx++) {
    ans[idx] = nums[idx];
    ans[idx + n] = nums[idx];
  }
  
  const isComplete = step > n;

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-700 pb-20">
      
      {/* Dynamic Header */}
      <div className="relative overflow-hidden theme-card border theme-border rounded-3xl p-8 mb-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <Link to="/app/guide" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium mb-4 w-fit bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" /> Back to Guide
            </Link>
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 mb-4 tracking-tight">
              Concatenation of Array
            </h1>
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <span className="border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full bg-indigo-500/10 backdrop-blur-md">LC #1929</span>
              <span className="border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full bg-emerald-500/10 backdrop-blur-md flex items-center gap-1"><Zap className="w-3 h-3"/> EASY</span>
              <span className="border border-cyan-500/30 text-cyan-300 px-3 py-1 rounded-full bg-cyan-500/10 backdrop-blur-md">O(N) TIME / O(N) SPACE</span>
            </div>
          </div>

          <div className="bg-black/40 border border-white/10 p-4 rounded-2xl w-full md:w-auto backdrop-blur-md">
            <h3 className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase mb-3 flex items-center gap-2"><Terminal className="w-3 h-3"/> Try Custom Input</h3>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={customInput} 
                onChange={(e) => setCustomInput(e.target.value)} 
                placeholder="e.g. 1, 2, 1" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-indigo-500 w-full md:w-48 font-mono transition-colors" 
              />
              <button onClick={handleRunCustom} className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-500/25">
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
              <button onClick={handlePlayPause} disabled={isComplete} className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white p-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/30">
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
              <Layers className="w-5 h-5 text-indigo-400" /> Array Memory State
            </h2>

            {/* Arrays Animation Area */}
            <div className="space-y-12 pb-8">
              
              {/* NUMS Array */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono font-bold text-zinc-400 tracking-wider">INPUT</span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono text-zinc-300">nums</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {nums.map((val, idx) => (
                    <div key={idx} className="relative">
                      <motion.div 
                        initial={false}
                        animate={{ 
                          scale: currentI === idx ? 1.1 : 1,
                          y: currentI === idx ? -5 : 0,
                          borderColor: currentI === idx ? "#60a5fa" : "rgba(255,255,255,0.1)",
                          backgroundColor: currentI === idx ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.03)"
                        }}
                        className="w-16 h-16 rounded-2xl border flex items-center justify-center text-2xl font-bold font-mono shadow-xl backdrop-blur-md relative z-10 text-white"
                      >
                        {val}
                      </motion.div>
                      {currentI === idx && (
                        <motion.div layoutId="pointer-i" className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                          <div className="w-1 h-3 bg-blue-400 rounded-t-full mb-1" />
                          <span className="text-[10px] font-mono text-blue-400 font-bold bg-blue-400/10 px-1.5 rounded">i</span>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ANS Array */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">RESULT</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">ans (size 2n)</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {ans.map((val, idx) => {
                    const isWritingNow = currentI !== null && (idx === currentI || idx === currentI + n);
                    const isWritten = val !== null;
                    
                    return (
                      <div key={idx} className="relative">
                        <motion.div 
                          initial={false}
                          animate={{ 
                            scale: isWritingNow ? 1.1 : 1,
                            borderColor: isWritingNow ? "#34d399" : isWritten ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                            backgroundColor: isWritingNow ? "rgba(52,211,153,0.15)" : isWritten ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.2)",
                            color: isWritingNow ? "#34d399" : isWritten ? "#fff" : "transparent"
                          }}
                          className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-xl font-bold font-mono shadow-xl backdrop-blur-md relative z-10 ${!isWritten && 'border-dashed'}`}
                        >
                          {isWritten ? val : "-"}
                        </motion.div>
                        
                        {isWritingNow && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center whitespace-nowrap"
                          >
                            <div className="w-1 h-3 bg-emerald-400 rounded-t-full mb-1" />
                            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-400/10 px-1.5 rounded">
                              {idx === currentI ? 'ans[i]' : 'ans[i+n]'}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Explanation & Variables Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Step Logic */}
            <div className="theme-card border theme-border rounded-3xl p-6 relative overflow-hidden bg-white/[0.01]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500" />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Logic Insight</h3>
                <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-full font-mono text-zinc-400">Step {Math.min(step, n+1)} of {n+1}</span>
              </div>
              
              <div className="min-h-[100px] text-sm leading-relaxed theme-text">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 0 && (
                      <p>
                        <strong className="text-indigo-400">Initialization:</strong> We have an input array of length <code className="bg-white/10 px-1 rounded">n = {n}</code>. We allocate a new array <code className="bg-white/10 px-1 rounded">ans</code> of size <code className="bg-white/10 px-1 rounded">2n = {2*n}</code> to hold the repeated sequence.
                      </p>
                    )}
                    {(step > 0 && step <= n) && (
                      <div className="space-y-3">
                        <p>
                          Processing index <strong className="text-blue-400 font-mono">i = {currentI}</strong> where the value is <strong className="text-white bg-white/10 px-2 py-0.5 rounded">{nums[currentI]}</strong>.
                        </p>
                        <p className="text-zinc-400 text-xs">
                          We mirror this value into <span className="text-emerald-400 font-mono">ans[{currentI}]</span> (first half) and <span className="text-emerald-400 font-mono">ans[{currentI + n}]</span> (second half) simultaneously.
                        </p>
                      </div>
                    )}
                    {step > n && (
                      <p className="text-emerald-400 font-medium flex items-center gap-2">
                        <Zap className="w-5 h-5" /> Loop complete! We successfully copied all elements twice. Return the <code className="text-white font-mono bg-white/10 px-1 rounded">ans</code> array.
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Variable Tracker */}
            <div className="theme-card border theme-border rounded-3xl p-6 bg-white/[0.01]">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Memory State</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-4 rounded-2xl border transition-colors ${currentI !== null ? 'bg-blue-500/10 border-blue-500/30' : 'bg-black/20 border-white/5'}`}>
                  <div className="text-[10px] text-zinc-500 font-mono mb-1">INDEX i</div>
                  <div className="text-2xl font-mono font-bold text-white">{currentI !== null ? currentI : "-"}</div>
                </div>
                <div className={`p-4 rounded-2xl border transition-colors ${currentI !== null ? 'bg-blue-500/10 border-blue-500/30' : 'bg-black/20 border-white/5'}`}>
                  <div className="text-[10px] text-zinc-500 font-mono mb-1">nums[i]</div>
                  <div className="text-2xl font-mono font-bold text-white">{currentI !== null ? nums[currentI] : "-"}</div>
                </div>
                <div className={`p-4 rounded-2xl border transition-colors ${currentI !== null ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/20 border-white/5'}`}>
                  <div className="text-[10px] text-zinc-500 font-mono mb-1">ans[i]</div>
                  <div className="text-2xl font-mono font-bold text-emerald-400">{currentI !== null ? nums[currentI] : "-"}</div>
                </div>
                <div className={`p-4 rounded-2xl border transition-colors ${currentI !== null ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/20 border-white/5'}`}>
                  <div className="text-[10px] text-zinc-500 font-mono mb-1">ans[i+n]</div>
                  <div className="text-2xl font-mono font-bold text-emerald-400">{currentI !== null ? nums[currentI] : "-"}</div>
                </div>
              </div>
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
              <div className="text-zinc-300"><span className="text-pink-400 font-bold">public</span> <span className="text-pink-400 font-bold">int</span>[] getConcatenation(<span className="text-pink-400 font-bold">int</span>[] nums) {'{'}</div>
              
              <div className={`px-2 -mx-2 rounded transition-all duration-300 ${step === 0 ? 'bg-indigo-500/20 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'}`}>
                {'    '}<span className="text-pink-400 font-bold">int</span> n = nums.length;
              </div>
              <div className={`px-2 -mx-2 rounded transition-all duration-300 ${step === 0 ? 'bg-indigo-500/20 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'}`}>
                {'    '}<span className="text-pink-400 font-bold">int</span>[] ans = <span className="text-pink-400 font-bold">new int</span>[<span className="text-cyan-400">2</span> * n];
              </div>
              
              <div className={`px-2 -mx-2 rounded transition-all duration-300 ${(step > 0 && step <= n) ? 'bg-indigo-500/20 border-l-2 border-indigo-500' : 'border-l-2 border-transparent'}`}>
                {'    '}<span className="text-pink-400 font-bold">for</span> (<span className="text-pink-400 font-bold">int</span> i = <span className="text-cyan-400">0</span>; i &lt; n; i++) {'{'}
              </div>
              <div className={`px-2 -mx-2 rounded transition-all duration-300 ${(step > 0 && step <= n) ? 'bg-emerald-500/20 border-l-2 border-emerald-500' : 'border-l-2 border-transparent'}`}>
                {'        '}ans[i]     = nums[i];
              </div>
              <div className={`px-2 -mx-2 rounded transition-all duration-300 ${(step > 0 && step <= n) ? 'bg-emerald-500/20 border-l-2 border-emerald-500' : 'border-l-2 border-transparent'}`}>
                {'        '}ans[i + n] = nums[i];
              </div>
              
              <div className="text-zinc-300">{'    }'}</div>
              
              <div className={`px-2 -mx-2 rounded transition-all duration-300 ${step > n ? 'bg-cyan-500/20 border-l-2 border-cyan-500' : 'border-l-2 border-transparent'}`}>
                {'    '}<span className="text-pink-400 font-bold">return</span> ans;
              </div>
              <div className="text-zinc-300">{'}'}</div>
            </div>
          </div>

          {/* Minimal Algorithm Track */}
          <div className="theme-card border theme-border rounded-3xl p-6 bg-white/[0.01]">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-6">Execution Track</h3>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
              
              <div className={`relative flex items-center gap-4 transition-all duration-300 ${step === 0 ? 'scale-105 opacity-100' : 'opacity-40'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 bg-[#0f1117] ${step === 0 ? 'border-indigo-500 text-indigo-400' : 'border-white/20 text-zinc-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${step === 0 ? 'bg-indigo-500' : 'bg-transparent'}`} />
                </div>
                <div className="flex-1 bg-white/5 border border-white/5 p-3 rounded-2xl text-xs text-zinc-300">
                  Allocate <code className="text-indigo-300">ans</code> array (Size 2N)
                </div>
              </div>

              <div className={`relative flex items-center gap-4 transition-all duration-300 ${(step > 0 && step <= n) ? 'scale-105 opacity-100' : 'opacity-40'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 bg-[#0f1117] ${(step > 0 && step <= n) ? 'border-emerald-500 text-emerald-400' : 'border-white/20 text-zinc-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${(step > 0 && step <= n) ? 'bg-emerald-500' : 'bg-transparent'}`} />
                </div>
                <div className="flex-1 bg-white/5 border border-white/5 p-3 rounded-2xl text-xs text-zinc-300">
                  Map <code className="text-emerald-300">nums[i]</code> to both halves
                </div>
              </div>

              <div className={`relative flex items-center gap-4 transition-all duration-300 ${step > n ? 'scale-105 opacity-100' : 'opacity-40'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 bg-[#0f1117] ${step > n ? 'border-cyan-500 text-cyan-400' : 'border-white/20 text-zinc-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${step > n ? 'bg-cyan-500' : 'bg-transparent'}`} />
                </div>
                <div className="flex-1 bg-white/5 border border-white/5 p-3 rounded-2xl text-xs text-zinc-300">
                  Return concatenated array
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
