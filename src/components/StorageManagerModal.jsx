import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { dbService } from '../services/dbService';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  HardDrive,
  Cpu,
  X,
  FileJson,
  AlertTriangle,
  Server,
  Cloud,
  ShieldCheck,
  Zap,
  Check,
  FileCode2,
  Globe
} from 'lucide-react';

export const StorageManagerModal = ({ isOpen, onClose }) => {
  const {
    storageMetrics,
    exportWorkspace,
    importWorkspace,
    resetWorkspace,
    users,
    projects,
    tasks,
    invoices
  } = useApp();

  const [activeTab, setActiveTab] = useState('db'); // 'db' | 'backup'
  const [importStatus, setImportStatus] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);

  // Database Connection State
  const [dbConfig, setDbConfig] = useState(() => dbService.getDbConfig());
  const [dbTestResult, setDbTestResult] = useState(null);
  const [isTestingDb, setIsTestingDb] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    try {
      const jsonStr = exportWorkspace();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `freewheel_workspace_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setImportStatus({ type: 'success', message: 'Workspace JSON snapshot exported successfully!' });
    } catch (err) {
      setImportStatus({ type: 'error', message: `Export failed: ${err.message}` });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result;
        const res = importWorkspace(content);
        if (res.success) {
          setImportStatus({ type: 'success', message: 'Workspace restored successfully from backup JSON!' });
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setImportStatus({ type: 'error', message: res.error || 'Failed to import backup file.' });
        }
      } catch (err) {
        setImportStatus({ type: 'error', message: `Import error: ${err.message}` });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    resetWorkspace();
    setShowResetConfirm(false);
    setImportStatus({ type: 'success', message: 'Workspace storage reset to initial demo defaults!' });
  };

  const handleDriverChange = (driver) => {
    const updated = dbService.saveDbConfig({ driver });
    setDbConfig(updated);
    setDbTestResult(null);
  };

  const handleConfigChange = (field, val) => {
    const updated = dbService.saveDbConfig({ [field]: val });
    setDbConfig(updated);
  };

  const handleTestConnection = async () => {
    setIsTestingDb(true);
    setDbTestResult(null);
    try {
      const res = await dbService.testDbConnection(dbConfig);
      setDbTestResult(res);
    } catch (err) {
      setDbTestResult({ success: false, driver: dbConfig.driver, message: `Ping failed: ${err.message}` });
    } finally {
      setIsTestingDb(false);
    }
  };

  const handleDownloadSchema = () => {
    const link = document.createElement('a');
    link.href = '/database/schema.sql';
    link.download = 'freewheel_database_schema.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/30 border border-indigo-500/40 rounded-xl text-indigo-400">
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Deployment & Database Manager
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                  PROD-READY
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Configure database drivers (Supabase, REST API, IndexedDB) and export workspace data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-4">
          <button
            onClick={() => setActiveTab('db')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'db'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" /> Database Engine & Cloud
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'backup'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <HardDrive className="w-4 h-4" /> Local Storage & Backups
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">

          {/* TAB 1: DATABASE ENGINE & CLOUD */}
          {activeTab === 'db' && (
            <div className="space-y-5">
              
              {/* Driver Selection Grid */}
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-2">Select Active Database Driver</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  {/* Local Storage Engine */}
                  <div
                    onClick={() => handleDriverChange('local')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      dbConfig.driver === 'local'
                        ? 'bg-indigo-50/60 border-indigo-600 ring-1 ring-indigo-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <HardDrive className={`w-4 h-4 mt-0.5 ${dbConfig.driver === 'local' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Local Storage Engine</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Browser key-value storage. Zero config needed.</div>
                    </div>
                  </div>

                  {/* IndexedDB Engine */}
                  <div
                    onClick={() => handleDriverChange('indexeddb')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      dbConfig.driver === 'indexeddb'
                        ? 'bg-indigo-50/60 border-indigo-600 ring-1 ring-indigo-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Database className={`w-4 h-4 mt-0.5 ${dbConfig.driver === 'indexeddb' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-900">IndexedDB Browser DB</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Structured client-side database store.</div>
                    </div>
                  </div>

                  {/* Custom REST API Backend */}
                  <div
                    onClick={() => handleDriverChange('rest')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      dbConfig.driver === 'rest'
                        ? 'bg-indigo-50/60 border-indigo-600 ring-1 ring-indigo-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Server className={`w-4 h-4 mt-0.5 ${dbConfig.driver === 'rest' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-900">REST API Backend (Express)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Connect to your Node/PostgreSQL REST server.</div>
                    </div>
                  </div>

                  {/* Supabase Serverless DB */}
                  <div
                    onClick={() => handleDriverChange('supabase')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      dbConfig.driver === 'supabase'
                        ? 'bg-indigo-50/60 border-indigo-600 ring-1 ring-indigo-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Cloud className={`w-4 h-4 mt-0.5 ${dbConfig.driver === 'supabase' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Supabase Serverless DB</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Direct connection to cloud PostgreSQL.</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Dynamic Connection Inputs */}
              {dbConfig.driver === 'rest' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-600" /> REST API Endpoint Configuration
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold block mb-1">API Base URL</label>
                    <input
                      type="text"
                      value={dbConfig.apiUrl}
                      onChange={(e) => handleConfigChange('apiUrl', e.target.value)}
                      placeholder="e.g. http://localhost:4000/api/v1 or https://api.yourdomain.com/v1"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold block mb-1">API Token / Secret (Optional)</label>
                    <input
                      type="password"
                      value={dbConfig.apiKey}
                      onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                      placeholder="Bearer token or API Secret"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              )}

              {dbConfig.driver === 'supabase' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-indigo-600" /> Supabase Credentials
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold block mb-1">Supabase Project URL</label>
                    <input
                      type="text"
                      value={dbConfig.supabaseUrl}
                      onChange={(e) => handleConfigChange('supabaseUrl', e.target.value)}
                      placeholder="https://xyzcompany.supabase.co"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 font-semibold block mb-1">Supabase Anon Key</label>
                    <input
                      type="password"
                      value={dbConfig.supabaseAnonKey}
                      onChange={(e) => handleConfigChange('supabaseAnonKey', e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              )}

              {/* DB Ping Test Result */}
              {dbTestResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                    dbTestResult.success
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                >
                  {dbTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{dbTestResult.message}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleTestConnection}
                  disabled={isTestingDb}
                  className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isTestingDb ? 'Testing Connection...' : 'Test DB Connection'}</span>
                </button>

                <button
                  onClick={handleDownloadSchema}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FileCode2 className="w-4 h-4 text-indigo-600" />
                  <span>Download SQL Schema (.sql)</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: LOCAL STORAGE & BACKUPS */}
          {activeTab === 'backup' && (
            <div className="space-y-5">
              
              {/* Status Message */}
              {importStatus && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                    importStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {importStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{importStatus.message}</span>
                  </div>
                  <button
                    onClick={() => setImportStatus(null)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Storage Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <HardDrive className="w-4 h-4 text-indigo-600" /> Active Engine
                  </div>
                  <div className="text-sm font-bold text-slate-900 truncate uppercase font-mono">
                    {dbConfig.driver}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Operational
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <Cpu className="w-4 h-4 text-indigo-600" /> Footprint
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {storageMetrics?.totalKB || '0.00'} KB
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {storageMetrics?.itemCount || 0} stored entities
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" /> Entity Counts
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {projects.length} Proj / {tasks.length} Tasks
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {users.length} Devs, {invoices.length} Invoices
                  </div>
                </div>
              </div>

              {/* Backup & Deployment Controls */}
              <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-indigo-600" /> Data Backup & Migration Tools
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Export complete workspace JSON snapshots for offline backups or seed data into production database instances.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Workspace JSON</span>
                  </button>

                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".json"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 flex items-center justify-center gap-2 transition"
                    >
                      <Upload className="w-4 h-4 text-indigo-600" />
                      <span>Restore from JSON Backup</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone: Reset Workspace */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Reset Demo Workspace</div>
                  <div className="text-[11px] text-slate-500">Restore factory catalog, dev team, and initial task states.</div>
                </div>

                {showResetConfirm ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-1 shadow-sm"
                    >
                      Confirm Reset
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3 py-1.5 text-xs border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-semibold flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-red-600" />
                    <span>Reset Data</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
          <div>Freewheel Database System v1.0</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
