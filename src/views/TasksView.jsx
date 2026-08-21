import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, CheckSquare, Clock, AlertTriangle, User, Play, Pause, Square, Layers, ShieldCheck, Lock, ChevronDown, ChevronRight, UserCheck, Sparkles } from 'lucide-react';

export const TasksView = () => {
  const {
    tasks,
    projects,
    users,
    servicesCatalog,
    addTask,
    updateTaskAssignee,
    updateTaskStatus,
    updateTaskProgressRequest,
    approveTaskProgress,
    approveAllPendingProgress,
    taskTimers,
    startTaskTimer,
    pauseTaskTimer,
    saveTaskTimerLog,
    currentUser
  } = useApp();

  const [activeServiceId, setActiveServiceId] = useState(servicesCatalog[0]?.name || 'Full-Stack Web Development');
  const [selectedProjectId, setSelectedProjectId] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalLayerTarget, setModalLayerTarget] = useState('Frontend Engineering');

  const isAdmin = currentUser.role === 'admin';

  // Form State for New Task Modal
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProjId, setTaskProjId] = useState(projects[0]?.id || 'proj_1');
  const [taskPriority, setTaskPriority] = useState('High');
  const [taskAssignee, setTaskAssignee] = useState(users[1]?.id || 'usr_2');
  const [taskEstHours, setTaskEstHours] = useState(12);
  const [taskDueDate, setTaskDueDate] = useState('2026-09-05');
  const [taskDesc, setTaskDesc] = useState('');

  // Selected Service metadata
  const currentServiceObj = servicesCatalog.find(s => s.name === activeServiceId) || servicesCatalog[0];

  // Filter tasks for active service and selected project
  const serviceTasks = tasks.filter(t => {
    const matchesService = activeServiceId === 'All' || t.service === activeServiceId;
    const matchesProj = selectedProjectId === 'All' || t.projectId === selectedProjectId;
    return matchesService && matchesProj;
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle) return;

    const proj = projects.find(p => p.id === taskProjId);
    const assignee = users.find(u => u.id === taskAssignee);

    addTask({
      projectId: taskProjId,
      service: activeServiceId,
      layer: modalLayerTarget,
      title: taskTitle,
      description: taskDesc || `Specific task deliverable under ${modalLayerTarget}`,
      priority: taskPriority,
      assigneeId: taskAssignee,
      assigneeName: assignee ? assignee.name : 'Unassigned',
      estimatedHours: Number(taskEstHours),
      dueDate: taskDueDate
    });

    setShowAddModal(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-50 text-red-700 border-red-200';
      case 'High': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Medium': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" /> Hierarchical Task Board & Sub-Role Layers
          </h1>
          <p className="text-xs text-slate-500">Service-based hierarchical breakdown with layer-by-layer dev assignment and individual task stopwatches</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Project Filter */}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 shadow-sm"
          >
            <option value="All">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ADMIN SAVE & APPROVE PROGRESS BANNER */}
      {tasks.some(t => t.pendingApproval) && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 font-bold shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-amber-900 flex items-center gap-2">
                <span>Developer Progress Updates Pending Approval</span>
                <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-black">
                  {tasks.filter(t => t.pendingApproval).length} Pending
                </span>
              </div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Developers have submitted progress updates. Save & approve to dynamically update project completion percentages.
              </p>
            </div>
          </div>

          {isAdmin ? (
            <button
              onClick={approveAllPendingProgress}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-extrabold shadow flex items-center gap-1.5 transition shrink-0"
            >
              <ShieldCheck className="w-4 h-4" /> Save & Approve All Progress Updates
            </button>
          ) : (
            <span className="text-[11px] text-amber-800 font-semibold italic bg-amber-100/60 px-3 py-1 rounded-lg border border-amber-200">
              Awaiting Admin Review & Approval
            </span>
          )}
        </div>
      )}

      {/* LEVEL 1: SERVICES PROVIDED TABS */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-3">
        {servicesCatalog.map((service) => (
          <button
            key={service.id}
            onClick={() => setActiveServiceId(service.name)}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeServiceId === service.name
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{service.name}</span>
          </button>
        ))}
      </div>

      {/* Service Description Banner */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            Selected Service Scope
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-1">{currentServiceObj.name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{currentServiceObj.description}</p>
        </div>

        <div className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200 shrink-0">
          Sub-Role Layers: <strong className="text-indigo-600">{currentServiceObj.layers.length} Layers</strong>
        </div>
      </div>

      {/* LEVEL 2 & 3: LAYER-BY-LAYER SUB-SERVICE PANELS WITH SPECIFIC TASKS */}
      <div className="space-y-6">
        {currentServiceObj.layers.map((layerName) => {
          const layerTasks = serviceTasks.filter(t => t.layer === layerName);

          return (
            <div key={layerName} className="clean-panel p-5 bg-white space-y-4">
              {/* Layer Panel Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-indigo-600"></span>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                    {layerName} Layer
                  </h3>
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {layerTasks.length} Specific Task(s)
                  </span>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setModalLayerTarget(layerName);
                      setShowAddModal(true);
                    }}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 text-xs font-bold rounded-lg transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task to {layerName}</span>
                  </button>
                )}
              </div>

              {/* Tasks List inside Layer */}
              {layerTasks.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  No specific tasks assigned to the {layerName} layer yet. Admin can click "+ Add Task" to assign.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {layerTasks.map((task) => {
                    const timer = taskTimers[task.id] || { isRunning: false, elapsedSeconds: 0 };
                    const proj = projects.find(p => p.id === task.projectId);

                    return (
                      <div
                        key={task.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 hover:border-indigo-400 transition shadow-sm flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${getPriorityBadge(task.priority)} uppercase`}>
                              {task.priority}
                            </span>
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                              className="text-[10px] bg-white border border-slate-200 text-slate-800 rounded px-1.5 py-0.5 focus:outline-none focus:border-indigo-600 font-medium"
                            >
                              <option value="Backlog">Backlog</option>
                              <option value="To Do">To Do</option>
                              <option value="In Progress">In Progress</option>
                              <option value="In Review">In Review</option>
                              <option value="Done">Done</option>
                            </select>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{task.description}</p>
                        </div>

                        {/* LEVEL 4: ADMIN CHOICE TO ASSIGN DEV FROM 9-TEAM */}
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                          <div className="text-[10px] text-slate-500 font-semibold uppercase flex items-center justify-between">
                            <span>Assigned Developer:</span>
                            {isAdmin && <span className="text-indigo-600 font-normal text-[9px]">Admin Re-assign</span>}
                          </div>

                          {isAdmin ? (
                            <select
                              value={task.assigneeId || ''}
                              onChange={(e) => updateTaskAssignee(task.id, e.target.value)}
                              className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-600"
                            >
                              {users.map(u => (
                                <option key={u.id} value={u.id}>
                                  {u.name} ({u.title})
                                </option>
                              ))}
                            </select>
                          ) : (
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-indigo-600" /> {task.assigneeName}
                            </div>
                          )}
                        </div>

                        {/* DYNAMIC TASK PROGRESS & ADMIN SAVE & APPROVE CONTROL */}
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700 text-[11px] flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Progress:
                            </span>
                            <span className="font-mono font-extrabold text-indigo-700 text-xs">
                              {task.progress || 0}% Approved
                            </span>
                          </div>

                          {/* Visual Progress Bar */}
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className={`h-full transition-all duration-300 ${
                                (task.progress || 0) === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${task.progress || 0}%` }}
                            ></div>
                          </div>

                          {/* Pending Admin Approval Badge */}
                          {task.pendingApproval && (
                            <div className="p-1.5 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-800 font-semibold flex items-center justify-between">
                              <span>⏳ Dev requested: <strong>{task.pendingProgress}%</strong></span>
                              <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-extrabold">Pending</span>
                            </div>
                          )}

                          {/* Interactive Slider & Approval Buttons */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span>{isAdmin ? 'Set / Review Progress:' : 'Update Task Progress:'}</span>
                              <span className="font-mono font-bold text-slate-900">{task.pendingProgress ?? task.progress ?? 0}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={task.pendingProgress ?? task.progress ?? 0}
                              onChange={(e) => updateTaskProgressRequest(task.id, e.target.value)}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />

                            {isAdmin ? (
                              <button
                                onClick={() => approveTaskProgress(task.id)}
                                className={`w-full py-1 rounded text-[11px] font-extrabold flex items-center justify-center gap-1 transition shadow-sm ${
                                  task.pendingApproval
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
                                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                }`}
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>{task.pendingApproval ? `✓ Save & Approve Dev's ${task.pendingProgress}%` : 'Save & Approve Progress'}</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => updateTaskProgressRequest(task.id, task.pendingProgress ?? task.progress ?? 0)}
                                className="w-full py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold transition flex items-center justify-center gap-1 border border-slate-300"
                              >
                                <span>Submit Progress Update</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* LEVEL 5: ADMIN-CONTROLLED PER-TASK STOPWATCH */}
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-600 flex items-center gap-1 text-[11px]">
                              <span className={`w-2 h-2 rounded-full ${timer.isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                              Stopwatch:
                            </span>
                            <span className="font-mono text-sm font-extrabold text-slate-900">
                              {formatTimer(timer.elapsedSeconds || 0)}
                            </span>
                          </div>

                          {isAdmin ? (
                            <div className="flex items-center gap-1 pt-0.5">
                              {timer.isRunning ? (
                                <button
                                  onClick={() => pauseTaskTimer(task.id)}
                                  className="flex-1 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-bold flex items-center justify-center gap-1 transition"
                                >
                                  <Pause className="w-3 h-3" /> Pause
                                </button>
                              ) : (
                                <button
                                  onClick={() => startTaskTimer(task.id)}
                                  className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold flex items-center justify-center gap-1 transition"
                                >
                                  <Play className="w-3 h-3 fill-current" /> Start Timer
                                </button>
                              )}
                              <button
                                onClick={() => saveTaskTimerLog(task.id)}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-bold flex items-center gap-1 transition"
                                title="Save Log"
                              >
                                <Square className="w-3 h-3 fill-current" /> Save
                              </button>
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400 italic text-center">
                              Stopwatch Managed by Admin
                            </div>
                          )}
                        </div>

                        {/* Hours breakdown */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                          <span className="font-mono">Logged: <strong className="text-slate-900">{task.loggedHours} / {task.estimatedHours} hrs</strong></span>
                          <span>Due: {task.dueDate}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Task Modal under Specific Layer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Task to {modalLayerTarget}</h3>
                <p className="text-xs text-slate-500">Service: {activeServiceId}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Specific Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Build Web Redesign Components"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Project</label>
                <select
                  value={taskProjId}
                  onChange={(e) => setTaskProjId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assign Dev (9 Team)</label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.title})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={taskEstHours}
                    onChange={(e) => setTaskEstHours(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Task Specification</label>
                <textarea
                  rows="2"
                  placeholder="Task scope details..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition"
                >
                  Add Task to Layer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
