import React, { useState } from 'react';
import { UserSession, LoginLogEntry } from '../types';
import { Plane, LogIn, Lock, User, Mail, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (session: UserSession) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  const logAction = (email: string, fullName: string, action: 'login' | 'logout') => {
    const cachedLogs = localStorage.getItem('flight_auth_logs');
    const logs: LoginLogEntry[] = cachedLogs ? JSON.parse(cachedLogs) : [];
    logs.push({
      email,
      fullName,
      action,
      timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('flight_auth_logs', JSON.stringify(logs));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (mode === 'signup' && !fullName)) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 5) {
      setError('Password should be at least 5 characters.');
      return;
    }

    // Explicit Admin handling
    if (email === 'admin@aerorisk.com' && password === 'admin') {
      logAction(email, 'System Administrator', 'login');
      onLogin({ email, isLoggedIn: true, fullName: 'System Administrator', isAdmin: true });
      return;
    }

    if (mode === 'signup') {
      localStorage.setItem('flight_user_' + email.toLowerCase(), JSON.stringify({ fullName, email: email.toLowerCase(), password }));
      setMode('login');
      setPassword('');
      setError('Account successfully created! You can now log in using your credentials.');
    } else {
      const stored = localStorage.getItem('flight_user_' + email.toLowerCase());
      if (stored) {
        const user = JSON.parse(stored);
        if (user.password === password) {
          logAction(user.email, user.fullName, 'login');
          onLogin({ email: user.email, isLoggedIn: true, fullName: user.fullName, isAdmin: user.email === 'admin@aerorisk.com' });
          return;
        } else {
          setError('Invalid credentials. Check your password.');
        }
      } else {
        setError('User not found. Please sign up to initialize your account.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-100 via-blue-50/20 to-indigo-100 dark:from-slate-950 dark:via-blue-950/10 dark:to-indigo-950 flex flex-col items-center justify-center p-4 select-none">
      {/* Visual background shapes/accents */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-blue-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-2xl relative select-none">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-3 shadow-md shadow-blue-500/20 select-none">
            <Plane className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-1.5 select-none">
            AeroRisk <span className="text-blue-600 dark:text-blue-400">Delay Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[300px]">
            Real-time status analysis, predictive algorithm radar, and saved ticket scans.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="grid grid-cols-2 bg-slate-100/60 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200/40 dark:border-slate-700/40 mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`h-10 flex items-center justify-center gap-2 text-xs font-bold rounded-lg transition cursor-pointer select-none ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" /> Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`h-10 flex items-center justify-center gap-2 text-xs font-bold rounded-lg transition cursor-pointer select-none ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Sign Up
          </button>
        </div>

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div className="relative">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 bg-white/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 dark:text-slate-100"
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 bg-white/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 dark:text-slate-100"
            />
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 bg-white/50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 dark:text-slate-100"
            />
            <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          </div>

          {error && (
            <div className={`p-3 text-xs font-semibold rounded-xl text-center border leading-relaxed select-none ${
              error.includes('Account successfully')
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40 text-rose-500'
            }`}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full h-11 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold text-sm tracking-wide rounded-xl shadow-md shadow-blue-500/20 transition cursor-pointer select-none"
          >
            {mode === 'login' ? 'Access Platform' : 'Initialize Account'}
          </button>
        </form>

        <div className="mt-5 border-t border-slate-100 dark:border-slate-800/60 pt-4 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1 select-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Secured and verified statistical engine
          </p>
        </div>
      </div>
    </div>
  );
};
