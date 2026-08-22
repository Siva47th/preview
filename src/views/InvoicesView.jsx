import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, IndianRupee, Printer, CheckCircle, Clock, AlertCircle, Plus, Send } from 'lucide-react';

export const InvoicesView = () => {
  const { invoices, updateInvoiceStatus, projects, createInvoiceFromTimeLogs, currentUser } = useApp();
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [genProjId, setGenProjId] = useState(projects[0]?.id || 'proj_1');

  const filteredInvoices = filterStatus === 'All'
    ? invoices
    : invoices.filter(i => i.status === filterStatus);

  const handleGenerate = () => {
    const inv = createInvoiceFromTimeLogs(genProjId);
    if (inv) {
      setSelectedInvoice(inv);
    }
    setShowGenerateModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Sent': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Overdue': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" /> Invoicing & Billing Ledger
          </h1>
          <p className="text-xs text-slate-500">Generate client invoices from unbilled hours and track payment statuses</p>
        </div>

        {currentUser.role !== 'client' && (
          <button
            onClick={() => setShowGenerateModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invoice from Time Logs</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['All', 'Paid', 'Sent', 'Draft'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterStatus === st
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {st} ({st === 'All' ? invoices.length : invoices.filter(i => i.status === st).length})
          </button>
        ))}
      </div>

      {/* Invoices List */}
      <div className="clean-panel rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] bg-slate-50">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Client & Project</th>
                <th className="py-3.5 px-4">Issue / Due Date</th>
                <th className="py-3.5 px-4">Subtotal</th>
                <th className="py-3.5 px-4">Tax (10%)</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-indigo-600">{inv.clientName}</div>
                    <div className="text-[11px] text-slate-500">{inv.projectName}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono text-[11px]">
                    <div>Issue: {inv.issueDate}</div>
                    <div className="text-slate-400">Due: {inv.dueDate}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-mono">₹{inv.subtotal.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">₹{inv.taxAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 text-sm">
                    ₹{inv.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] px-2.5 py-1 rounded font-bold border ${getStatusBadge(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 hover:border-indigo-600 text-indigo-700 hover:text-white font-semibold transition text-xs"
                    >
                      View Invoice
                    </button>

                    {inv.status !== 'Paid' && currentUser.role !== 'client' && (
                      <button
                        onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition text-xs"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl text-slate-900">
            {/* Modal Top Controls */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded font-bold border ${getStatusBadge(selectedInvoice.status)}`}>
                  {selectedInvoice.status}
                </span>
                <span className="font-mono text-xs text-slate-500">ID: {selectedInvoice.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-slate-900 text-sm font-bold">✕</button>
              </div>
            </div>

            {/* Invoice Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-wide">FREEWHEEL AGENCY</h2>
                <div className="text-xs text-slate-500 mt-1">100 Enterprise Way, Suite 400</div>
                <div className="text-xs text-slate-500">billing@freewheel.io</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-extrabold font-mono text-indigo-600">{selectedInvoice.invoiceNumber}</div>
                <div className="text-xs text-slate-600 mt-1">Issue Date: <strong>{selectedInvoice.issueDate}</strong></div>
                <div className="text-xs text-slate-600">Due Date: <strong>{selectedInvoice.dueDate}</strong></div>
              </div>
            </div>

            {/* Bill To Info */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">Billed To Client</div>
              <div className="text-sm font-bold text-slate-900">{selectedInvoice.clientName}</div>
              <div className="text-xs text-slate-500">{selectedInvoice.clientEmail}</div>
              <div className="text-xs text-slate-500">Project: {selectedInvoice.projectName}</div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Line Item Deliverables</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">Hours</th>
                      <th className="py-2.5 px-3 text-right">Rate</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3">{item.description}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{item.hours}</td>
                        <td className="py-2.5 px-3 text-right font-mono">₹{item.rate.toLocaleString('en-IN')}/hr</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">₹{item.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations Totals */}
            <div className="flex flex-col items-end space-y-1 text-xs pt-2">
              <div className="w-64 flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-900">₹{selectedInvoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-64 flex justify-between text-slate-500">
                <span>Tax Rate (10%):</span>
                <span className="font-mono text-slate-900">₹{selectedInvoice.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-64 flex justify-between pt-2 border-t border-slate-200 font-bold text-sm text-slate-900">
                <span>Total Amount Due:</span>
                <span className="font-mono text-emerald-600">₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Footer notes */}
            <div className="text-[11px] text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
              Note: {selectedInvoice.notes}
            </div>
          </div>
        </div>
      )}

      {/* Quick Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Generate Invoice for Project</h3>
            <p className="text-xs text-slate-500">Select a project to generate an invoice. Uses time logs if available, otherwise calculates from project budget & tasks.</p>

            <div>
              <label className="block text-xs text-slate-700 font-semibold mb-1">Target Project</label>
              <select
                value={genProjId}
                onChange={(e) => setGenProjId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs"
              >
                {projects.filter(p => !p.archived).map(p => (
                  <option key={p.id} value={p.id}>{p.name} — {p.clientName || 'Client'}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button onClick={() => setShowGenerateModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                Cancel
              </button>
              <button onClick={handleGenerate} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition">
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
