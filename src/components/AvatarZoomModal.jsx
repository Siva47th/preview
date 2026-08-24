import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Maximize2, Shield, User, Briefcase, Mail } from 'lucide-react';

export const AvatarZoomModal = ({ user, isOpen, onClose }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.3, 0.7));
  const handleResetZoom = () => setScale(1);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col items-center p-6 space-y-5 relative text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls */}
        <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
              user.role === 'admin'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
            }`}>
              {user.role === 'admin' ? 'Agency Manager' : (user.subRole || 'Developer')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 hover:text-white transition"
              title="Reset Zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 ml-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zoomed Avatar Display */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden bg-slate-950 border-2 border-indigo-500/30 shadow-2xl flex items-center justify-center group cursor-zoom-in">
          <img
            src={user.avatar}
            alt={user.name}
            style={{ transform: `scale(${scale})` }}
            className="w-full h-full object-cover transition-transform duration-200 select-none pointer-events-none"
          />
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/70 backdrop-blur text-[10px] text-slate-400 font-mono">
            Click +/- to Zoom
          </div>
        </div>

        {/* Member Profile Details */}
        <div className="text-center space-y-1 w-full pt-1">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>{user.name}</span>
          </h3>
          <p className="text-xs text-indigo-400 font-medium">{user.title || user.subRole || 'Team Member'}</p>
          <p className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1">
            <Mail className="w-3 h-3 text-slate-500" />
            <span>{user.email}</span>
          </p>
        </div>

        {/* Footer info */}
        <div className="w-full pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Role: <strong className="text-slate-300 uppercase font-mono">{user.subRole || 'Developer'}</strong></span>
          <span>Rate: <strong className="text-emerald-400 font-mono">₹{Number(user.hourlyRate || 10500).toLocaleString('en-IN')}/hr</strong></span>
        </div>
      </div>
    </div>
  );
};

export default AvatarZoomModal;
