import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Play, Pause, Square, Plus, DollarSign, Calendar, CheckCircle2, User, FileText } from 'lucide-react';

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
    setActiveTab
  } = useApp();

  const [selectedProj, setSelectedProj] = useState(projects[0]?.id || 'proj_1');
  const [selectedTask, setSelectedTask] = useState(tasks[0]?.id || 'tsk_101');
  const [timerNotes, setTimerNotes] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);

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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Stopwatch Control Panel */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6">
        {/* Left: Stopwatch Live Widget */}
        <div className="flex-1 clean-panel p-6 bg-white space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded border border-indigo-200 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeTimer.isRunning ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              Live Stopwatch Timer
            </span>
            <button
              onClick={() => setShowManualModal(true)}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 underline"
            >
              + Manual Entry
            </button>
          </div>

          {/* Big Counter Display */}
          <div className="text-center py-4 space-y-2">
            <div className="text-5xl font-black font-mono tracking-wider text-slate-900">
              {formatTime(activeTimer.elapsedSeconds)}
            </div>
            <div className="text-xs text-slate-500">
              {activeTimer.isRunning ? 'Timer actively recording seconds' : 'Stopwatch ready to start'}
            </div>
          </div>

          {/* Selector Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Target Project</label>
              <select
                value={selectedProj}
                onChange={(e) => setSelectedProj(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (${p.hourlyRate}/hr)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Associated Task</label>
              <select
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                {tasks.filter(t => t.projectId === selectedProj).map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {activeTimer.isRunning ? (
              <button
                onClick={pauseTimer}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Pause className="w-4 h-4" /> Pause Stopwatch
              </button>
            ) : (
              <button
                onClick={() => startTimer(selectedProj, selectedTask, timerNotes)}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Play className="w-4 h-4 fill-current" /> Start Stopwatch
              </button>
            )}

            <button
              onClick={stopAndSaveTimer}
              className="py-3 px-5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Square className="w-4 h-4 fill-current" /> Save & Log
            </button>
          </div>
        </div>

        {/* Right: Unbilled Ledger */}
        <div className="w-full lg:w-80 clean-panel p-6 bg-white flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unbilled Ledger Summary</span>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-xs text-indigo-600 font-semibold">Ready for Invoicing</div>
              <div className="text-3xl font-extrabold text-slate-900">
                ${timeLogs
                  .filter(l => l.billable && !l.invoiced)
                  .reduce((acc, l) => acc + ((l.durationMinutes / 60) * l.hourlyRate), 0)
                  .toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">
                {timeLogs.filter(l => l.billable && !l.invoiced).length} unbilled log entries
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {projects.map((p) => {
              const unbilledForProj = timeLogs.filter(l => l.projectId === p.id && l.billable && !l.invoiced);
              if (unbilledForProj.length === 0) return null;

              return (
                <button
                  key={p.id}
                  onClick={() => handleQuickGenerateInvoice(p.id)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left text-xs flex items-center justify-between transition"
                >
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-500">{unbilledForProj.length} logs ready</div>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
                    Invoice <FileText className="w-3.5 h-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="clean-panel rounded-xl overflow-hidden space-y-4 p-6 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" /> Time Log History & Audit
          </h3>
          <span className="text-xs text-slate-500">{timeLogs.length} entries total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Developer</th>
                <th className="py-3 px-4">Project & Task</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Rate</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {timeLogs.map((log) => {
                const hours = (log.durationMinutes / 60).toFixed(2);
                const val = (hours * log.hourlyRate).toFixed(2);

                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 text-slate-600 font-mono">{log.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{log.userName}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-indigo-600">{log.projectName}</div>
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
                  placeholder="Notes on completed features..."
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
