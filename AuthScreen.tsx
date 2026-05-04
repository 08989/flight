import React, { useState } from 'react';
import { LoginLogEntry } from '../types';
import { Database, Shield, FileText, CheckCircle, Search, RefreshCw, Server } from 'lucide-react';

export const AdminDatabaseConsole: React.FC = () => {
  const [logs, setLogs] = useState<LoginLogEntry[]>(() => {
    const stored = localStorage.getItem('flight_auth_logs');
    return stored ? JSON.parse(stored) : [];
  });

  const [query, setQuery] = useState('SELECT * FROM users_logins');
  const [consoleMsg, setConsoleMsg] = useState('');

  // Update/poll logs on clicking or running
  const refreshLogs = () => {
    const stored = localStorage.getItem('flight_auth_logs');
    const updated = stored ? JSON.parse(stored) : [];
    setLogs(updated);
    setConsoleMsg('Database logs updated successfully.');
  };

  const executeSql = (e: React.FormEvent) => {
    e.preventDefault();
    setConsoleMsg('');
    const q = query.trim().toUpperCase();

    if (q.startsWith('SELECT * FROM USERS_LOGINS')) {
      setConsoleMsg(`Query Successful: ${logs.length} records retrieved from users_logins.`);
    } else {
      setConsoleMsg(`SQL simulation successful: Custom filter executed.`);
    }
  };

  const clearLogs = () => {
    localStorage.setItem('flight_auth_logs', '[]');
    setLogs([]);
    setConsoleMsg('users_logins table cleared completely.');
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-xl flex flex-col justify-between select-none">
      <div className="flex justify-between items-center mb-5 flex-wrap gap-2 select-none">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 select-none">
            <Shield className="w-5 h-5 text-indigo-500 animate-pulse" /> phpMyAdmin Database Simulation Dashboard
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 select-none">
            Admin secure access only. Full visibility of user login, registration, and logout activity stored in our tables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshLogs}
            className="text-xs font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/40 px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Synchronize DB
          </button>
          <button
            onClick={clearLogs}
            className="text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-100/60 dark:border-rose-900/40 px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
          >
            Drop Table
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5 select-none">
        {/* SQL Input box/Simulation Console */}
        <div className="lg:col-span-4 p-4 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase mb-3 flex items-center gap-1">
            <Server className="w-3.5 h-3.5" /> phpMyAdmin SQL Terminal
          </h4>
          <form onSubmit={executeSql} className="flex flex-col gap-3">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="w-full bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition select-none active:scale-[0.98]"
            >
              <Database className="w-3.5 h-3.5" /> Run Query (SQL Simulation)
            </button>
          </form>

          {consoleMsg && (
            <p className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 leading-normal animate-fade-in select-none">
              <CheckCircle className="w-3.5 h-3.5" /> {consoleMsg}
            </p>
          )}
        </div>

        {/* Database records list */}
        <div className="lg:col-span-8 p-4 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase mb-3 flex items-center justify-between select-none">
            <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> users_logins Table</span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-1.5 py-0.5 rounded">
              {logs.length} Data Rows
            </span>
          </h4>

          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white/20 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 rounded-xl h-full">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-1" />
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                No session entries recorded.
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[200px] mt-0.5 leading-relaxed">
                Logins/logouts automatically add rows here in the users_logins table.
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[220px] flex flex-col gap-2.5">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className="p-3 bg-white/40 dark:bg-slate-900/40 hover:bg-white/60 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800/60 rounded-xl flex items-center justify-between gap-4 transition select-none"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200 leading-tight">
                      {log.fullName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {log.email}
                    </span>
                  </div>

                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded leading-none select-none ${
                      log.action === 'login'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 select-none">
                      {log.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
