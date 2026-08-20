import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Bell, Shield, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export const Header = () => {
  const { activeTab, setActiveTab, currentUser, startTimer, activeTimer } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return { main: 'Executive Dashboard', sub: 'Overview of revenue, ongoing projects, and agency velocity' };
      case 'projects': return { main: 'Projects Portfolio', sub: 'Manage budgets, deadlines, and milestone completion' };
      case 'tasks': return { main: 'Agile Kanban Board', sub: 'Track squad workflows, backlog, and sprint deliverables' };
      case 'timetracking': return { main: 'Time Tracking & Logs', sub: 'Live stopwatch and billable hourly log details' };
      case 'invoices': return { main: 'Invoicing & Financial Ledger', sub: 'Generate, send, and audit client invoices' };
      case 'showcase': return { main: 'Solutions Showcase', icon: Sparkles, sub: 'Explore delivered enterprise case studies & client benchmarks' };
      case 'clientportal': return { main: 'Client Security Portal', sub: 'Restricted client-facing progress and billing interface' };
      default: return { main: 'Freewheel Workspace', sub: 'Agency Operations System' };
    }
  };

  const info = getTitle();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* View Titles */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            {info.main}
            {activeTab === 'showcase' && (
              <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Featured Solutions
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500">{info.sub}</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, tasks, invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition"
          />
        </div>

        {/* Quick Start Timer Button */}
        {currentUser.role !== 'client' && (
          <button
            onClick={() => {
              if (!activeTimer.isRunning) {
                startTimer('proj_1', 'tsk_101', 'Started quick timer from header');
              }
              setActiveTab('timetracking');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTimer.isRunning
                ? 'bg-amber-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {activeTimer.isRunning ? 'Timer Running...' : '+ Track Time'}
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 relative transition"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900">System Notifications</span>
                <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold border border-indigo-200">Phase 1 Live</span>
              </div>
              <div className="py-2 space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Contract & DB Schema Locked
                  </div>
                  <div className="text-slate-500 mt-1 text-[11px]">Phase 0 signed off by all squads. Feature development unblocked.</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-900 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-indigo-600" /> Client Portal Isolated
                  </div>
                  <div className="text-slate-500 mt-1 text-[11px]">Security boundary confirmed for Apex Corporation access scope.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Role Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full object-cover border border-slate-300" />
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-tight">{currentUser.name}</div>
            <div className="text-[10px] text-slate-500 capitalize">{currentUser.role === 'admin' ? 'Agency Lead' : currentUser.role === 'dev' ? 'Engineer' : 'Client Access'}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
