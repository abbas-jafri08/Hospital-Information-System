import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings as SettingsIcon, X, AlertCircle, CheckCircle2, Info, Sun, Moon } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';

const notifications = [
  { id: 1, title: 'Critical Alert', message: 'Patient Robert Fox (Room 402) vitals dropping.', time: '2m ago', type: 'critical', icon: AlertCircle },
  { id: 2, title: 'New Lab Result', message: 'Jane Smith blood work is ready for review.', time: '15m ago', type: 'info', icon: Info },
  { id: 3, title: 'Appointment Confirmed', message: 'Dr. Jenkins confirmed session with Esther.', time: '1h ago', type: 'success', icon: CheckCircle2 },
];

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const trayRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event) {
      if (trayRef.current && !trayRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 flex justify-between items-center w-full px-8 py-3 border-b border-slate-200/50 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-8 flex-1">
        <h1 
          className="text-xl font-bold tracking-tight text-blue-900 dark:text-blue-400 font-headline cursor-pointer"
          onClick={() => navigate('/')}
        >
          ClinicalSanctuary
        </h1>
        <div className="relative w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-colors" />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none text-slate-900 dark:text-slate-100" 
            placeholder="Search patients, records, or ID..." 
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 relative" ref={trayRef}>
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "p-2 rounded-full transition-all relative",
              showNotifications ? "bg-primary/10 text-primary" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800">
                {notifications.map((n) => (
                  <div key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
                    <div className="flex gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        n.type === 'critical' ? 'bg-error-container text-error' :
                        n.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      )}>
                        <n.icon size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{n.title}</p>
                          <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Mark all as read</button>
              </div>
            </div>
          )}

          <button 
            onClick={() => navigate('/settings')}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <SettingsIcon size={20} />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/settings')}>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none group-hover:text-primary transition-colors">Admin Staff</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Superuser</p>
          </div>
          <img 
            alt="Admin Profile" 
            className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 shadow-sm object-cover group-hover:border-primary transition-all" 
            src="https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=100&h=100"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
