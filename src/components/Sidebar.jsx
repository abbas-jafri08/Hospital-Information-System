import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Stethoscope, Calendar, 
  FileText, CreditCard, Settings, Plus, HeartPulse,
  Bot, QrCode, ShieldCheck
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useRole, ROLES } from '@/src/context/RoleContext.jsx';

const ALL_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard',        to: '/',                key: 'dashboard' },
  { icon: Users,           label: 'Patients',          to: '/patients',        key: 'patients' },
  { icon: Stethoscope,     label: 'Doctors',           to: '/doctors',         key: 'doctors' },
  { icon: Calendar,        label: 'Appointments',      to: '/appointments',    key: 'appointments' },
  { icon: FileText,        label: 'Medical Records',   to: '/medical-records', key: 'medical-records' },
  { icon: CreditCard,      label: 'Billing',           to: '/billing',         key: 'billing' },
  { icon: Bot,             label: 'AI Symptom Check',  to: '/ai-symptom',      key: 'ai-symptom', accent: true },
  { icon: QrCode,          label: 'QR Check-in',       to: '/qr-checkin',      key: 'qr-checkin', accent: true },
  { icon: Settings,        label: 'Settings',          to: '/settings',        key: 'settings' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const { role, roleInfo, can } = useRole();

  const navItems = ALL_NAV.filter(item => can(item.key));

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 overflow-y-auto bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col gap-y-2 p-4 z-50">
      <div className="mb-6 px-2 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <HeartPulse size={24} />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-blue-900 dark:text-blue-400 leading-tight font-headline">Sanctuary Health</h1>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Central Command</p>
        </div>
      </div>

      {/* Role badge */}
      <div className="mx-2 mb-3 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <ShieldCheck size={13} className="text-primary flex-shrink-0" />
        <div>
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Active Role</p>
          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{roleInfo?.label}</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg mx-1 transition-all duration-200 group",
              isActive 
                ? "bg-white dark:bg-slate-900 text-primary shadow-sm" 
                : item.accent
                  ? "text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary"
            )}
          >
            <item.icon size={18} className="transition-transform group-hover:scale-110 flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-2">
        <button 
          onClick={() => navigate('/patients')}
          className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span className="text-xs uppercase tracking-widest">Add Patient</span>
        </button>
      </div>
    </aside>
  );
}
