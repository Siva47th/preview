import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Plus, ShieldCheck, UserCheck, Code, DollarSign, Lock, Trash2, Layers } from 'lucide-react';

export const AdminUsersView = () => {
  const { users, addUser, updateUser, deleteUser, currentUser, servicesCatalog } = useApp();

  // Derive sub-role layers from servicesCatalog
  const subRoles = [...new Set(servicesCatalog.flatMap(s => s.layers))];
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Dev Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSpec, setNewSpec] = useState('Full-Stack Web App');
  const [newSubRole, setNewSubRole] = useState('Frontend');
  const [newRate, setNewRate] = useState(125);
  const [newRole, setNewRole] = useState('dev');

  const isAdmin = currentUser.role === 'admin';

  const handleAddDev = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    addUser({
      name: newName,
      email: newEmail,
      title: newTitle || 'Engineer',
      specialization: newSpec,
      subRole: newSubRole,
      hourlyRate: Number(newRate),
      role: newRole
    });

    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewTitle('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" /> Admin 9-Member Dev Team Management
          </h1>
          <p className="text-xs text-slate-500">Manage developer roles across Frontend, Backend, Database & DevOps, and QA sub-role layers</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {/* Stopwatch Permission Banner */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
          <div className="text-xs text-slate-700">
            <strong className="text-indigo-900">Per-Task Individual Stopwatches Active.</strong> Every project and task maintains its own independent timer counter under Admin control.
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((usr) => (
          <div
            key={usr.id}
            className="clean-card p-6 bg-white space-y-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={usr.avatar} alt={usr.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{usr.name}</h3>
                    <p className="text-xs text-slate-500">{usr.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  usr.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                }`}>
                  {usr.role}
                </span>
              </div>

              <div className="text-xs text-slate-600 font-medium">
                Title: <strong className="text-slate-900">{usr.title}</strong>
              </div>

              {/* Sub-Role & Field Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Category</div>
                  <div className="font-bold text-slate-900 text-[11px] truncate">{usr.specialization || 'Full-Stack'}</div>
                </div>
                <div className="p-2 rounded bg-indigo-50 border border-indigo-200">
                  <div className="text-[9px] text-indigo-700 font-semibold uppercase">Sub-Role</div>
                  <div className="font-bold text-indigo-700 text-[11px] truncate">{usr.subRole || 'Frontend'}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>Hourly Rate: <strong className="text-slate-900">${usr.hourlyRate}/hr</strong></span>
                <span className="text-[10px] text-slate-400">
                  {usr.role === 'admin' ? 'Timer Manager' : 'Dev Assignee'}
                </span>
              </div>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                <select
                  value={usr.subRole || 'Frontend'}
                  onChange={(e) => updateUser(usr.id, { subRole: e.target.value })}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 text-slate-700 rounded text-[11px] focus:outline-none focus:border-indigo-600 flex-1"
                >
                  {subRoles.map(sr => (
                    <option key={sr} value={sr}>{sr}</option>
                  ))}
                </select>

                {usr.id !== currentUser.id && (
                  <button
                    onClick={() => deleteUser(usr.id)}
                    className="p-1.5 rounded text-red-600 hover:bg-red-50 transition"
                    title="Remove User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Dev Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Add 9-Member Dev Team Specialist</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleAddDev} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Parker"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="liam@freewheel.io"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sub-Role Layer</label>
                  <select
                    value={newSubRole}
                    onChange={(e) => setNewSubRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  >
                    {subRoles.map(sr => (
                      <option key={sr} value={sr}>{sr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                </div>
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
                  Add Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
