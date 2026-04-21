import React, { useState } from 'react';
import { Search, Mail, Phone, Star, Award, Clock, ChevronRight, UserPlus, Filter, Pencil, Trash2, Eye, Calendar, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/src/context/DataContext.jsx';
import Modal, { ConfirmModal, FormField } from './Modal.jsx';

const SPECIALTIES = ['Cardiology','Neurology','Pediatrics','Orthopedics','Dermatology','General Surgery','Oncology','Radiology','Emergency Medicine','Psychiatry','Obstetrics','Ophthalmology'];
const STATUSES = ['On Duty','Off Duty','In Surgery'];
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

function buildForm(d) {
  if (!d) return { firstName:'', lastName:'', specialty:'', department:'', experience:'', status:'On Duty', email:'', phone:'' };
  return { firstName: d.firstName||'', lastName: d.lastName||'', specialty: d.specialty||'', department: d.department||'', experience: d.experience||'', status: d.status||'On Duty', email: d.email||'', phone: d.phone||'' };
}

export default function Doctors() {
  const { doctors, addDoctor, updateDoctor, updateDoctorSchedule, deleteDoctor } = useData();
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const [modal, setModal] = useState(null); // 'add'|'edit'|'view'|'schedule'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(buildForm(null));
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const navigate = useNavigate();

  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    return (d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)) && (!specFilter || d.specialty === specFilter);
  });

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.specialty) e.specialty = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    return e;
  };

  const openAdd = () => { setForm(buildForm(null)); setErrors({}); setSuccess(false); setModal('add'); };
  const openEdit = (d, ev) => { ev && ev.stopPropagation(); setSelected(d); setForm(buildForm(d)); setErrors({}); setSuccess(false); setModal('edit'); };
  const openView = (d, ev) => { ev && ev.stopPropagation(); setSelected(d); setModal('view'); };
  const openSchedule = (d, ev) => { ev && ev.stopPropagation(); setSelected(d); setSchedule(d.schedule ? JSON.parse(JSON.stringify(d.schedule)) : DAYS.map(day => ({ day, start: '09:00', end: '17:00', available: true }))); setSuccess(false); setModal('schedule'); };
  const closeModal = () => { setModal(null); setSelected(null); setSuccess(false); };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (modal === 'add') addDoctor(form);
    else updateDoctor(selected.id, form);
    setSuccess(true);
    setTimeout(closeModal, 1600);
  };

  const handleScheduleSave = () => {
    updateDoctorSchedule(selected.id, schedule);
    setSuccess(true);
    setTimeout(closeModal, 1500);
  };

  const statusDot = s => s === 'On Duty' ? 'bg-emerald-500' : s === 'In Surgery' ? 'bg-red-500' : 'bg-slate-300';
  const statusBadge = s => s === 'On Duty' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : s === 'In Surgery' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400';



  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold font-headline text-blue-900 dark:text-blue-400">Medical Staff</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Directory of specialized doctors and surgeons</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { if (doctors.length > 0) openSchedule(doctors[0]); }} className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"><Calendar size={16} />Manage Schedule</button>
          <button onClick={openAdd} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"><UserPlus size={18} />Add New Staff</button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input type="text" placeholder="Search by name or specialty..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none text-slate-900 dark:text-slate-100" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <button onClick={() => setShowFilter(v => !v)} className={cn("flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-colors", specFilter ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700')}>
            <Filter size={16} />{specFilter || 'Specialty'}
          </button>
          {showFilter && (
            <div className="absolute right-0 top-12 z-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden w-48 max-h-60 overflow-y-auto">
              <button onClick={() => { setSpecFilter(''); setShowFilter(false); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">All Specialties</button>
              {SPECIALTIES.map(s => <button key={s} onClick={() => { setSpecFilter(s); setShowFilter(false); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">{s}</button>)}
            </div>
          )}
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total: {filtered.length} Staff</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(doctor => (
          <div key={doctor.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="relative">
                  <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-sm" referrerPolicy="no-referrer" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 items-center justify-center text-slate-600 font-bold text-lg hidden absolute inset-0">{doctor.firstName?.[0]}{doctor.lastName?.[0]}</div>
                  <span className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800", statusDot(doctor.status))}></span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg", statusBadge(doctor.status))}>{doctor.status}</span>
                  <div className="flex items-center gap-1 text-amber-500"><Star size={13} fill="currentColor" /><span className="text-sm font-bold text-slate-900 dark:text-slate-100">{doctor.rating}</span></div>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-headline">{doctor.name}</h3>
                <p className="text-sm text-primary font-semibold">{doctor.specialty}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1"><Award size={12} /><span className="text-[9px] font-bold uppercase tracking-wider">Experience</span></div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{doctor.experience} Yrs</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1"><Clock size={12} /><span className="text-[9px] font-bold uppercase tracking-wider">Reviews</span></div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{doctor.reviews}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openView(doctor)} title="View" className="flex-1 p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"><Eye size={15} /></button>
                <button onClick={() => openSchedule(doctor)} title="Schedule" className="flex-1 p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"><Calendar size={15} /></button>
                <button onClick={e => openEdit(doctor, e)} title="Edit" className="flex-1 p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/20 hover:text-amber-600 transition-colors flex items-center justify-center"><Pencil size={15} /></button>
                <button onClick={() => { setSelected(doctor); setConfirmDelete(doctor); }} title="Delete" className="flex-1 p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors flex items-center justify-center"><Trash2 size={15} /></button>
                <button onClick={() => navigate('/doctors/' + doctor.id)} className="flex-[2] p-2 bg-primary/5 text-primary rounded-xl hover:bg-primary hover:text-white transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1">Profile <ChevronRight size={13} /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-3 py-20 text-center text-slate-400 text-sm">No staff found.</div>}
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modal === 'add' || modal === 'edit'} onClose={closeModal}
        title={modal === 'add' ? 'Add New Staff Member' : 'Edit Staff Member'}
        subtitle={modal === 'add' ? 'Register a new doctor or medical professional' : `Editing ${selected?.name}`}
        success={success} successTitle={modal === 'add' ? 'Staff Member Added!' : 'Staff Member Updated!'} successMsg="The staff directory has been updated.">

    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Personal Information</p>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="First Name" required value={form.firstName} onChange={e => set('firstName', e.target.value)} error={errors.firstName} />
          <FormField label="Last Name" required value={form.lastName} onChange={e => set('lastName', e.target.value)} error={errors.lastName} />
          <FormField label="Specialty" options={SPECIALTIES} required value={form.specialty} onChange={e => set('specialty', e.target.value)} error={errors.specialty} />
          <FormField label="Department" value={form.department} onChange={e => set('department', e.target.value)} />
          <FormField label="Years of Experience" type="number" value={form.experience} onChange={e => set('experience', e.target.value)} />
          <FormField label="Current Status" options={STATUSES} required value={form.status} onChange={e => set('status', e.target.value)} />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Contact</p>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Email Address" type="email" required value={form.email} onChange={e => set('email', e.target.value)} error={errors.email} />
          <FormField label="Phone Number" type="tel" required value={form.phone} onChange={e => set('phone', e.target.value)} error={errors.phone} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
        <button onClick={handleSubmit} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2">
          <UserPlus size={16} />{modal === 'add' ? 'Add Staff Member' : 'Save Changes'}
        </button>
      </div>
    </div>
 
      </Modal>

      {/* View Doctor Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <img src={selected.image} className="w-14 h-14 rounded-2xl object-cover" referrerPolicy="no-referrer" onError={e => e.target.style.display='none'} />
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{selected.name}</h2>
                  <p className="text-xs text-primary font-semibold">{selected.specialty}</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-3">
              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg", statusBadge(selected.status))}>{selected.status}</span>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[['Experience', selected.experience + ' Years'],['Department', selected.department],['Email', selected.email],['Phone', selected.phone],['Reviews', selected.reviews + ' patients'],['Rating', selected.rating + '/5']].map(([k, v]) => v ? (
                  <div key={k}><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{k}</p><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{v}</p></div>
                ) : null)}
              </div>
              <div className="pt-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Weekly Schedule</p>
                <div className="space-y-1">
                  {selected.schedule?.filter(s => s.available).map(s => (
                    <div key={s.day} className="flex justify-between text-xs"><span className="font-semibold text-slate-600 dark:text-slate-400">{s.day}</span><span className="text-slate-500">{s.start} – {s.end}</span></div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button onClick={e => { closeModal(); setTimeout(() => openEdit(selected, e), 50); }} className="flex-1 py-2.5 rounded-xl bg-primary/5 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"><Pencil size={14} />Edit</button>
                <button onClick={() => { closeModal(); setTimeout(() => openSchedule(selected), 50); }} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"><Calendar size={14} />Schedule</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <Modal open={modal === 'schedule'} onClose={closeModal} maxWidth="max-w-md"
        title="Manage Schedule" subtitle={selected ? `Weekly availability for ${selected.name}` : ''}
        success={success} successTitle="Schedule Saved!" successMsg="The schedule has been updated.">
        <div className="space-y-3">
          {schedule.map((slot, idx) => (
            <div key={slot.day} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <button onClick={() => setSchedule(prev => prev.map((s, i) => i === idx ? { ...s, available: !s.available } : s))}
                className={cn("w-9 h-5 rounded-full transition-colors relative flex-shrink-0", slot.available ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600')}>
                <span className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all", slot.available ? 'left-[18px]' : 'left-0.5')} />
              </button>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-24">{slot.day}</span>
              {slot.available ? (
                <div className="flex items-center gap-2 flex-1">
                  <input type="time" value={slot.start} onChange={e => setSchedule(prev => prev.map((s, i) => i === idx ? { ...s, start: e.target.value } : s))} className="flex-1 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20" />
                  <span className="text-xs text-slate-400">–</span>
                  <input type="time" value={slot.end} onChange={e => setSchedule(prev => prev.map((s, i) => i === idx ? { ...s, end: e.target.value } : s))} className="flex-1 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              ) : <span className="text-xs text-slate-400 italic flex-1">Not available</span>}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
            <button onClick={handleScheduleSave} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2"><Calendar size={16} />Save Schedule</button>
          </div>
        </div>
      </Modal>

      <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteDoctor(confirmDelete.id)}
        title="Remove Staff Member" message={`Remove ${confirmDelete?.name} from the directory? This cannot be undone.`} danger />
    </div>
  );
}
