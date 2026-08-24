import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Play, Pause, Square, Plus, IndianRupee, Calendar, CheckCircle2, User, FileText, Lock, Layers } from 'lucide-react';

export const TimeTrackingView = () => {
  const {
    timeLogs,
    projects,
    tasks,
    taskTimers,
    startTaskTimer,
    pauseTaskTimer,
    saveTaskTimerLog,
    addTimeLog,
    currentUser,
    createInvoiceFromTimeLogs,
    setActiveTab,
    servicesCatalog
  } = useApp();

  const [selectedProjFilter, setSelectedProjFilter] = useState('All');
  const [selectedSubRoleFilter, setSelectedSubRoleFilter] = useState('All');

  // Derive all available layers from servicesCatalog
  const allLayers = servicesCatalog.flatMap(s => s.layers);
  const [showManualModal, setShowManualModal] = useState(false);

  const isAdmin = currentUser.role === 'admin';

  // Manual Log Form State
  const [manualProjId, setManualProjId] = useState(projects[0]?.id || 'proj_1');
  const [manualTaskId, setManualTaskId] = useState(tasks[0]?.id || 'tsk_101');
  const [manualHours, setManualHours] = useState(2.5);
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualNotes, setManualNotes] = useState('');

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === manualProjId);
    const task = tasks.find(t => t.id === manualTaskId);

    addTimeLog({
      projectId: manualProjId,
      projectName: proj ? proj.name : 'Project',
      category: proj ? proj.category : 'Full-Stack Web App',
      subRole: task ? task.subRole : 'Frontend',
      taskId: manualTaskId,
      taskTitle: task ? task.title : 'Engineering Work',
      userId: currentUser.id,
      userName: currentUser.name,
      durationMinutes: Math.round(Number(manualHours) * 60),
      hourlyRate: currentUser.hourlyRate || (proj ? (proj.hourlyRate || 10500) : 10500),
      billable: true,
      invoiced: false,
      date: manualDate,
      notes: manualNotes || 'Manual time log entry'
    });

    setShowManualModal(false);
    setManualNotes('');
  };

  const handleQuickGenerateInvoice = (projId) => {
    const inv = createInvoiceFromTimeLogs(projId);
    if (inv) {
      setActiveTab('invoices');
    }
  };

  const filteredLogs = timeLogs.filter(log => {
    const matchesProj = selectedProjFilter === 'All' || log.projectId === selectedProjFilter;
    const matchesSubRole = selectedSubRoleFilter === 'All' || log.subRole === selectedSubRoleFilter;
    return matchesProj && matchesSubRole;
  });

  // Find tasks that currently have timers running or accumulated time
  const activeTimerTaskIds = Object.keys(taskTimers || {}).filter(id => taskTimers[id]?.isRunning);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600" /> Time Tracking & Task Stopwatches
          </h1>
          <p className="text-xs text-slate-500">Per-task individual stopwatches managed by Admin across sub-role layers (Frontend, Backend, DB, QA)</p>
        </div>

        <button
          onClick={() => setShowManualModal(true)}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Manual Time Log</span>
        </button>
      </div>

      {/* Active Running Task Stopwatches Section */}
      <div className="clean-panel p-5 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-sm font-bold text-slate-900">Per-Task Individual Stopwatches Matrix</h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-semibold">
              {activeTimerTaskIds.length} Timer(s) Currently Running
            </span>
          </div>
          {!isAdmin && (
            <span className="text-[11px] text-slate-400 italic flex items-center gap-1">
              <Lock className="w-3 h-3" /> Managed by Agency Admin
            </span>
          )}
        </div>

        {/* Task Stopwatches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => {
            const timer = taskTimers[task.id] || { isRunning: false, elapsedSeconds: 0 };
            const proj = projects.find(p => p.id === task.projectId);

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition ${
                  timer.isRunning
                    ? 'bg-indigo-50/50 border-indigo-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[9px] bg-white text-indigo-700 font-bold px-2 py-0.5 rounded border border-slate-200 uppercase">
                    {task.subRole || 'Frontend'}
                  </span>
                  <span className="font-mono text-base font-extrabold text-slate-900">
                    {formatTime(timer.elapsedSeconds || 0)}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mt-2 truncate">{task.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{proj ? proj.name : 'Project'} • Assignee: {task.assigneeName}</p>

                {isAdmin ? (
                  <div className="flex items-center gap-1.5 pt-3">
                    {timer.isRunning ? (
                      <button
                        onClick={() => pauseTaskTimer(task.id)}
                        className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold flex items-center justify-center gap-1 transition"
                      >
                        <Pause className="w-3.5 h-3.5" /> Pause Timer
                      </button>
                    ) : (
                      <button
                        onClick={() => startTaskTimer(task.id)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center justify-center gap-1 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Start Timer
                      </button>
                    )}
                    <button
                      onClick={() => saveTaskTimerLog(task.id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold flex items-center gap-1 transition"
                      title="Save Log"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" /> Save
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 italic text-center pt-2">
                    Timing Controlled by Admin
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Unbilled Ledger & Quick Invoice Generation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="clean-panel p-5 bg-white space-y-2">
          <div className="text-xs font-semibold text-slate-500">Unbilled Hours Total</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {(timeLogs.filter(l => l.billable && !l.invoiced).reduce((acc, l) => acc + l.durationMinutes, 0) / 60).toFixed(1)} hrs
          </div>
          <div className="text-[11px] text-indigo-600 font-mono font-medium">
            ₹{timeLogs
              .filter(l => l.billable && !l.invoiced)
              .reduce((acc, l) => acc + ((l.durationMinutes / 60) * l.hourlyRate), 0)
              .toLocaleString('en-IN')} unbilled value
          </div>
        </div>

        <div className="clean-panel p-5 bg-white space-y-2 col-span-2 flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-500">Generate Invoice from Unbilled Logs</div>
          <div className="flex flex-wrap gap-2 pt-1">
            {projects.map((p) => {
              const unbilledForProj = timeLogs.filter(l => l.projectId === p.id && l.billable && !l.invoiced);
              if (unbilledForProj.length === 0) return null;

              return (
                <button
                  key={p.id}
                  onClick={() => handleQuickGenerateInvoice(p.id)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Invoice for {p.name} ({unbilledForProj.length} logs)</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time Logs Table */}
      <div className="clean-panel rounded-xl overflow-hidden space-y-4 p-6 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" /> Time Log History & Audit
            </h3>
            <p className="text-xs text-slate-500">Audit logged hours categorized by Sub-Roles (Frontend, Backend, Database & DevOps, QA & Automation)</p>
          </div>

          {/* Sub-Role & Project Filters */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSubRoleFilter}
              onChange={(e) => setSelectedSubRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
            >
              <option value="All">All Layers</option>
              {[...new Set(allLayers)].map(lr => (
                <option key={lr} value={lr}>{lr}</option>
              ))}
            </select>

            <select
              value={selectedProjFilter}
              onChange={(e) => setSelectedProjFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
            >
              <option value="All">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] bg-slate-50">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Sub-Role Layer</th>
                <th className="py-3 px-4">Developer</th>
                <th className="py-3 px-4">Project & Task</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Rate</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                const hours = (log.durationMinutes / 60).toFixed(2);
                const val = (hours * log.hourlyRate).toFixed(2);

                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-600 font-mono">{log.date}</td>
                    <td className="py-3 px-4 font-bold text-indigo-700">
                      <span className="bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-[10px]">
                        {log.subRole || 'Frontend'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{log.userName}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{log.projectName}</div>
                      <div className="text-[11px] text-slate-500">{log.taskTitle}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{hours} hrs</td>
                    <td className="py-3 px-4 text-slate-500">₹{log.hourlyRate.toLocaleString('en-IN')}/hr</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600">₹{Number(val).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-right">
                      {log.invoiced ? (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Invoiced
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Unbilled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Time Entry Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Manual Time Log Entry</h3>
              <button onClick={() => setShowManualModal(false)} className="text-slate-400 hover:text-slate-700 text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Project</label>
                <select
                  value={manualProjId}
                  onChange={(e) => setManualProjId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Task</label>
                <select
                  value={manualTaskId}
                  onChange={(e) => setManualTaskId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  {tasks.filter(t => t.projectId === manualProjId).map(t => (
                    <option key={t.id} value={t.id}>{t.title} ({t.subRole})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hours Logged</label>
                  <input
                    type="number"
                    step="0.25"
                    value={manualHours}
                    onChange={(e) => setManualHours(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Work Notes</label>
                <textarea
                  rows="2"
                  placeholder="Notes on completed deliverables..."
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition"
                >
                  Save Time Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
