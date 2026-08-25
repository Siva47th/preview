import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Bell, Shield, Sparkles, Clock, CheckCircle2, LogOut, Database, UserCheck, Settings, Menu } from 'lucide-react';
import { StorageManagerModal } from './StorageManagerModal';
import { ProfileSettingsModal } from './ProfileSettingsModal';

export const Header = () => {
  const { activeTab, setActiveTab, currentUser, taskTimers, logout, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStorageManager, setShowStorageManager] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return { main: 'Dashboard', sub: 'Overview of revenue, projects, and velocity' };
      case 'projects': return { main: 'Jobs & Projects', sub: 'Manage budgets and sub-role assignments' };
      case 'tasks': return { main: 'Tasks Board', sub: 'Track deliverables and individual stopwatches' };
      case 'timetracking': return { main: 'Time Tracking', sub: 'Audit task stopwatches and hourly logs' };
      case 'invoices': return { main: 'Invoices & Billing', sub: 'Generate, send, and audit invoices' };
      case 'adminusers': return { main: 'Dev Management', sub: 'Admin control for 9-member dev team' };
      case 'showcase': return { main: 'Project History', sub: 'Archive and completed deliverables' };
      default: return { main: 'Freewheel', sub: 'Agency Operations System' };
    }
  };

  const info = getTitle();

  // Calculate active running timers count across all tasks
  const activeTaskIds = taskTimers ? Object.keys(taskTimers).filter(id => taskTimers[id]?.isRunning) : [];
  const isTimerRunning = activeTaskIds.length > 0;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm gap-2">
      {/* Left Area: Mobile Hamburger + View Titles */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition shrink-0"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 text-indigo-600" />
        </button>

        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5 truncate">
            <span>{info.main}</span>
            {activeTab === 'showcase' && (
              <span className="hidden sm:inline-flex text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-medium items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Archive
              </span>
            )}
          </h2>
          <p className="text-[11px] text-slate-500 truncate hidden sm:block">{info.sub}</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Search Input (Desktop) */}
        <div className="relative hidden lg:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, tasks, invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56 pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
          />
        </div>

        {/* Quick Task Timers Trigger */}
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
            isTimerRunning
              ? 'bg-amber-600 text-white animate-pulse'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
          }`}
          title="Go to Task Board & Stopwatches"
        >
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">
            {isTimerRunning ? `${activeTaskIds.length} Running` : 'Stopwatches'}
          </span>
        </button>

        {/* Storage & Deployment Manager */}
        <button
          onClick={() => setShowStorageManager(true)}
          className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 text-xs font-semibold border border-slate-200"
          title="Cloud & Database Connection"
        >
          <Database className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="hidden xl:inline text-[11px]">Database</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 relative transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 animate-scale-up">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900">System Notifications</span>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold border border-indigo-200">Live Active</span>
              </div>
              <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Per-Task Stopwatches Active
                  </div>
                  <div className="text-slate-500 mt-1 text-[11px]">Individual timers operational across 9-member dev team.</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-900 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-indigo-600" /> Sub-Role Matrix Configured
                  </div>
                  <div className="text-slate-500 mt-1 text-[11px]">Frontend, Backend, Database, and QA roles mapped.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Trigger & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-200">
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition group text-left"
            title="Edit My Profile & Password"
          >
            <div className="relative shrink-0">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover border border-slate-300 group-hover:border-indigo-600 transition" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white absolute -bottom-0.5 -right-0.5"></span>
            </div>
            <div className="hidden xl:block">
              <div className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition flex items-center gap-1">
                {currentUser.name}
                <Settings className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition" />
              </div>
              <div className="text-[10px] text-indigo-600 font-bold uppercase">{currentUser.role === 'admin' ? 'Admin' : `${currentUser.subRole || 'Developer'}`}</div>
            </div>
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition flex items-center gap-1 text-xs font-bold shrink-0"
            title="Log Out of Workspace"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Storage Manager Modal */}
      <StorageManagerModal
        isOpen={showStorageManager}
        onClose={() => setShowStorageManager(false)}
      />

      {/* Custom Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </header>
  );
};
