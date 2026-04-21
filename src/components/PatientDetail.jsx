import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Activity, 
  Heart, 
  Thermometer, 
  Droplets, 
  Clock, 
  Calendar, 
  FileText, 
  Pill, 
  Plus,
  MoreVertical,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const vitalsData = [
  { time: '08:00', heartRate: 72, bp: 120, temp: 36.6 },
  { time: '10:00', heartRate: 75, bp: 122, temp: 36.7 },
  { time: '12:00', heartRate: 82, bp: 125, temp: 36.8 },
  { time: '14:00', heartRate: 78, bp: 121, temp: 36.7 },
  { time: '16:00', heartRate: 74, bp: 119, temp: 36.6 },
  { time: '18:00', heartRate: 70, bp: 118, temp: 36.5 },
];

const medicalHistory = [
  { date: 'Mar 25, 2024', event: 'Routine Checkup', doctor: 'Dr. Sarah Jenkins', type: 'Consultation', status: 'Completed' },
  { date: 'Feb 12, 2024', event: 'Blood Test - Lipid Profile', doctor: 'Lab Services', type: 'Lab Work', status: 'Final' },
  { date: 'Jan 05, 2024', event: 'Flu Vaccination', doctor: 'Nurse Emily', type: 'Immunization', status: 'Completed' },
  { date: 'Dec 15, 2023', event: 'Chest X-Ray', doctor: 'Dr. Michael Chen', type: 'Imaging', status: 'Final' },
];

const medications = [
  { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', type: 'Blood Pressure' },
  { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', type: 'Diabetes' },
  { name: 'Atorvastatin', dosage: '20mg', frequency: 'At bedtime', type: 'Cholesterol' },
];

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock patient data based on ID
  const patient = {
    id: id || 'PT-8821',
    name: 'Robert Fox',
    age: 42,
    gender: 'Male',
    blood: 'A+',
    weight: '78 kg',
    height: '182 cm',
    phone: '+1 (555) 012-3456',
    email: 'robert.fox@example.com',
    address: '4517 Washington Ave. Manchester, Kentucky 39495',
    status: 'Inpatient',
    condition: 'Hypertension'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate('/patients')}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Directory</span>
        </button>
        
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-2 border-white dark:border-slate-800 shadow-sm">
              RF
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold font-headline text-blue-900 dark:text-blue-400">{patient.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                  {patient.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span>{patient.id}</span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                <span>{patient.age} years old</span>
                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                <span>{patient.gender}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Edit Profile
            </button>
            <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95">
              <Plus size={18} />
              <span className="text-sm">New Record</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Vitals Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, color: 'text-error', bg: 'bg-error-container/30 dark:bg-error-container/10' },
              { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Temperature', value: '36.6', unit: '°C', icon: Thermometer, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { label: 'Oxygen', value: '98', unit: '%', icon: Droplets, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            ].map((vital) => (
              <div key={vital.label} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", vital.bg, vital.color)}>
                  <vital.icon size={20} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{vital.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{vital.value}</span>
                  <span className="text-[10px] font-bold text-slate-400">{vital.unit}</span>
                </div>
              </div>
            ))}
          </section>

          {/* Vitals Chart */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold font-headline text-slate-900 dark:text-slate-100">Vitals History</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm">Heart Rate</button>
                <button className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-400 text-[10px] font-bold rounded-lg uppercase tracking-wider">BP</button>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vitalsData}>
                  <defs>
                    <linearGradient id="colorVital" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ba1a1a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ba1a1a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'var(--tooltip-bg)',
                      color: 'var(--tooltip-text)'
                    }}
                  />
                  <Area type="monotone" dataKey="heartRate" stroke="#ba1a1a" strokeWidth={3} fillOpacity={1} fill="url(#colorVital)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Medical History */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-lg font-bold font-headline text-slate-900 dark:text-slate-100">Medical History</h2>
              <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {medicalHistory.map((item, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400">
                      <span className="text-[10px] font-bold uppercase">{item.date.split(' ')[0]}</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{item.date.split(' ')[1].replace(',', '')}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{item.event}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.doctor} • {item.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md",
                      item.status === 'Completed' || item.status === 'Final' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    )}>
                      {item.status}
                    </span>
                    <ChevronRight size={18} className="text-slate-300 dark:text-slate-700 group-hover:text-primary transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-8">
          {/* Patient Info Card */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold font-headline mb-6 text-slate-900 dark:text-slate-100">Patient Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Blood Type</span>
                <span className="text-xs font-bold text-error bg-error-container/20 px-2 py-0.5 rounded-md">{patient.blood}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Weight</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{patient.weight}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Height</span>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{patient.height}</span>
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone</span>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{patient.phone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email</span>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{patient.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</span>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-relaxed">{patient.address}</p>
              </div>
            </div>
          </section>

          {/* Active Medications */}
          <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold font-headline text-slate-900 dark:text-slate-100">Active Medications</h3>
              <button className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-lg hover:text-primary transition-colors"><Plus size={16} /></button>
            </div>
            <div className="space-y-4">
              {medications.map((med) => (
                <div key={med.name} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary shrink-0">
                    <Pill size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{med.name}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{med.dosage} • {med.frequency}</p>
                    <span className="text-[9px] font-bold text-primary/70 uppercase tracking-widest mt-1 block">{med.type}</span>
                  </div>
                  <button className="text-slate-300 dark:text-slate-700 hover:text-slate-600 dark:hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100"><MoreVertical size={14} /></button>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Appointments */}
          <section className="bg-primary p-6 rounded-2xl shadow-lg shadow-primary/20 text-white">
            <h3 className="text-sm font-bold mb-6">Next Appointment</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold uppercase opacity-70">Apr</span>
                <span className="text-lg font-bold">12</span>
              </div>
              <div>
                <h4 className="text-sm font-bold">Cardiology Review</h4>
                <p className="text-xs opacity-70">09:30 AM • Dr. Sarah Jenkins</p>
              </div>
            </div>
            <button className="w-full py-3 bg-white text-primary rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-colors">
              Reschedule
            </button>
          </section>

          {/* Critical Alerts */}
          <section className="bg-error-container/20 dark:bg-error-container/10 p-6 rounded-2xl border border-error/10 dark:border-error/20">
            <div className="flex items-center gap-2 text-error mb-2">
              <AlertCircle size={18} />
              <h3 className="text-sm font-bold">Clinical Alert</h3>
            </div>
            <p className="text-xs text-error/80 dark:text-error/60 leading-relaxed mb-4">
              Patient has reported increased dizziness after starting new dosage of Lisinopril. Monitor BP closely.
            </p>
            <button className="text-xs font-bold text-error uppercase tracking-widest hover:underline">Acknowledge</button>
          </section>
        </div>
      </div>
    </div>
  );
}
