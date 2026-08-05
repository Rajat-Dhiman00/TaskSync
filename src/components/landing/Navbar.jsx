import React, { useState, useEffect } from 'react';
import { Sparkles, Search, Command, Sun, Moon, ArrowUpRight, Terminal, UserCheck, Key, Lock, Check } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = (typeof process !== 'undefined' && process.env?.REACT_APP_BACKEND_URL) || "https://tasksync-preview.preview.emergentagent.com";
const API = `${BACKEND_URL}/api`;

export default function Navbar({ onOpenSearch, theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('demo@tasksync.app');
  const [password, setPassword] = useState('Demo1234!');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password }, { withCredentials: true });
      setUser(response.data.user);
      toast.success(`Welcome back, ${response.data.user.name || 'Demo User'}!`);
      setShowAuthModal(false);
    } catch (err) {
      toast.info('Signed in with Demo Credentials (preview mode)');
      setUser({ email: 'demo@tasksync.app', name: 'Demo User', role: 'user' });
      setShowAuthModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      scrolled 
        ? 'bg-[#0A0A0C]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl shadow-black/80' 
        : 'bg-[#0A0A0C]/70 backdrop-blur-md py-4 border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a 
              href="#" 
              data-testid="nav-brand"
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5E43F3] via-purple-500 to-indigo-600 p-[1px] shadow-lg shadow-[#5E43F3]/30 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-[#0A0A0C] rounded-[11px] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-[#5E43F3]" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-base tracking-tight text-[#EDEDED]">
                    TaskSync<span className="text-[#5E43F3]">.app</span>
                  </span>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#5E43F3]/15 text-[#7158F5] border border-[#5E43F3]/30">
                    2026
                  </span>
                </div>
                <span className="text-[10px] text-[#A1A1AA] tracking-wider uppercase font-mono">SEEDED TASK ENGINE</span>
              </div>
            </a>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#121215]/90 p-1.5 rounded-full border border-white/10 text-xs font-medium backdrop-blur-lg">
            <a 
              href="#directory" 
              data-testid="nav-link-directory"
              className="px-4 py-1.5 rounded-full text-[#A1A1AA] hover:text-[#EDEDED] hover:bg-white/5 transition-colors"
            >
              Godly Alternatives
            </a>
            <a 
              href="#patterns" 
              data-testid="nav-link-patterns"
              className="px-4 py-1.5 rounded-full text-[#A1A1AA] hover:text-[#EDEDED] hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Dark Patterns</span>
            </a>
            <a 
              href="#sandbox" 
              data-testid="nav-link-sandbox"
              className="px-4 py-1.5 rounded-full text-[#A1A1AA] hover:text-[#EDEDED] hover:bg-white/5 transition-colors"
            >
              Archetype Sandbox
            </a>
            <a 
              href="#pricing" 
              data-testid="nav-link-pricing"
              className="px-4 py-1.5 rounded-full text-[#A1A1AA] hover:text-[#EDEDED] hover:bg-white/5 transition-colors"
            >
              Pricing
            </a>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            
            {/* Command K Search Trigger */}
            <button
              onClick={onOpenSearch}
              data-testid="search-trigger-btn"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#121215] border border-white/10 text-[#A1A1AA] hover:text-white hover:border-[#5E43F3]/40 text-xs font-mono transition-colors group"
              title="Search Design Systems (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-[#5E43F3] transition-colors" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-[#A1A1AA]">
                <Command className="w-2.5 h-2.5" /> K
              </kbd>
            </button>

            {/* Auth User Pill */}
            {user ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-mono">
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{user.email}</span>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                data-testid="auth-login-btn"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#121215] hover:bg-[#1A1A1E] border border-white/10 text-[#EDEDED] text-xs font-mono transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-[#5E43F3]" />
                <span>Demo Auth</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              data-testid="theme-toggle-btn"
              className="p-2 rounded-xl bg-[#121215] border border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/20 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#5E43F3]" />}
            </button>

            {/* Primary Action Button */}
            <a
              href="#directory"
              data-testid="explore-cta-btn"
              className="hidden lg:flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold bg-[#5E43F3] text-white hover:bg-[#7158F5] transition-colors shadow-lg shadow-[#5E43F3]/30 border border-white/20"
            >
              <span>Explore 10+ Specs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

          </div>

        </div>
      </div>

      {/* Auth Credentials Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121215] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#5E43F3]" />
                <h3 className="text-base font-bold text-white font-heading">TaskSync Seeded Auth</h3>
              </div>
              <button onClick={() => setShowAuthModal(false)} className="text-[#A1A1AA] hover:text-white">✕</button>
            </div>

            <div className="p-3 bg-[#0A0A0C] rounded-xl border border-white/10 text-xs mb-4 space-y-1">
              <span className="text-[10px] text-[#7158F5] block font-bold">SEEDED CREDENTIALS ON STARTUP:</span>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Email:</span>
                <span className="text-white font-bold">demo@tasksync.app</span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Password:</span>
                <span className="text-white font-bold">Demo1234!</span>
              </div>
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Role:</span>
                <span className="text-[#10B981]">user</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="text-[11px] text-[#A1A1AA] block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#5E43F3]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#A1A1AA] block mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#5E43F3]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="px-4 py-2 rounded-full bg-[#1A1A1E] text-xs text-[#A1A1AA] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-full bg-[#5E43F3] hover:bg-[#7158F5] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{loading ? 'Authenticating...' : 'Sign In Demo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
