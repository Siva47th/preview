import React from 'react';
import { useApp } from '../context/AppContext';
import {
  IndianRupee,
  FolderKanban,
  Clock,
  FileText,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  User,
  Activity,
  Plus,
  History
} from 'lucide-react';

export const DashboardView = () => {
  const {
    projects,
    tasks,
    timeLogs,
    invoices,
    activities,
    setActiveTab,
    currentUser
  } = useApp();

  const totalRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const pendingRevenue = invoices
    .filter(i => i.status === 'Sent')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalLoggedMins = timeLogs.reduce((sum, l) => sum + l.durationMinutes, 0);
  const totalHours = (totalLoggedMins / 60).toFixed(1);

  const unbilledLogs = timeLogs.filter(l => l.billable && !l.invoiced);
  const unbilledVal = unbilledLogs.reduce((sum, l) => sum + ((l.durationMinutes / 60) * l.hourlyRate), 0);

  const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Welcome back, {currentUser.name}</h1>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2.5 py-0.5 rounded">
              Phase 1 Squad Build
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Agency operational status is active. API contract signed off, squad parallel builds live.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('showcase')}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition"
          >
            <History className="w-4 h-4 text-indigo-600" />
            <span>Project History Archive</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Kanban Board</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="clean-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Revenue Collected</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% from last sprint
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="clean-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Projects</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{activeProjectsCount} Projects</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {projects.length} total in pipeline
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="clean-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Hours Logged</span>
            <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{totalHours} hrs</div>
            <div className="text-[11px] text-indigo-600 mt-1 font-mono font-medium">
              ₹{unbilledVal.toLocaleString('en-IN')} unbilled value
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="clean-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Invoices</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">₹{pendingRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[11px] text-amber-600 mt-1">
              {invoices.filter(i => i.status === 'Sent').length} invoices awaiting payment
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects Progress */}
        <div className="lg:col-span-2 clean-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Projects Progress</h3>
              <p className="text-xs text-slate-500">Track budgets, completion percentage, and deadlines</p>
            </div>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1 transition"
            >
              View All Projects <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {proj.name}
                      <span className={`text-[9px] px-2 py-0.5 rounded font-semibold ${
                        proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      }`}>
                        {proj.status}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{proj.clientName}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-indigo-600">₹{proj.budget.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400">Deadline: {proj.deadline}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Completion</span>
                    <span className="font-bold text-slate-900">{proj.completionPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${proj.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase Checklist & Audit Log */}
        <div className="space-y-6">
          <div className="clean-panel p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Phase Exit Criteria Status
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">Phase 0: Foundation</div>
                  <div className="text-[10px] text-slate-500">API Contract & Schema</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  LOCKED
                </span>
              </div>

              <div className="p-2.5 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-indigo-900">Phase 1: Parallel Build</div>
                  <div className="text-[10px] text-indigo-600">Auth, Projects, Time/Billing</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                  ACTIVE
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between opacity-70">
                <div>
                  <div className="font-semibold text-slate-700">Phase 2: Integration</div>
                  <div className="text-[10px] text-slate-400">Staging E2E & Chatbot</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600">
                  WEEK 5
                </span>
              </div>
            </div>
          </div>

          <div className="clean-panel p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" /> Audit Log & Activity
            </h3>

            <div className="space-y-3 text-xs">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 border-b border-slate-100 pb-2.5 last:border-none">
                  <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3 h-3 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-slate-600">
                      <strong className="text-slate-900 font-semibold">{act.user}</strong> {act.action} <span className="text-indigo-600 font-medium">{act.target}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
