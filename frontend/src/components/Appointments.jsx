import React, { useState } from 'react';
import { Calendar, Clock, MoreVertical, Plus, ChevronLeft, ChevronRight, Video, User, Search, Filter, Pencil, Trash2, Eye, Check, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useData } from '@/src/context/DataContext.jsx';
import Modal, { ConfirmModal, FormField } from './Modal.jsx';

const TYPES = ['In-Person', 'Telehealth'];
const STATUS_LIST = ['Pending','Confirmed','Completed','Cancelled'];
const TABS = ['Upcoming','Completed','Cancelled'];

function getCategory(apt) {
  if (apt.status === 'Cancelled') return 'Cancelled';
  if (apt.status === 'Completed') return 'Completed';
  return 'Upcoming';
}

function fmt12(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':');
  const hour = parseInt(h);
  return (hour > 12 ? hour - 12 : hour || 12) + ':' + m + ' ' + (hour >= 12 ? 'PM' : 'AM');
}

function buildForm(a) {
  if (!a) return { patientName:'', doctorId:'', doctorName:'', specialty:'', date:'', time:'', type:'In-Person', status:'Pending', notes:'' };
  return { patientName: a.patientName||'', doctorId: a.doctorId||'', doctorName: a.doctorName||'', specialty: a.specialty||'', date: a.date||'', time: a.time||'', type: a.type||'In-Person', status: a.status||'Pending', notes: a.notes||'' };
}

