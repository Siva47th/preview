import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ShieldCheck, Key, Eye, EyeOff, ArrowRight } from 'lucide-react';
import logoImg from '../assets/freewheel-logo.png';

export const LoginView = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f2effb] flex flex-col justify-between relative text-[#2d2252] selection:bg-[#6e48e5] selection:text-white">
      
      {/* Top Header Branding */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between z-10 border-b border-[#e2d8f2]">
        <div className="flex items-center gap-3">
          <div className="h-9 px-3 py-1 bg-white border border-[#ded5f2] rounded-xl flex items-center justify-center shadow-sm">
            <img
              src={logoImg}
              alt="Freewheel Technology Solutions"
              className="h-6 w-auto object-contain"
            />
          </div>
          <div>
            <span className="font-extrabold text-sm text-[#2d2252] tracking-tight block leading-tight">FREEWHEEL</span>
            <span className="text-[10px] text-[#716196] font-mono tracking-wider uppercase">Agency Operating System</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#5a4880] bg-white border border-[#ded5f2] px-3.5 py-1.5 rounded-full shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">Secured Portal</span>
        </div>
      </header>

      {/* Main Login Card Area */}
      <div className="flex-1 flex items-center justify-center p-4 z-10 my-8">
        <div className="w-full max-w-md space-y-6">

          {/* Login Card */}
          <div className="bg-white border border-[#ded5f2] rounded-3xl p-8 shadow-xl shadow-[#4a3575]/5 space-y-6">
            
            {/* Logo & Headline */}
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-[#faf9fe] rounded-2xl shadow-sm border border-[#e5ddf5]">
                <img
                  src={logoImg}
                  alt="Freewheel Technology Solutions"
                  className="h-12 w-auto object-contain mx-auto"
                />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-[#2d2252] tracking-tight">Sign In to Your Workspace</h2>
                <p className="text-xs text-[#716196]">
                  Enter your team credentials to access your dashboard
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold text-center animate-shake">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#45366c] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8a7da8] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#faf9fe] border border-[#d8cee8] rounded-xl text-xs text-[#2d2252] placeholder-[#a296be] focus:outline-none focus:border-[#6e48e5] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#45366c] mb-1.5">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#8a7da8] absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-[#faf9fe] border border-[#d8cee8] rounded-xl text-xs text-[#2d2252] placeholder-[#a296be] focus:outline-none focus:border-[#6e48e5] focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#8a7da8] hover:text-[#45366c] transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#6e48e5] hover:bg-[#5d37d8] active:bg-[#4f2bc7] text-white rounded-xl text-xs font-extrabold shadow-md shadow-[#6e48e5]/25 transition flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </button>
            </form>

            {/* Help Text */}
            <p className="text-center text-[11px] text-[#8274a2]">
              Contact your Agency Manager if you need assistance with your credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-[#8274a2] border-t border-[#e2d8f2]">
        Freewheel Technology Solutions • Secured Authentication • Internal Agency System
      </footer>
    </div>
  );
};

export default LoginView;
