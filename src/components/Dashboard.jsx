import React from 'react';
import {
  Users, Stethoscope, CalendarCheck, DollarSign,
  TrendingUp, AlertCircle, Activity, ChevronRight,
  Bot, QrCode, ShieldCheck
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/src/context/DataContext.jsx';
import { useRole } from '@/src/context/RoleContext.jsx';

const STATUS_COLORS = { Inpatient: '#003d9b', Outpatient: '#006c47', Observation: '#d97706', Discharged: '#94a3b8' };

const triageFeed = [
  { name: 'Robert Fox', condition: 'Cardiac Arrest', room: '402', priority: 'Critical', icon: AlertCircle },
  { name: 'Esther Howard', condition: 'Severe Fracture', room: '108', priority: 'Moderate', icon: Activity },
  { name: 'Jenny Wilson', condition: 'Pneumonia Monitor', room: '215', priority: 'Moderate', icon: Activity },
];

const activities = [
  { user: 'Dr. Smith', action: 'assigned to Patient John Doe', time: '12 Minutes ago', color: 'bg-primary' },
  { user: 'New Lab Result', action: 'published for Jane Smith', time: '45 Minutes ago', color: 'bg-secondary' },
  { user: 'Shift Change', action: 'Nurse Sarah on duty', time: '2 Hours ago', color: 'bg-slate-300' },
  { user: 'Critical Alert', action: 'Oxygen Level Drop in Room 302', time: '4 Hours ago', color: 'bg-tertiary' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { patients, doctors, appointments, invoices } = useData();
  const { can } = useRole();

  const totalRevenue = invoices.reduce((sum, inv) =>
    inv.status === 'Paid' ? sum + inv.items.reduce((s, it) => s + it.qty * it.rate, 0) : sum, 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter(a => a.date === todayStr).length;

  const statusBreakdown = ['Inpatient','Outpatient','Observation','Discharged'].map(s => ({
    name: s, value: patients.filter(p => p.status === s).length, color: STATUS_COLORS[s],
  }));

  const aptStatusBreakdown = ['Confirmed','Pending','Completed','Cancelled'].map(s => ({
    name: s, value: appointments.filter(a => a.status === s).length,
  }));

  const specialtyMap = {};
  appointments.forEach(a => { if (a.specialty) specialtyMap[a.specialty] = (specialtyMap[a.specialty]||0)+1; });
  const specialtyData = Object.entries(specialtyMap).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([name,value])=>({ name: name.substring(0,10), value }));

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const seed = patients.length + appointments.length;
  const inflowData = days.map((day, i) => ({
    name: day,
    Patients: Math.max(1, Math.round((patients.length / 7) * (0.7 + ((seed*i*7+13)%17)/30))),
    Appointments: Math.max(0, Math.round((appointments.length / 7) * (0.6 + ((seed*i*11+7)%19)/30))),
  }));

  const stats = [
    { label: 'Total Patients', value: patients.length.toLocaleString(), trend: '+5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', to: '/patients' },
    { label: 'Active Doctors', value: doctors.filter(d=>d.status==='On Duty').length, trend: null, icon: Stethoscope, color: 'text-indigo-600', bg: 'bg-indigo-50', to: '/doctors' },
    { label: "Today's Apts", value: todayApts || appointments.length, trend: 'Today', icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', to: '/appointments' },
    { label: 'Total Revenue', value: '$'+(totalRevenue/1000).toFixed(1)+'k', trend: '+12%', icon: DollarSign, color: 'text-slate-700', bg: 'bg-slate-50', to: '/billing' },
  ];

  const featureCards = [
    { label: 'AI Symptom Checker', desc: 'Clinical decision support', icon: Bot, to: '/ai-symptom', color: 'from-violet-500 to-purple-600', allowed: can('ai-symptom') },
    { label: 'QR Patient Check-in', desc: 'Fast patient arrivals', icon: QrCode, to: '/qr-checkin', color: 'from-emerald-500 to-teal-600', allowed: can('qr-checkin') },
    { label: 'Role-Based Security', desc: 'Access management', icon: ShieldCheck, to: '/settings', color: 'from-amber-500 to-orange-500', allowed: can('settings') },
  ].filter(f => f.allowed);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} onClick={() => navigate(stat.to)}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:shadow-md transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} dark:bg-slate-800 dark:text-blue-400 group-hover:bg-primary group-hover:text-white transition-colors`}>
                <stat.icon size={20} />
              </div>
              {stat.trend && (
                <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-xs bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                  {stat.trend} <TrendingUp size={12} className="ml-1" />
                </span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-3xl font-extrabold font-headline text-slate-900 dark:text-slate-100">{stat.value}</h3>
          </div>
        ))}
      </section>

      {/* Advanced Feature Cards */}
      {featureCards.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featureCards.map(fc => (
            <div key={fc.label} onClick={() => navigate(fc.to)}
              className={`bg-gradient-to-br ${fc.color} rounded-2xl p-5 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all text-white`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><fc.icon size={20} /></div>
                <div>
                  <p className="font-extrabold text-sm">{fc.label}</p>
                  <p className="text-[10px] text-white/70">{fc.desc}</p>
                </div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Open →</p>
            </div>
          ))}
        </section>
      )}

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold font-headline text-slate-900 dark:text-slate-100 mb-1">Weekly Activity</h2>
          <p className="text-xs text-slate-400 mb-5">Patients & appointments this week</p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inflowData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', backgroundColor: '#1e293b', color: '#f8fafc', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                <Bar dataKey="Patients" fill="#003d9b" radius={[4,4,0,0]} barSize={16} />
                <Bar dataKey="Appointments" fill="#006c47" radius={[4,4,0,0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold font-headline mb-1 text-slate-900 dark:text-slate-100">Patient Status</h2>
          <p className="text-xs text-slate-400 mb-5">Admission breakdown</p>
          <div className="flex justify-center">
            <div className="w-40 h-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusBreakdown} innerRadius={48} outerRadius={68} paddingAngle={4} dataKey="value">
                    {statusBreakdown.map((e,i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{patients.length}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total</span>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {statusBreakdown.map(d => (
              <div key={d.name} className="flex justify-between items-center">
                <span className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />{d.name}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialty + Apt Status */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {specialtyData.length > 0 && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold font-headline mb-1 text-slate-900 dark:text-slate-100">Appointments by Specialty</h2>
            <p className="text-xs text-slate-400 mb-4">Department distribution</p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={specialtyData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} width={80} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#f8fafc', fontSize: 12 }} />
                  <Bar dataKey="value" fill="#003d9b" radius={[0,4,4,0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold font-headline mb-1 text-slate-900 dark:text-slate-100">Appointment Status</h2>
          <p className="text-xs text-slate-400 mb-5">Current pipeline overview</p>
          <div className="space-y-4">
            {aptStatusBreakdown.map(({ name, value }) => {
              const pct = appointments.length ? Math.round((value/appointments.length)*100) : 0;
              const clr = { Confirmed:'bg-emerald-500', Pending:'bg-amber-400', Completed:'bg-blue-500', Cancelled:'bg-red-400' }[name];
              return (
                <div key={name}>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    <span>{name}</span><span>{value} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', clr)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-5 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold font-headline text-slate-900 dark:text-slate-100">Smart Triage Feed</h2>
            <button onClick={() => navigate('/patients')} className="text-primary text-xs font-bold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {triageFeed.map((item) => (
              <div key={item.name} onClick={() => navigate('/patients')}
                className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center',
                    item.priority==='Critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-blue-50 dark:bg-blue-900/20 text-primary')}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.condition} • Room {item.room}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full',
                    item.priority==='Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400')}>
                    {item.priority}
                  </span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold font-headline mb-6 text-slate-900 dark:text-slate-100">Recent Activity</h2>
          <div className="space-y-7 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-px before:bg-slate-100 dark:before:bg-slate-800">
            {activities.map((activity, i) => (
              <div key={i} className="relative pl-10">
                <div className={cn('absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 shadow-sm z-10', activity.color)} />
                <div>
                  <p className="text-slate-900 dark:text-slate-100 font-semibold text-xs">
                    {activity.user.startsWith('Dr.') ? <span className="text-primary">{activity.user}</span> : activity.user} {activity.action}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