export default function Appointments() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, doctors } = useData();
  const [tab, setTab] = useState('Upcoming');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(buildForm(null));
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [calMonth, setCalMonth] = useState(new Date(2024, 3, 1));

  const filtered = appointments.filter(a => {
    const q = search.toLowerCase();
    return getCategory(a) === tab && (a.patientName.toLowerCase().includes(q) || a.doctorName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));
  });

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const selectDoctor = (id) => {
    const d = doctors.find(doc => doc.id === id);
    set('doctorId', id);
    if (d) { setForm(f => ({ ...f, doctorId: id, doctorName: d.name, specialty: d.specialty })); }
  };

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = 'Required';
    if (!form.doctorId) e.doctorId = 'Required';
    if (!form.date) e.date = 'Required';
    if (!form.time) e.time = 'Required';
    return e;
  };

  const openAdd = () => { setForm(buildForm(null)); setErrors({}); setSuccess(false); setModal('add'); };
  const openEdit = (a, ev) => { ev && ev.stopPropagation(); setSelected(a); setForm(buildForm(a)); setErrors({}); setSuccess(false); setModal('edit'); };
  const openView = (a, ev) => { ev && ev.stopPropagation(); setSelected(a); setModal('view'); };
  const closeModal = () => { setModal(null); setSelected(null); setSuccess(false); };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (modal === 'add') addAppointment(form);
    else updateAppointment(selected.id, form);
    setSuccess(true);
    setTimeout(closeModal, 1600);
  };

  const quickStatus = (id, status) => updateAppointment(id, { status });

  const statusColor = s =>
    s === 'Confirmed' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
    s === 'Pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
    s === 'Completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
    'bg-red-100 dark:bg-red-900/20 text-red-600';

  // Mini calendar
  const year = calMonth.getFullYear(), mon = calMonth.getMonth();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const firstDay = new Date(year, mon, 1).getDay();
  const aptDates = new Set(appointments.map(a => a.date));



  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold font-headline text-blue-900 dark:text-blue-400">Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Schedule and manage patient consultations</p>
        </div>
        <button onClick={openAdd} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"><Plus size={18} /><span className="text-sm">New Appointment</span></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mini calendar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{calMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
              <div className="flex gap-1">
                <button onClick={() => setCalMonth(new Date(year, mon - 1, 1))} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400"><ChevronLeft size={15} /></button>
                <button onClick={() => setCalMonth(new Date(year, mon + 1, 1))} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400"><ChevronRight size={15} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center mb-2">
              {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="text-[9px] font-bold text-slate-400 uppercase">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center">
              {Array.from({ length: firstDay }).map((_, i) => <span key={'e' + i} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dateStr = `${year}-${String(mon + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                const hasApt = aptDates.has(dateStr);
                const isToday = new Date().toDateString() === new Date(year, mon, i + 1).toDateString();
                return (
                  <button key={i} className={cn("h-7 w-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all relative",
                    isToday ? "bg-primary text-white shadow-sm" : hasApt ? "text-primary font-extrabold" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800")}>
                    {i + 1}
                    {hasApt && !isToday && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl border border-primary/10 dark:border-primary/20">
            <h4 className="text-sm font-bold text-primary mb-1">Today's Summary</h4>
            <p className="text-xs text-primary/70 mb-3">{appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length} appointments today</p>
            <div className="flex flex-col gap-1.5">
              {STATUS_LIST.map(s => {
                const count = appointments.filter(a => a.status === s).length;
                return <div key={s} className="flex justify-between text-xs"><span className="text-slate-500 dark:text-slate-400">{s}</span><span className="font-bold text-slate-700 dark:text-slate-300">{count}</span></div>;
              })}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input type="text" placeholder="Search by patient, doctor, or ID..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none text-slate-900 dark:text-slate-100" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            {TABS.map(t => <button key={t} onClick={() => setTab(t)} className={cn("text-sm font-bold pb-2 px-1 transition-all", tab === t ? "text-primary border-b-2 border-primary" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300")}>{t} <span className="text-[10px] ml-1 text-slate-400">{appointments.filter(a => getCategory(a) === t).length}</span></button>)}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-400 font-medium text-sm">No {tab.toLowerCase()} appointments.</p>
                {tab === 'Upcoming' && <button onClick={openAdd} className="mt-3 text-primary text-sm font-bold hover:underline">+ New Appointment</button>}
              </div>
            )}
            {filtered.map(apt => (
              <div key={apt.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex-shrink-0">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{apt.date}</span>
                      <span className="text-base font-bold text-slate-900 dark:text-slate-100">{fmt12(apt.time).split(' ')[0]}</span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase">{fmt12(apt.time).split(' ')[1]}</span>
                    </div>
                    <div className="h-9 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block" />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{apt.patientName}</h4>
                        <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md", apt.type === 'Telehealth' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400')}>{apt.type}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><User size={11} /> {apt.doctorName}</span>
                        <span className="hidden sm:flex items-center gap-1"><Clock size={11} /> 30 min</span>
                        {apt.specialty && <span className="hidden md:block font-medium">{apt.specialty}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full hidden sm:inline-block", statusColor(apt.status))}>{apt.status}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {apt.type === 'Telehealth' && apt.status === 'Confirmed' && <button title="Join call" className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"><Video size={16} /></button>}
                      <button onClick={e => openView(apt, e)} title="View" className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"><Eye size={15} /></button>
                      <button onClick={e => openEdit(apt, e)} title="Edit" className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"><Pencil size={15} /></button>
                      <button onClick={e => { e.stopPropagation(); setConfirmDelete(apt); }} title="Delete" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
                {/* Quick status actions */}
                {tab === 'Upcoming' && apt.status === 'Pending' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                    <button onClick={() => quickStatus(apt.id, 'Confirmed')} className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-1.5 rounded-lg transition-all"><Check size={12} />Confirm</button>
                    <button onClick={() => quickStatus(apt.id, 'Cancelled')} className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-all"><X size={12} />Cancel</button>
                    <button onClick={() => quickStatus(apt.id, 'Completed')} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-all ml-auto">Mark Complete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal open={modal === 'add' || modal === 'edit'} onClose={closeModal} maxWidth="max-w-lg"
        title={modal === 'add' ? 'New Appointment' : 'Edit Appointment'}
        subtitle={modal === 'add' ? 'Schedule a patient consultation' : `Editing ${selected?.id}`}
        success={success} successTitle={modal === 'add' ? 'Appointment Scheduled!' : 'Appointment Updated!'} successMsg="The appointment has been saved.">

    <div className="space-y-4">
      <FormField label="Patient Name" required value={form.patientName} onChange={e => set('patientName', e.target.value)} error={errors.patientName} placeholder="Full name" />
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Assign Doctor <span className="text-red-500">*</span></label>
        <select value={form.doctorId} onChange={e => selectDoctor(e.target.value)} className={cn("w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 outline-none", errors.doctorId ? 'border-red-400' : 'border-slate-200 dark:border-slate-700')}>
          <option value="">Select doctor…</option>
          {doctors.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
        </select>
        {errors.doctorId && <p className="text-[10px] text-red-500 mt-1">{errors.doctorId}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Date" type="date" required value={form.date} onChange={e => set('date', e.target.value)} error={errors.date} />
        <FormField label="Time" type="time" required value={form.time} onChange={e => set('time', e.target.value)} error={errors.time} />
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Type</label>
        <div className="flex gap-2">
          {TYPES.map(t => <button key={t} onClick={() => set('type', t)} className={cn("flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border", form.type === t ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800')}>{t}</button>)}
        </div>
      </div>
      {modal === 'edit' && (
        <FormField label="Status" options={STATUS_LIST} value={form.status} onChange={e => set('status', e.target.value)} />
      )}
      <FormField label="Notes" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional notes…" />
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
        <button onClick={handleSubmit} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2">
          <Calendar size={16} />{modal === 'add' ? 'Schedule Appointment' : 'Save Changes'}
        </button>
      </div>
    </div>
 
      </Modal>

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 dark:border-slate-800">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
              <div><h2 className="font-extrabold text-slate-900 dark:text-slate-100">{selected.patientName}</h2><p className="text-xs text-slate-500">{selected.id}</p></div>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-3">
              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full", statusColor(selected.status))}>{selected.status}</span>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[['Doctor', selected.doctorName],['Specialty', selected.specialty],['Date', selected.date],['Time', fmt12(selected.time)],['Type', selected.type],['Notes', selected.notes]].map(([k, v]) => v ? (
                  <div key={k} className={k === 'Notes' ? 'col-span-2' : ''}><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{k}</p><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{v}</p></div>
                ) : null)}
              </div>
              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button onClick={e => { closeModal(); setTimeout(() => openEdit(selected, e), 50); }} className="flex-1 py-2.5 rounded-xl bg-primary/5 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1.5"><Pencil size={14} />Edit</button>
                <button onClick={() => { closeModal(); setConfirmDelete(selected); }} className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteAppointment(confirmDelete.id)}
        title="Delete Appointment" message={`Delete appointment for ${confirmDelete?.patientName}? This cannot be undone.`} danger />
    </div>
  );
}
