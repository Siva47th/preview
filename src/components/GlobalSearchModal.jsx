import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  FolderKanban,
  CheckSquare,
  Users,
  FileText,
  History,
  ArrowRight,
  X,
  Layers,
  Sparkles,
  Clock,
  Command,
  ExternalLink
} from 'lucide-react';

export const GlobalSearchModal = ({ isOpen, onClose, initialQuery = '' }) => {
  const {
    projects,
    tasks,
    users,
    invoices,
    showcase,
    servicesCatalog,
    setActiveTab,
    setSelectedServiceId
  } = useApp();

  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialQuery]);

  // Keyboard shortcut to close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = (query || '').trim().toLowerCase();

  // Search Results
  const matchedProjects = cleanQuery
    ? projects.filter(p =>
        p.name?.toLowerCase().includes(cleanQuery) ||
        p.clientName?.toLowerCase().includes(cleanQuery) ||
        p.service?.toLowerCase().includes(cleanQuery) ||
        p.description?.toLowerCase().includes(cleanQuery) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(cleanQuery)))
      )
    : [];

  const matchedTasks = cleanQuery
    ? tasks.filter(t =>
        t.title?.toLowerCase().includes(cleanQuery) ||
        t.description?.toLowerCase().includes(cleanQuery) ||
        t.service?.toLowerCase().includes(cleanQuery) ||
        t.layer?.toLowerCase().includes(cleanQuery) ||
        t.assigneeName?.toLowerCase().includes(cleanQuery) ||
        t.status?.toLowerCase().includes(cleanQuery) ||
        t.priority?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedUsers = cleanQuery
    ? users.filter(u =>
        u.name?.toLowerCase().includes(cleanQuery) ||
        u.email?.toLowerCase().includes(cleanQuery) ||
        u.role?.toLowerCase().includes(cleanQuery) ||
        u.subRole?.toLowerCase().includes(cleanQuery) ||
        u.title?.toLowerCase().includes(cleanQuery) ||
        u.specialization?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedInvoices = cleanQuery
    ? invoices.filter(i =>
        i.invoiceNumber?.toLowerCase().includes(cleanQuery) ||
        i.clientName?.toLowerCase().includes(cleanQuery) ||
        i.projectName?.toLowerCase().includes(cleanQuery) ||
        i.status?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const matchedShowcase = cleanQuery
    ? (showcase || []).filter(s =>
        s.title?.toLowerCase().includes(cleanQuery) ||
        s.client?.toLowerCase().includes(cleanQuery) ||
        s.service?.toLowerCase().includes(cleanQuery) ||
        s.summary?.toLowerCase().includes(cleanQuery)
      )
    : [];

  const totalMatches =
    matchedProjects.length +
    matchedTasks.length +
    matchedUsers.length +
    matchedInvoices.length +
    matchedShowcase.length;

  const handleSelect = (tabName, serviceFilter = null) => {
    if (serviceFilter) {
      setSelectedServiceId(serviceFilter);
    }
    setActiveTab(tabName);
    onClose();
  };

  const sampleSuggestions = [
    'Web Development',
    'Frontend',
    'Backend',
    'Database',
    'Testing',
    'In Progress',
    'Acme Corp',
    'Keshavraj',
    'Paid'
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col mt-6 sm:mt-12 text-slate-900 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tasks, developers, invoices, or services..."
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition text-xs"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-flex text-[10px] font-mono text-slate-400 border border-slate-200 bg-white px-2 py-0.5 rounded">
              ESC to close
            </span>
          )}
        </div>

        {/* Search Results Area */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {!cleanQuery ? (
            /* Empty State & Suggestions */
            <div className="space-y-4 py-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-indigo-100">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">What would you like to find?</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Type any keyword to search live across Projects, Tasks, 9 Developers, Invoices, and Archived Deliverables.
                </p>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Popular Searches
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sampleSuggestions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-full text-xs text-slate-600 font-medium transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : totalMatches === 0 ? (
            /* No Results Found State */
            <div className="text-center py-10 space-y-2">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">No matching results found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find anything matching <span className="font-semibold text-slate-800">"{query}"</span>. Try searching for a service layer (e.g. <span className="text-indigo-600 cursor-pointer font-semibold" onClick={() => setQuery('Frontend')}>Frontend</span>), developer name, or project title.
              </p>
            </div>
          ) : (
            /* Dynamic Results Categorized */
            <div className="space-y-5">
              <div className="text-xs text-slate-500 font-semibold flex items-center justify-between pb-1 border-b border-slate-100">
                <span>Search Results</span>
                <span className="text-indigo-600 font-bold">{totalMatches} match{totalMatches > 1 ? 'es' : ''}</span>
              </div>

              {/* 1. Projects Section */}
              {matchedProjects.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5" /> Projects ({matchedProjects.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedProjects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelect('projects', p.service)}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition flex items-center gap-2">
                            <span>{p.name}</span>
                            <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-slate-100 text-slate-600">
                              {p.service}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">Client: {p.clientName} • Budget: ₹{p.budget?.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            p.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {p.status}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Tasks Section */}
              {matchedTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5" /> Tasks ({matchedTasks.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => handleSelect('tasks', t.service)}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition flex items-center gap-2">
                            <span>{t.title}</span>
                            <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {t.layer}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Assigned to: <span className="font-semibold text-slate-700">{t.assigneeName}</span> • Priority: {t.priority}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                            {t.status}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Developers Section */}
              {matchedUsers.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Developers & Team ({matchedUsers.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchedUsers.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => handleSelect('adminusers')}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition cursor-pointer flex items-center gap-3 group"
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 group-hover:border-purple-600 transition"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition truncate">
                            {u.name}
                          </div>
                          <div className="text-[10px] text-purple-700 font-semibold truncate">
                            {u.title || u.subRole}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">{u.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Invoices Section */}
              {matchedInvoices.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Invoices ({matchedInvoices.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedInvoices.map((inv) => (
                      <div
                        key={inv.id}
                        onClick={() => handleSelect('invoices')}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition flex items-center gap-2">
                            <span className="font-mono">{inv.invoiceNumber}</span>
                            <span className="text-[10px] text-slate-500 font-normal">({inv.clientName})</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{inv.projectName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-700">
                            ₹{inv.totalAmount?.toLocaleString('en-IN')}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {inv.status}
                          </span>
                          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Project History Archive Section */}
              {matchedShowcase.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" /> Project History ({matchedShowcase.length})
                  </div>
                  <div className="space-y-1.5">
                    {matchedShowcase.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleSelect('showcase')}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition cursor-pointer flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition">
                            {s.title}
                          </div>
                          <p className="text-[11px] text-slate-500">{s.client} • {s.service}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Click any item to jump directly to its workspace tab</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
