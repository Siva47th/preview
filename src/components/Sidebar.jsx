import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Clock,
  FileText,
  Award,
  ShieldCheck,
  Zap,
  Users,
  Layers,
  History,
  CircleUser,
  ZoomIn
} from 'lucide-react';
import { AvatarZoomModal } from './AvatarZoomModal';
import logoImg from '../assets/freewheel-logo.png';

export const Sidebar = () => {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    servicesCatalog,
    selectedServiceId,
    setSelectedServiceId
  } = useApp();

  const [showZoom, setShowZoom] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Jobs & Projects', icon: FolderKanban },
    { id: 'tasks', label: 'Tasks Board', icon: CheckSquare },
    { id: 'timetracking', label: 'Time Tracking', icon: Clock },
    { id: 'invoices', label: 'Invoices & Billing', icon: FileText },
    { id: 'adminusers', label: 'Dev Management', icon: Users, badge: 'Admin' },
    { id: 'showcase', label: 'Project History', icon: History }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen select-none">
      <div>
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 px-2 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
              <img
                src={logoImg}
                alt="Freewheel"
                className="h-6 w-auto object-contain brightness-110"
              />
            </div>
            <div>
              <h1 className="font-bold text-xs text-slate-900 tracking-tight leading-none">FREEWHEEL</h1>
              <span className="text-[9px] text-indigo-600 font-semibold uppercase tracking-wider">Tech Solutions</span>
            </div>
          </div>
        </div>

        {/* Job Fields Category Menu */}
        <div className="px-3 py-2 border-b border-slate-100">
          <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-indigo-600" /> Services Provided
          </div>
          <div className="space-y-0.5 mt-1">
            <button
              onClick={() => setSelectedServiceId('All')}
              className={`w-full text-left px-2.5 py-1 rounded text-xs font-medium transition ${
                selectedServiceId === 'All'
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Services
            </button>
            {servicesCatalog.map((service) => (
              <button
                key={service.id}
                onClick={() => setSelectedServiceId(service.name)}
                className={`w-full text-left px-2.5 py-1 rounded text-xs font-medium transition ${
                  selectedServiceId === service.name
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {service.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-indigo-700 border border-slate-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logged-In User Card */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div
              onClick={() => setShowZoom(true)}
              className="relative shrink-0 group cursor-pointer"
              title="Click to Zoom Profile Picture"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover border-2 border-indigo-600 group-hover:opacity-85 transition" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
              <div className="absolute inset-0 bg-slate-950/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition">
                <ZoomIn className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{currentUser.title || currentUser.subRole || 'Developer'}</div>
            </div>
            <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
              currentUser.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
            }`}>
              {currentUser.role === 'admin' ? 'Admin' : 'Dev'}
            </span>
          </div>
        </div>
      </div>

      {/* Avatar Zoom Lightbox Modal */}
      <AvatarZoomModal
        user={currentUser}
        isOpen={showZoom}
        onClose={() => setShowZoom(false)}
      />
    </aside>
  );
};

