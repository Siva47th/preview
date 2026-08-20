import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Play, Pause, Square, Plus, DollarSign, Calendar, CheckCircle2, User, FileText, Lock } from 'lucide-react';

export const TimeTrackingView = () => {
  const {
    timeLogs,
    projects,
    tasks,
    activeTimer,
    startTimer,
    pauseTimer,
    stopAndSaveTimer,
    addTimeLog,
    currentUser,
    createInvoiceFromTimeLogs,
    setActiveTab,
    selectedCategory,
    categories
  } = useApp();

  const [selectedProj, setSelectedProj] = useState(projects[0]?.id || 'proj_1');
  const [selectedTask, setSelectedTask] = useState(tasks[0]?.id || 'tsk_101');
  const [timerNotes, setTimerNotes] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [logCategoryFilter, setLogCategoryFilter] = useState('All');

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
      category: proj ? proj.category : 'Web Development',
      taskId: manualTaskId,
      taskTitle: task ? task.title : 'Engineering Work',
      userId: currentUser.id,
      userName: currentUser.name,
      durationMinutes: Math.round(Number(manualHours) * 60),
      hourlyRate: proj ? proj.hourlyRate : 125,
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

  const filteredLogs = logCategoryFilter === 'All'
    ? timeLogs
    : timeLogs.filter(l => l.category === logCategoryFilter);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Compact Stopwatch Control Panel */}
      <div className="clean-panel p-4 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Compact Timer Counter */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-extrabold text-slate-900">
                {formatTime(activeTimer.elapsedSeconds)}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                activeTimer.isRunning ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}>
                {activeTimer.isRunning ? 'Stopwatch Running' : 'Timer Paused'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {isAdmin ? 'Admin Timing Manager' : 'Stopwatch facilities managed exclusively by Admin'}
            </div>
          </div>
        </div>

        {/* Compact Selectors & Admin Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {isAdmin ? (
            <>
              <select
                value={selectedProj}
                onChange={(e) => setSelectedProj(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>

              {activeTimer.isRunning ? (
                <button
                  onClick={pauseTimer}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition"
                >
                  <Pause className="w-3.5 h-3.5" /> Pause
                </button>
              ) : (
                <button
                  onClick={() => startTimer(selectedProj, selectedTask, timerNotes)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Start
                </button>
              )}

              <button
                onClick={stopAndSaveTimer}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition"
              >
                <Square className="w-3.5 h-3.5 fill-current" /> Save
              </button>
            </>
          ) : (
            <div className="text-xs text-slate-500 italic bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> Admin Timing Permission Guard
            </div>
          )}

          <button
            onClick={() => setShowManualModal(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Manual Log
          </button>
        </div>
      </div>

      {/* Logs Table with Category Filter */}
      <div className="clean-panel rounded-xl overflow-hidden space-y-4 p-6 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" /> Time Log History & Field Audit
            </h3>
            <p className="text-xs text-slate-500">View logged hours categorized by Web Development, Automation, and App Development fields</p>
          </div>

          {/* Filter by Category */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Field:</span>
            <select
              value={logCategoryFilter}
              onChange={(e) => setLogCategoryFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
            >
              <option value="All">All Job Fields</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] bg-slate-50">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Field / Category</th>
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
                        {log.category || 'Web Development'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{log.userName}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{log.projectName}</div>
                      <div className="text-[11px] text-slate-500">{log.taskTitle}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{hours} hrs</td>
                    <td className="py-3 px-4 text-slate-500">${log.hourlyRate}/hr</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600">${val}</td>
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
                    <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
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
                    <option key={t.id} value={t.id}>{t.title}</option>
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
