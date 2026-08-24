import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Plus, ShieldCheck, UserCheck, Code, IndianRupee, Lock, Trash2, Layers, Key, Edit3, Save, Eye, EyeOff, ShieldAlert, ZoomIn } from 'lucide-react';
import { AvatarZoomModal } from '../components/AvatarZoomModal';

export const AdminUsersView = () => {
  const { users, addUser, updateUser, deleteUser, currentUser, servicesCatalog } = useApp();

  // Derive sub-role layers from servicesCatalog
  const subRoles = [...new Set(servicesCatalog.flatMap(s => s.layers))];
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPasswordMap, setShowPasswordMap] = useState({});
  const [zoomedUser, setZoomedUser] = useState(null);

  // Add Dev Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('dev123');
  const [newTitle, setNewTitle] = useState('');
  const [newSpec, setNewSpec] = useState('Web Development');
  const [newSubRole, setNewSubRole] = useState('Frontend');
  const [newRate, setNewRate] = useState(10500);
  const [newRole, setNewRole] = useState('dev');

  const isAdmin = currentUser.role === 'admin';

  const togglePasswordVisibility = (userId) => {
    setShowPasswordMap(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleAddDev = (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    addUser({
      name: newName,
      email: newEmail,
      password: newPassword || 'dev123',
      title: newTitle || 'Engineering Specialist',
      specialization: newSpec,
      subRole: newSubRole,
      hourlyRate: Number(newRate),
      role: newRole,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`
    });

    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewPassword('dev123');
    setNewTitle('');
  };

  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      password: editingUser.password,
      title: editingUser.title,
      specialization: editingUser.specialization,
      subRole: editingUser.subRole,
      hourlyRate: Number(editingUser.hourlyRate),
      role: editingUser.role
    });

    setEditingUser(null);
  };

  const handleDeleteUser = (usr) => {
    if (usr.id === currentUser.id) {
      alert("You cannot delete your own logged-in Admin account!");
      return;
    }
    if (window.confirm(`Are you sure you want to remove ${usr.name} from the agency team?`)) {
      deleteUser(usr.id);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" /> Admin Developer Team & Credentials Portal
          </h1>
          <p className="text-xs text-slate-500">Manage developer sub-role layers, passwords, hourly rates, and workspace authentication credentials</p>
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

      {/* Access Denied Warning Banner for non-admin devs */}
      {!isAdmin && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <div className="text-xs font-bold text-amber-900">Developer View Only (Read-Only Mode)</div>
            <div className="text-[11px] text-amber-800">
              Only the Agency Admin can modify developer credentials, edit sub-roles, or change team passwords.
            </div>
          </div>
        </div>
      )}

      {/* Security & Password Guard Banner */}
      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
          <div className="text-xs text-slate-700">
            <strong className="text-indigo-900">Secured Authentication Guard Active.</strong> Admin has total authority to create developers, assign passwords, and control workspace access credentials.
          </div>
        </div>
        <div className="text-[11px] font-bold text-indigo-700 bg-white px-3 py-1 rounded border border-indigo-200 shrink-0">
          {users.length} Active Accounts
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((usr) => (
          <div
            key={usr.id}
            className="clean-card p-6 bg-white space-y-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setZoomedUser(usr)}
                    className="relative group cursor-pointer shrink-0"
                    title={`Click to zoom ${usr.name}'s profile picture`}
                  >
                    <img src={usr.avatar} alt={usr.name} className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 group-hover:border-indigo-600 transition shadow-sm" />
                    <div className="absolute inset-0 bg-slate-950/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{usr.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{usr.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded font-bold uppercase ${
                  usr.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                }`}>
                  {usr.role}
                </span>
              </div>

              <div className="text-xs text-slate-600 font-medium">
                Title: <strong className="text-slate-900">{usr.title}</strong>
              </div>

              {/* Sub-Role & Category Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[9px] text-slate-400 font-semibold uppercase">Specialization</div>
                  <div className="font-bold text-slate-900 text-[11px] truncate">{usr.specialization || 'Web Development'}</div>
                </div>
                <div className="p-2 rounded bg-indigo-50 border border-indigo-200">
                  <div className="text-[9px] text-indigo-700 font-semibold uppercase">Sub-Role Layer</div>
                  <div className="font-bold text-indigo-700 text-[11px] truncate">{usr.subRole || 'Frontend'}</div>
                </div>
              </div>

              {/* Password Indicator Box - Restricted to Admin Only */}
              <div className="p-2.5 rounded-lg bg-slate-900 text-white flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Password:</span>
                  <span className="font-bold text-emerald-400">
                    {isAdmin
                      ? (showPasswordMap[usr.id] ? (usr.password || 'dev123') : '••••••••')
                      : '•••••••• (Protected)'}
                  </span>
                </div>
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(usr.id)}
                    className="text-slate-400 hover:text-white transition"
                    title="Toggle Password Preview (Admin Only)"
                  >
                    {showPasswordMap[usr.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-500 font-sans italic">Admin Only</span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>Hourly Rate: <strong className="text-slate-900">₹{usr.hourlyRate.toLocaleString('en-IN')}/hr</strong></span>
              </div>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setEditingUser({ ...usr })}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-800 text-slate-700 hover:text-white rounded text-xs font-bold transition flex items-center gap-1 flex-1 justify-center"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit & Change Password
                </button>

                {usr.id !== currentUser.id && (
                  <button
                    onClick={() => handleDeleteUser(usr)}
                    className="p-1.5 rounded text-red-600 hover:bg-red-50 transition"
                    title="Remove Team Member"
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
              <h3 className="text-base font-bold text-slate-900">Add New Team Member & Credentials</h3>
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address (Login ID)</label>
                <input
                  type="email"
                  required
                  placeholder="liam@freewheel.io"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Login Password</label>
                <input
                  type="text"
                  required
                  placeholder="Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 font-mono font-bold text-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sub-Role Layer</label>
                  <select
                    value={newSubRole}
                    onChange={(e) => setNewSubRole(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 font-semibold"
                  >
                    {subRoles.map(sr => (
                      <option key={sr} value={sr}>{sr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-lg transition shadow"
                >
                  Save Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Developer & Change Password Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Edit Member & Change Password</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-700 text-xs font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Change Password</label>
                <input
                  type="text"
                  required
                  value={editingUser.password || 'dev123'}
                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold text-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Job Title</label>
                <input
                  type="text"
                  value={editingUser.title}
                  onChange={(e) => setEditingUser({ ...editingUser, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Sub-Role Layer</label>
                  <select
                    value={editingUser.subRole || 'Frontend'}
                    onChange={(e) => setEditingUser({ ...editingUser, subRole: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  >
                    {subRoles.map(sr => (
                      <option key={sr} value={sr}>{sr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={editingUser.hourlyRate}
                    onChange={(e) => setEditingUser({ ...editingUser, hourlyRate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-lg transition shadow"
                >
                  Update Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Picture Fullscreen HD Zoom Modal */}
      <AvatarZoomModal
        user={zoomedUser}
        isOpen={!!zoomedUser}
        onClose={() => setZoomedUser(null)}
      />
    </div>
  );
};
