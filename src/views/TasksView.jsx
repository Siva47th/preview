import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, CheckSquare, Clock, AlertTriangle, User, Play, MoveRight, Tag } from 'lucide-react';

export const TasksView = () => {
  const {
    tasks,
    projects,
    users,
    addTask,
    updateTaskStatus,
    startTimer,
    setActiveTab,
    currentUser
  } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskProjId, setTaskProjId] = useState(projects[0]?.id || 'proj_1');
  const [taskPriority, setTaskPriority] = useState('High');
  const [taskAssignee, setTaskAssignee] = useState(users[1]?.id || 'usr_2');
  const [taskEstHours, setTaskEstHours] = useState(8);
  const [taskDueDate, setTaskDueDate] = useState('2026-08-30');
  const [taskDesc, setTaskDesc] = useState('');

  const columns = [
    { id: 'Backlog', title: 'Backlog', color: 'border-slate-200 bg-slate-50' },
    { id: 'To Do', title: 'To Do', color: 'border-blue-200 bg-blue-50/30' },
    { id: 'In Progress', title: 'In Progress', color: 'border-indigo-200 bg-indigo-50/30' },
    { id: 'In Review', title: 'In Review', color: 'border-purple-200 bg-purple-50/30' },
    { id: 'Done', title: 'Done', color: 'border-emerald-200 bg-emerald-50/30' }
  ];

  const filteredTasks = selectedProjectId === 'All'
    ? tasks
    : tasks.filter(t => t.projectId === selectedProjectId);

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle) return;

    const assignee = users.find(u => u.id === taskAssignee);
    addTask({
      projectId: taskProjId,
      title: taskTitle,
      description: taskDesc || 'Sprint task deliverable',
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

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-50 text-red-700 border-red-200';
      case 'High': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Medium': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-600" /> Sprint Kanban Task Board
          </h1>
          <p className="text-xs text-slate-500">Track real-time engineering deliverables, assignees, and logged hours</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 shadow-sm"
          >
            <option value="All">All Projects ({tasks.length} tasks)</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {currentUser.role !== 'client' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`rounded-xl p-4 border ${col.color} flex flex-col justify-between min-h-[600px] shadow-sm`}
            >
              <div>
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                  <span className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    {col.title}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Task Cards */}
                <div className="space-y-3">
                  {colTasks.map((task) => {
                    const proj = projects.find(p => p.id === task.projectId);

                    return (
                      <div
                        key={task.id}
                        className="bg-white p-4 rounded-lg space-y-3 border border-slate-200 hover:border-indigo-500 shadow-sm transition group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${getPriorityStyle(task.priority)} uppercase`}>
                            {task.priority}
                          </span>
                          <span className="text-[10px] text-indigo-600 font-semibold truncate max-w-[120px]">
                            {proj ? proj.name : 'Project'}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                          {task.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Hours breakdown */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-cyan-600" />
                            {task.loggedHours} / {task.estimatedHours} hrs
                          </span>
                          <span className="text-slate-400">Due: {task.dueDate}</span>
                        </div>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                            <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[9px] border border-indigo-200">
                              {task.assigneeName ? task.assigneeName.charAt(0) : 'U'}
                            </div>
                            <span className="truncate max-w-[80px] text-slate-600">{task.assigneeName}</span>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex items-center gap-1">
                            {currentUser.role !== 'client' && (
                              <button
                                onClick={() => {
                                  startTimer(task.projectId, task.id, `Timer for task: ${task.title}`);
                                  setActiveTab('timetracking');
                                }}
                                className="p-1 rounded bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white transition border border-indigo-200"
                                title="Start Stopwatch Timer"
                              >
                                <Play className="w-3 h-3 fill-current" />
                              </button>
                            )}

                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                              className="text-[9px] bg-slate-50 border border-slate-200 text-slate-700 rounded px-1.5 py-1 focus:outline-none focus:border-indigo-600"
                            >
                              {columns.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Create Kanban Task</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement OAuth JWT Refresh Tokens"
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
                  <label className="block text-slate-700 font-semibold mb-1">Priority Level</label>
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
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assignee</label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
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
                  placeholder="Task details and acceptance criteria..."
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
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
