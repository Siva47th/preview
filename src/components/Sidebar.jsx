import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Clock,
  FileText,
  Award,
  ShieldCheck,
  Zap,
  UserCheck,
  Users,
  Play,
  Pause,
  Square,
  Layers
} from 'lucide-react';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    setCurrentUser,
    users,
    activeTimer,
    pauseTimer,
    startTimer,
    stopAndSaveTimer,
    categories,
    selectedCategory,
    setSelectedCategory
  } = useApp();

  const isAdmin = currentUser.role === 'admin';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Jobs & Projects', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks Board', icon: CheckSquare },
    { id: 'timetracking', label: 'Time Tracking', icon: Clock },
    { id: 'invoices', label: 'Invoices & Billing', icon: FileText },
    { id: 'adminusers', label: 'Dev Management', icon: Users, badge: 'Admin' },
    { id: 'showcase', label: 'Solutions Showcase', icon: Award },
    { id: 'clientportal', label: 'Client Open Explore', icon: ShieldCheck, badge: 'Preview' }
  ];

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen select-none">
      <div>
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-900 tracking-tight leading-none">FREEWHEEL</h1>
              <span className="text-[10px] text-indigo-600 font-semibold uppercase">Agency OS v1.0</span>
            </div>
          </div>
        </div>

        {/* Compact Admin Stopwatch Widget */}
        {activeTimer && (
          <div className="mx-3 my-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                <span className={`w-2 h-2 rounded-full ${activeTimer.isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                {activeTimer.isRunning ? 'Admin Timer' : 'Timer Paused'}
              </span>
              <span className="font-mono text-xs font-bold text-slate-900">
                {formatTime(activeTimer.elapsedSeconds)}
              </span>
            </div>

            {/* Controls only active for Admin */}
            {isAdmin ? (
              <div className="flex items-center gap-1 pt-0.5">
                {activeTimer.isRunning ? (
                  <button
                    onClick={pauseTimer}
                    className="flex-1 py-1 px-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Pause className="w-3 h-3" /> Pause
                  </button>
                ) : (
                  <button
                    onClick={() => startTimer()}
                    className="flex-1 py-1 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                  >
                    <Play className="w-3 h-3" /> Resume
                  </button>
                )}
                <button
                  onClick={stopAndSaveTimer}
                  className="py-1 px-2 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-semibold flex items-center justify-center gap-1 transition"
                  title="Save Log"
                >
                  <Square className="w-3 h-3 fill-current" /> Save
                </button>
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 italic text-center pt-0.5">
                Managed by Admin
              </div>
            )}
          </div>
        )}

        {/* Job Fields Category Menu */}
        <div className="px-3 py-2 border-b border-slate-100">
          <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-600" /> Job Fields Menu
          </div>
          <div className="space-y-0.5 mt-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`w-full text-left px-2.5 py-1 rounded text-xs font-medium transition ${
                selectedCategory === 'All'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-2.5 py-1 rounded text-xs font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-indigo-700 border border-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Switcher (Admin & Dev Roles Only) */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="px-2 py-1 mb-1.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
          <UserCheck className="w-3 h-3 text-indigo-600" /> Switch Active Account
        </div>
        <div className="space-y-1">
          {users.map((usr) => {
            const isSelected = currentUser.id === usr.id;
            return (
              <button
                key={usr.id}
                onClick={() => setCurrentUser(usr)}
                className={`w-full text-left p-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-indigo-50 border border-indigo-300 text-indigo-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <img src={usr.avatar} alt={usr.name} className="w-5 h-5 rounded-full object-cover border border-slate-300" />
                  <div className="truncate max-w-[110px]">
                    <div className="font-medium truncate text-[11px]">{usr.name}</div>
                    <div className="text-[9px] text-slate-500 truncate">{usr.title}</div>
                  </div>
                </div>
                <span className={`text-[8px] px-1 py-0.5 rounded font-mono uppercase ${
                  usr.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                }`}>
                  {usr.role}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
