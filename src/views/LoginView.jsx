import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ShieldCheck, Key, Eye, EyeOff, UserCheck, Sparkles, ArrowRight, Code } from 'lucide-react';

export const LoginView = () => {
  const { login, switchAccount, users } = useApp();
  const [email, setEmail] = useState('alex@freewheel.io');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
      }
    }, 400);
  };

  const handleQuickDemoSelect = (user) => {
    setEmail(user.email);
    setPassword(user.password || (user.role === 'admin' ? 'admin123' : 'dev123'));
    setErrorMessage('');
    switchAccount(user.id);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col justify-between relative overflow-hidden text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Branding */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
            F
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight block leading-tight">FREEWHEEL</span>
            <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase">Agency Operating System v7.0</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 backdrop-blur border border-slate-800 px-3.5 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Role-Based Auth Guard Active</span>
        </div>
      </header>

      {/* Main Login Card Area */}
      <div className="flex-1 flex items-center justify-center p-4 z-10 my-8">
        <div className="w-full max-w-xl space-y-6">

          {/* Login Card */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Lock className="w-3.5 h-3.5" /> Secured Agency Login
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to Agency Workspace</h2>
              <p className="text-xs text-slate-400">
                Enter your credentials to access admin controls, project tasks, stopwatches, and invoices.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold text-center animate-shake">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@freewheel.io"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Authenticating Session...' : 'Sign In to Workspace'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </button>
            </form>

            {/* Quick One-Click Demo Credentials Switcher */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-extrabold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> One-Click Quick Demo Login:
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Select Role Below</span>
              </div>

              {/* Admin Button */}
              {users.filter(u => u.role === 'admin').map(admin => (
                <button
                  key={admin.id}
                  type="button"
                  onClick={() => handleQuickDemoSelect(admin)}
                  className="w-full p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-left transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img src={admin.avatar} alt={admin.name} className="w-8 h-8 rounded-full object-cover border border-purple-400/30" />
                    <div>
                      <div className="text-xs font-extrabold text-purple-300 group-hover:text-white transition flex items-center gap-1.5">
                        <span>{admin.name}</span>
                        <span className="text-[9px] bg-purple-500/30 text-purple-300 px-1.5 py-0.2 rounded uppercase font-mono">ADMIN</span>
                      </div>
                      <div className="text-[10px] text-purple-400/80 font-mono">{admin.email} (Password: admin123)</div>
                    </div>
                  </div>
                  <UserCheck className="w-4 h-4 text-purple-400 group-hover:scale-110 transition" />
                </button>
              ))}

              {/* Devs List Quick Switch Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                {users.filter(u => u.role === 'dev').map(dev => (
                  <button
                    key={dev.id}
                    type="button"
                    onClick={() => handleQuickDemoSelect(dev)}
                    className="p-2 rounded-lg bg-slate-950/60 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-left transition flex items-center gap-2 group"
                  >
                    <img src={dev.avatar} alt={dev.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                    <div className="truncate min-w-0">
                      <div className="text-[11px] font-bold text-slate-300 group-hover:text-indigo-300 truncate">{dev.name}</div>
                      <div className="text-[9px] text-slate-500 truncate">{dev.subRole || 'Developer'}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 border-t border-slate-900 z-10">
        Freewheel Operating System • Secured Role-Based Auth Engine • Internal Agency Use Only
      </footer>
    </div>
  );
};
