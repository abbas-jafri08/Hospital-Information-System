import React, { useState } from 'react';
import { 
  User, Bell, Shield, Database, Globe, Moon, Mail,
  Lock, ChevronRight, Save, Smartphone, Eye, Languages,
  Sun, Users, Check, ShieldCheck
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useTheme } from '../context/ThemeContext.jsx';
import { useRole, ROLES } from '../context/RoleContext.jsx';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const { theme, toggleTheme } = useTheme();
  const { role, changeRole, roleInfo } = useRole();

  const tabs = [
    { icon: User, label: 'Profile' },
    { icon: Bell, label: 'Notifications' },
    { icon: Shield, label: 'Security' },
    { icon: Database, label: 'Data & Sync' },
    { icon: Globe, label: 'Language' },
    { icon: ShieldCheck, label: 'Roles & Access' },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold font-headline text-blue-900 dark:text-blue-400">System Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Configure your clinical environment and personal preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-1">
          {tabs.map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === item.label 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </aside>

        <div className="md:col-span-3 space-y-6">
          {activeTab === 'Profile' && (
            <>
              <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <img 
                    src="https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=100&h=100" 
                    alt="Profile" 
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-50 dark:border-slate-800 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Admin Staff</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Superuser • Central Command</p>
                    <button className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Change Photo</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                      <input type="text" defaultValue="Admin Staff" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none text-slate-900 dark:text-slate-100" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                      <input type="email" defaultValue="admin@sanctuary.health" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none text-slate-900 dark:text-slate-100" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Department</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none appearance-none text-slate-900 dark:text-slate-100">
                      <option>Administration</option>
                      <option>Cardiology</option>
                      <option>Emergency Room</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Role</label>
                    <input type="text" defaultValue="Superuser" disabled className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed" />
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-headline">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-600 dark:text-slate-400">
                        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Dark Mode</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Adjust the interface for low light</p>
                      </div>
                    </div>
                    <button 
                      onClick={toggleTheme}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-colors",
                        theme === 'dark' ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                      )}
                    >
                      <span className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                        theme === 'dark' ? "right-1" : "left-1"
                      )}></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-600 dark:text-slate-400"><Lock size={18} /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Two-Factor Auth</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Add an extra layer of security</p>
                      </div>
                    </div>
                    <button className="w-12 h-6 bg-primary rounded-full relative transition-colors">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></span>
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === 'Notifications' && (
            <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-headline">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email Notifications', desc: 'Receive updates via email' },
                  { icon: Smartphone, label: 'Push Notifications', desc: 'Receive updates on your device' },
                  { icon: Bell, label: 'In-App Alerts', desc: 'Receive updates within the system' },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-slate-600 dark:text-slate-400"><pref.icon size={18} /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{pref.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{pref.desc}</p>
                      </div>
                    </div>
                    <button className="w-12 h-6 bg-primary rounded-full relative transition-colors">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'Security' && (
            <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-headline">Security Settings</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none text-slate-900 dark:text-slate-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none text-slate-900 dark:text-slate-100" />
                </div>
                <button className="text-sm font-bold text-primary hover:underline">Enable Biometric Login</button>
              </div>
            </section>
          )}

          {activeTab === 'Roles & Access' && (
            <section className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><ShieldCheck size={20} className="text-primary" /></div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Role-Based Access Control</h3>
                    <p className="text-xs text-slate-400">Switch your active role to see access restrictions in action</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {Object.entries(ROLES).map(([key, info]) => (
                    <button key={key} onClick={() => changeRole(key)}
                      className={cn('p-4 rounded-xl border-2 text-left transition-all',
                        role === key ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40')}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full', info.color)}>{info.label}</span>
                        {role === key && <Check size={14} className="text-primary" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{info.permissions.length} modules accessible</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Users size={16} className="text-primary" /> Current Role: <span className={cn('text-[11px] font-bold px-2.5 py-1 rounded-full ml-1', roleInfo?.color)}>{roleInfo?.label}</span>
                </h4>
                <div className="space-y-2">
                  {['dashboard','patients','doctors','appointments','medical-records','billing','settings','ai-symptom','qr-checkin'].map(page => {
                    const allowed = ROLES[role]?.permissions.includes(page);
                    const labels = { dashboard:'Dashboard', patients:'Patients', doctors:'Doctors', appointments:'Appointments', 'medical-records':'Medical Records', billing:'Billing', settings:'Settings', 'ai-symptom':'AI Symptom Checker', 'qr-checkin':'QR Patient Check-in' };
                    return (
                      <div key={page} className={cn('flex items-center justify-between px-4 py-2.5 rounded-xl border',
                        allowed ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 opacity-50')}>
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{labels[page]}</span>
                        <span className={cn('text-[10px] font-bold uppercase px-2 py-0.5 rounded-full',
                          allowed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400')}>
                          {allowed ? '✓ Allowed' : '✗ Restricted'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {(activeTab === 'Data & Sync' || activeTab === 'Language') && (
            <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
                {activeTab === 'Language' ? <Languages size={32} /> : <Database size={32} />}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{activeTab} Settings</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">This section is currently being updated for the new clinical protocol.</p>
            </section>
          )}

          <div className="flex justify-end gap-4">
            <button className="px-6 py-2.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">Cancel</button>
            <button className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95">
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
