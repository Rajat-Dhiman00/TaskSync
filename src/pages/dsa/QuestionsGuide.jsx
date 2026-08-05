import React from "react";
import { Star, Play, Code2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function QuestionsGuide() {
  const navigate = useNavigate();

  const guideData = [
    {
      category: "BASICS",
      questions: [
        { id: 1929, title: "Concatenation of Array", sub: "basics", diff: "Easy", time: "O(n)", space: "O(n)", link: "https://leetcode.com/problems/concatenation-of-array/description/" },
        { id: 1480, title: "Running Sum of 1d Array", sub: "prefix sum", diff: "Easy", time: "O(n)", space: "O(1)", link: "https://leetcode.com/problems/running-sum-of-1d-array/description/" }
      ]
    },
    {
      category: "TWO POINTERS",
      questions: [
        { id: 88, title: "Merge Sorted Array", sub: "two pointers", diff: "Easy", time: "O(n+m)", space: "O(1)", link: "https://leetcode.com/problems/merge-sorted-array/description/" }
      ]
    },
    {
      category: "SUBARRAY / SLIDING WINDOW",
      questions: [
        { id: 53, title: "Maximum Subarray", sub: "Kadane's algorithm", diff: "Medium", time: "O(n)", space: "O(1)", link: "https://leetcode.com/problems/maximum-subarray/" }
      ]
    }
  ];

  const getDiffColor = (diff) => {
    if (diff === "Easy") return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (diff === "Medium") return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  const getDiffGlow = (diff) => {
    if (diff === "Easy") return "group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]";
    if (diff === "Medium") return "group-hover:shadow-[0_0_20px_-5px_rgba(234,179,8,0.3)]";
    return "group-hover:shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)]";
  };

  const containerVariant = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-12 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative border-b theme-border pb-6 pt-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight theme-text flex items-center gap-3">
          <Code2 className="w-8 h-8 text-indigo-500" />
          Questions Guide
        </h1>
        <p className="text-sm theme-text-muted font-mono mt-2 max-w-2xl">
          A highly curated list of essential DSA problems categorized by pattern. 
          Master these foundational questions before moving to complex algorithms.
        </p>
      </div>

      <motion.div 
        variants={containerVariant} 
        initial="hidden" 
        animate="show" 
        className="space-y-10"
      >
        {guideData.map((section, idx) => (
          <motion.div variants={itemVariant} key={idx} className="space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-widest">{section.category}</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/20 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {section.questions.map((q, qIdx) => (
                <motion.div 
                  key={q.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`group relative flex flex-col p-5 rounded-2xl border theme-border bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.04] overflow-hidden ${getDiffGlow(q.diff)}`}
                >
                  {/* Decorative glowing gradient based on difficulty in the background */}
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none ${q.diff === 'Easy' ? 'bg-emerald-500' : q.diff === 'Medium' ? 'bg-yellow-500' : 'bg-rose-500'}`} />
                  
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex gap-3">
                      <Star className="w-5 h-5 text-zinc-600 group-hover:text-amber-400 transition-colors shrink-0 cursor-pointer drop-shadow-lg" />
                      <div>
                        <div className="text-xs text-zinc-500 font-mono mb-1">Problem #{q.id}</div>
                        <h4 className="text-base font-semibold theme-text leading-tight group-hover:text-indigo-300 transition-colors">{q.title}</h4>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border shrink-0 uppercase tracking-wide ${getDiffColor(q.diff)}`}>
                      {q.diff}
                    </span>
                  </div>

                  <div className="mt-auto relative z-10">
                    <div className="flex items-center gap-2 mb-4 text-xs font-mono theme-text-muted">
                      <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-300">{q.sub}</span>
                      <span className="flex items-center gap-1"><span className="text-indigo-400 opacity-70">⏱</span> {q.time}</span>
                      <span className="flex items-center gap-1"><span className="text-emerald-400 opacity-70">💾</span> {q.space}</span>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t theme-border border-dashed">
                      <button 
                        onClick={() => {
                          if (q.id === 1929) navigate('/app/guide/1929');
                          else if (q.id === 88) navigate('/app/guide/88');
                          else alert('Visualizer for this problem is coming soon!');
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 text-white hover:bg-indigo-600 rounded-xl px-3 py-2 transition-all duration-200 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span className="text-xs font-bold font-sans">Visualize</span>
                      </button>
                      <a href={q.link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 hover:border-orange-500/50 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer">
                        LeetCode <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
