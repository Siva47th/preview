import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, FolderKanban, FileText, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

export const ClientPortalView = () => {
  const { currentUser, projects, invoices, updateInvoiceStatus, sendChatMessage } = useApp();
  const [supportText, setSupportText] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const clientProjects = projects.filter(p => p.clientId === currentUser.id || p.clientName === currentUser.company || p.clientName === currentUser.name || currentUser.role !== 'client');
  const clientInvoices = invoices.filter(i => i.clientId === currentUser.id || i.clientName === currentUser.company || i.clientName === currentUser.name || currentUser.role !== 'client');

  const handleSendSupport = (e) => {
    e.preventDefault();
    if (!supportText) return;
    sendChatMessage(`Client Portal Support Inquiry: ${supportText}`);
    setSubmittedMessage(true);
    setSupportText('');
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Security Scope Banner */}
      <div className="p-5 rounded-xl bg-white border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Client Portal Access Scope</h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Security Isolation Active
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Viewing authenticated scope for: <strong className="text-emerald-700">{currentUser.company || currentUser.name}</strong>
            </p>
          </div>
        </div>

        <div className="text-right text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <div>Client ID: <span className="font-mono text-slate-900 font-semibold">{currentUser.id}</span></div>
          <div className="text-[10px] text-slate-400">Internal developer notes & other client data strictly isolated</div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Client Deliverables */}
        <div className="lg:col-span-2 space-y-6">
          <div className="clean-panel p-6 bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-indigo-600" /> Authorized Client Deliverables
            </h3>

            <div className="space-y-4">
              {clientProjects.map((proj) => (
                <div key={proj.id} className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{proj.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{proj.description}</p>
                    </div>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                      {proj.completionPercentage}% Done
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${proj.completionPercentage}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Target Delivery Date: <strong className="text-slate-900">{proj.deadline}</strong></span>
                    <span>Status: <strong className="text-emerald-700">{proj.status}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Invoices & Support */}
        <div className="space-y-6">
          {/* Client Invoices */}
          <div className="clean-panel p-6 bg-white space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" /> Pending Invoices
            </h3>

            <div className="space-y-3 text-xs">
              {clientInvoices.map((inv) => (
                <div key={inv.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total Due:</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">${inv.totalAmount.toLocaleString()}</span>
                  </div>

                  {inv.status !== 'Paid' && (
                    <button
                      onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                      className="w-full mt-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
                    >
                      Pay Invoice Now
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Support Ticket Box */}
          <div className="clean-panel p-6 bg-white space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" /> Submit Client Support Ticket
            </h3>

            {submittedMessage ? (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ticket submitted! Agency architect notified.</span>
              </div>
            ) : (
              <form onSubmit={handleSendSupport} className="space-y-3 text-xs">
                <textarea
                  rows="3"
                  required
                  placeholder="Describe your inquiry or requested milestone change..."
                  value={supportText}
                  onChange={(e) => setSupportText(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600"
                ></textarea>
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition shadow-sm"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
