import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, FolderCheck, IndianRupee, Clock, CheckCircle2, Users, Layers, Printer, FileText, Search, ShieldCheck } from 'lucide-react';

export const ProjectHistoryView = () => {
  const { showcase, setActiveTab, sendChatMessage } = useApp();
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [filterService, setFilterService] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const services = ['All', 'Full-Stack Web Development', 'App Development', 'AI & Cloud Automation'];

  const historyItems = showcase || [];

  const filteredHistory = historyItems.filter(item => {
    const matchesService = filterService === 'All' || item.service === filterService;
    const matchesQuery = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesService && matchesQuery;
  });

  const totalBilledAll = historyItems.reduce((acc, item) => acc + (item.finalBilled || 10080000), 0);
  const totalHoursAll = historyItems.reduce((acc, item) => acc + (item.totalLoggedHours || 500), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Banner */}
      <div className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <History className="w-3.5 h-3.5 text-indigo-600" /> Internal Management Operating Archive
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Project History & Archived Deliverables
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Historical audit repository of completed client projects, sub-role team logs, final billed revenue, and verified technical deliverables.
          </p>
        </div>

        {/* Management KPI Summary */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 shrink-0">
          <div className="text-center px-2">
            <div className="text-lg font-bold text-emerald-600 font-mono">₹{(totalBilledAll / 10000000).toFixed(2)}Cr</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Archived Billed</div>
          </div>
          <div className="text-center px-2 border-x border-slate-200">
            <div className="text-lg font-bold text-indigo-600 font-mono">{totalHoursAll} hrs</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Hours Audited</div>
          </div>
          <div className="text-center px-2">
            <div className="text-lg font-bold text-purple-600 font-mono">{historyItems.length} Handover</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">Projects Closed</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {services.map((srv) => (
            <button
              key={srv}
              onClick={() => setFilterService(srv)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                filterService === srv
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {srv}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search project history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Historical Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="clean-card rounded-xl overflow-hidden bg-white border border-slate-200 flex flex-col justify-between hover:border-indigo-400 transition shadow-sm"
          >
            <div>
              {/* Card Header Image */}
              <div className="relative h-44 bg-slate-100 overflow-hidden border-b border-slate-200">
                <img
                  src={item.heroImage}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-90 hover:opacity-100 transition"
                />
                <span className="absolute top-3 left-3 bg-emerald-700 text-white text-[9px] font-extrabold px-2.5 py-1 rounded shadow flex items-center gap-1 uppercase tracking-wider">
                  <FolderCheck className="w-3 h-3" /> Archived & Handed Over
                </span>
                <span className="absolute bottom-3 right-3 bg-slate-900/90 text-white text-xs font-mono font-bold px-2.5 py-1 rounded border border-slate-700">
                  ₹{(item.finalBilled || 10080000).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3.5">
                <div>
                  <div className="text-xs text-indigo-600 font-semibold mb-1 flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.client}</span>
                    <span className="text-[11px] font-mono text-slate-500">{item.completionDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {item.summary}
                </p>

                {/* Sub-Role Layer Audit Preview */}
                {item.layerBreakdown && (
                  <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-between">
                      <span>Sub-Role Engineering Audit:</span>
                      <span className="text-indigo-600 font-mono font-bold">{item.totalLoggedHours} hrs</span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      {item.layerBreakdown.map((layer, idx) => (
                        <div key={idx} className="flex items-center justify-between text-slate-700">
                          <span className="truncate max-w-[150px] font-medium">• {layer.layer}</span>
                          <span className="font-mono text-slate-500 text-[10px]">{layer.dev} ({layer.hours}h)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Deliverables Preview */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Verified Deliverables:</div>
                  <div className="space-y-1">
                    {item.deliverables.slice(0, 3).map((d, idx) => (
                      <div key={idx} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.techStack.map((tech, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Action */}
            <div className="p-5 pt-0">
              <button
                onClick={() => setSelectedHistoryItem(item)}
                className="w-full py-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 text-indigo-700 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <FileText className="w-4 h-4" />
                <span>Inspect Management Audit Log</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Management Audit Modal */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-200 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Archived Management Audit Record
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">{selectedHistoryItem.title}</h2>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                  <span>Client: <strong className="text-slate-800">{selectedHistoryItem.client}</strong></span>
                  <span>•</span>
                  <span>Completion: <strong className="text-slate-800">{selectedHistoryItem.completionDate}</strong></span>
                  <span>•</span>
                  <span>Total Billed: <strong className="text-emerald-700 font-mono">₹{(selectedHistoryItem.finalBilled || 10080000).toLocaleString('en-IN')}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Export Report
                </button>
                <button
                  onClick={() => setSelectedHistoryItem(null)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Historical Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" /> Historical Executive Scope
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                {selectedHistoryItem.summary}
              </p>
            </div>

            {/* Sub-Role Engineering Hours Audit Table */}
            {selectedHistoryItem.layerBreakdown && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" /> Sub-Role Hours Audit Breakdown
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <th className="py-2.5 px-3">Sub-Role Layer</th>
                        <th className="py-2.5 px-3">Assigned Developer</th>
                        <th className="py-2.5 px-3 text-right">Logged Hours</th>
                        <th className="py-2.5 px-3 text-right">Hourly Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {selectedHistoryItem.layerBreakdown.map((layer, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 font-semibold text-indigo-700">{layer.layer}</td>
                          <td className="py-2.5 px-3">{layer.dev}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold">{layer.hours} hrs</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-500">₹{(selectedHistoryItem.hourlyRate || 11300).toLocaleString('en-IN')}/hr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Verified Deliverables List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Archived Deliverables
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedHistoryItem.deliverables.map((d, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                onClick={() => {
                  setSelectedHistoryItem(null);
                  sendChatMessage(`Audit record details for ${selectedHistoryItem.title}`);
                }}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 transition"
              >
                <FileText className="w-4 h-4 text-indigo-600" /> Ask AI Agent About Audit
              </button>

              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
