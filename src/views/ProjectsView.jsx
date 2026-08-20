import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, FolderKanban, DollarSign, Calendar, Clock, CheckCircle2, Search, ArrowRight, Layers, Users, UserCheck } from 'lucide-react';

export const ProjectsView = () => {
  const {
    projects,
    addProject,
    setActiveTab,
    currentUser,
    servicesCatalog,
    selectedServiceId,
    subRoles,
    users
  } = useApp();

  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const isAdmin = currentUser.role === 'admin';

  // Form State
  const [newProjName, setNewProjName] = useState('');
  const [newCategory, setNewCategory] = useState('Full-Stack Web Development');
  const [newClientName, setNewClientName] = useState('Apex Corporation');
  const [newBudget, setNewBudget] = useState(65000);
  const [newRate, setNewRate] = useState(135);
  const [newDeadline, setNewDeadline] = useState('2026-10-31');
  const [newDesc, setNewDesc] = useState('');

  // Sub-Role Dev Assignments Map
  const [assignedDevs, setAssignedDevs] = useState({
    'Frontend Engineering': 'usr_2',
    'Backend Architecture': 'usr_4',
    'Database & DevOps': 'usr_5',
    'QA & Automation': 'usr_9'
  });

  const filteredProjects = projects.filter(p => {
    const matchesService = selectedServiceId === 'All' || p.service === selectedServiceId;
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchesService && matchesStatus;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProjName) return;

    addProject({
      name: newProjName,
      service: newCategory,
      clientName: newClientName,
      description: newDesc || 'Full-stack software deliverable with assigned dev roles',
      status: 'In Progress',
      budget: Number(newBudget),
      hourlyRate: Number(newRate),
      startDate: new Date().toISOString().split('T')[0],
      deadline: newDeadline,
      assignedDevs: {
        'Frontend Engineering': [assignedDevs['Frontend Engineering'] || 'usr_2'],
        'Backend Architecture': [assignedDevs['Backend Architecture'] || 'usr_4'],
        'Database & DevOps': [assignedDevs['Database & DevOps'] || 'usr_5'],
        'QA & Automation': [assignedDevs['QA & Automation'] || 'usr_9']
      },
      tags: ['Full-Stack', 'React', 'Node.js', 'PostgreSQL']
    });

    setShowAddModal(false);
    setNewProjName('');
    setNewDesc('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-indigo-600" /> Full-Stack Projects & Sub-Role Matrix
          </h1>
          <p className="text-xs text-slate-500">Admin assigns sub-roles (Frontend, Backend, DB, QA) across the 9-member dev team with per-task individual stopwatches</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Full-Stack Project</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          {['All', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Service filter: <strong className="text-indigo-600">{selectedServiceId}</strong> ({filteredProjects.length} projects)
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="clean-card p-6 rounded-xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 hover:border-indigo-500 transition shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {project.service || 'Full-Stack Web Development'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{project.name}</h3>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded font-bold ${
                  project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  {project.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {project.description}
              </p>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Sprint Completion</span>
                  <span className="font-bold text-slate-900">{project.completionPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{ width: `${project.completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Sub-Role Dev Assignment Matrix */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" /> Assigned Dev Roles (9-Team Matrix):
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {subRoles.map((role) => {
                    const devList = project.assignedDevs?.[role] || [];
                    const assignedDevName = users.find(u => devList.includes(u.id))?.name || (role === 'Frontend Engineering' ? 'Sarah Jenkins' : role === 'Backend Architecture' ? 'David Chen' : role === 'Database & DevOps' ? 'Priya Sharma' : 'Ananya Gupta');

                    return (
                      <div key={role} className="p-2 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                        <div className="text-[10px] text-indigo-700 font-bold uppercase">{role}</div>
                        <div className="font-medium text-slate-900 truncate text-[11px]">{assignedDevName}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Budget: <strong className="text-slate-900">${project.budget.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Rate: <strong className="text-slate-900">${project.hourlyRate}/hr</strong></span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Due: {project.deadline}</span>
              <button
                onClick={() => setActiveTab('tasks')}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-semibold flex items-center gap-1 transition"
              >
                <span>View Sub-Role Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Full-Stack Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Create Full-Stack Project & Assign Roles</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full-Stack SaaS Automation Suite"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Service Provided</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  {servicesCatalog.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Assign Devs for each Sub-Role Layer */}
              <div className="space-y-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-xs">Assign Dev Roles across 9-Member Team:</div>
                <div className="grid grid-cols-2 gap-2">
                  {subRoles.map(role => (
                    <div key={role}>
                      <label className="block text-[10px] text-indigo-700 font-bold mb-0.5">{role}</label>
                      <select
                        value={assignedDevs[role] || ''}
                        onChange={(e) => setAssignedDevs({ ...assignedDevs, [role]: e.target.value })}
                        className="w-full p-2 bg-white border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                      >
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.title})</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Total Budget ($)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hourly Billable Rate ($)</label>
                  <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description & Scope</label>
                <textarea
                  rows="2"
                  placeholder="Describe full-stack deliverables..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
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
                  Create Full-Stack Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
