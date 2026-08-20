import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, FolderKanban, DollarSign, Calendar, Clock, CheckCircle2, Search, ArrowRight } from 'lucide-react';

export const ProjectsView = () => {
  const { projects, addProject, setActiveTab, currentUser } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newProjName, setNewProjName] = useState('');
  const [newClientName, setNewClientName] = useState('Apex Corporation');
  const [newBudget, setNewBudget] = useState(35000);
  const [newRate, setNewRate] = useState(125);
  const [newDeadline, setNewDeadline] = useState('2026-10-31');
  const [newDesc, setNewDesc] = useState('');
  const [newTags, setNewTags] = useState('React Native, Node.js, AWS');

  const filteredProjects = filterStatus === 'All'
    ? projects
    : projects.filter(p => p.status === filterStatus);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newProjName) return;

    addProject({
      name: newProjName,
      clientId: 'usr_3',
      clientName: newClientName,
      description: newDesc || 'Enterprise agency software deliverable',
      status: 'In Progress',
      budget: Number(newBudget),
      hourlyRate: Number(newRate),
      startDate: new Date().toISOString().split('T')[0],
      deadline: newDeadline,
      tags: newTags.split(',').map(t => t.trim())
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
            <FolderKanban className="w-6 h-6 text-indigo-600" /> Active Agency Projects
          </h1>
          <p className="text-xs text-slate-500">Manage client deliverables, hourly rates, and milestone progress</p>
        </div>

        {currentUser.role !== 'client' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
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
            {status} ({status === 'All' ? projects.length : projects.filter(p => p.status === status).length})
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="clean-card p-6 rounded-xl border border-slate-200 bg-white flex flex-col justify-between space-y-4 hover:border-indigo-500 transition shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {project.clientName}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">{project.name}</h3>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded font-bold ${
                  project.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  {project.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              {/* Progress */}
              <div className="space-y-1 pt-2">
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

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Due: {project.deadline}</span>
              <button
                onClick={() => setActiveTab('tasks')}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-semibold flex items-center gap-1 transition"
              >
                <span>View Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Create New Project</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Customer Portal Overhaul"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                />
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
                  rows="3"
                  placeholder="Describe scope deliverables..."
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
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
