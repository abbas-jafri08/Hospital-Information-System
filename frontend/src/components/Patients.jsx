import React, { useState } from 'react';
import { Search, Filter, MoreVertical, UserPlus, ChevronLeft, ChevronRight, FileText, Activity, Pencil, Trash2, Eye, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/src/context/DataContext.jsx';
import Modal, { ConfirmModal, FormField } from './Modal.jsx';

const BLOOD = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
const STATUSES = ['Outpatient','Inpatient','Observation','Discharged'];
const GENDERS = ['Male','Female','Other'];

function buildForm(p) {
  if (!p) return { firstName:'', lastName:'', dob:'', gender:'', blood:'', phone:'', email:'', address:'', condition:'', status:'Outpatient', emergencyContact:'', emergencyPhone:'' };
  return { firstName: p.firstName||'', lastName: p.lastName||'', dob: p.dob||'', gender: p.gender||'', blood: p.blood||'', phone: p.phone||'', email: p.email||'', address: p.address||'', condition: p.condition||'', status: p.status||'Outpatient', emergencyContact: p.emergencyContact||'', emergencyPhone: p.emergencyPhone||'' };
}

const PAGE_SIZE = 8;

export default function Patients() {
  const { patients, addPatient, updatePatient, deletePatient } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(null); // 'add' | 'edit' | 'view'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(buildForm(null));
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const navigate = useNavigate();

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    const matchQ = p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.condition.toLowerCase().includes(q);
    const matchS = !statusFilter || p.status === statusFilter;
    return matchQ && matchS;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.dob) e.dob = 'Required';
    if (!form.gender) e.gender = 'Required';
    if (!form.blood) e.blood = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.condition.trim()) e.condition = 'Required';
    return e;
  };

  const openAdd = () => { setForm(buildForm(null)); setErrors({}); setSuccess(false); setModal('add'); };
  const openEdit = (p, e) => { e.stopPropagation(); setSelected(p); setForm(buildForm(p)); setErrors({}); setSuccess(false); setModal('edit'); };
  const openView = (p, e) => { e && e.stopPropagation(); setSelected(p); setModal('view'); };
  const closeModal = () => { setModal(null); setSelected(null); setSuccess(false); };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (modal === 'add') addPatient(form);
    else updatePatient(selected.id, form);
    setSuccess(true);
    setTimeout(closeModal, 1600);
  };

  const statusColor = s =>
    s === 'Inpatient' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
    s === 'Outpatient' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
    s === 'Observation' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold font-headline text-blue-900 dark:text-blue-400">Patient Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and monitor all registered patients</p>
        </div>
        <button onClick={openAdd} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95">
          <UserPlus size={18} /><span className="text-sm">Register New Patient</span>
        </button>
      </div>

      {/* Search & filter bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input type="text" placeholder="Search by name, ID, or condition..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none text-slate-900 dark:text-slate-100" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div className="relative">
          <button onClick={() => setShowFilter(v => !v)} className={cn("flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-colors", statusFilter ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700')}>
            <Filter size={16} />{statusFilter || 'Filter'}
          </button>
          {showFilter && (
            <div className="absolute right-0 top-12 z-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden w-40">
              <button onClick={() => { setStatusFilter(''); setShowFilter(false); setPage(1); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">All Status</button>
              {STATUSES.map(s => <button key={s} onClick={() => { setStatusFilter(s); setShowFilter(false); setPage(1); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">{s}</button>)}
            </div>
          )}
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total: {filtered.length}</p>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              {['Patient Details','ID','Status','Condition','Last Visit','Actions'].map(h => (
                <th key={h} className={cn("px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400", h === 'Actions' && 'text-right')}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {paged.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">No patients found.</td></tr>
            )}
            {paged.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => openView(p)}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-xs">{p.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{p.age}y • {p.gender} • {p.blood}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="text-xs font-mono font-bold text-slate-400">{p.id}</span></td>
                <td className="px-6 py-4"><span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full", statusColor(p.status))}>{p.status}</span></td>
                <td className="px-6 py-4"><p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{p.condition}</p></td>
                <td className="px-6 py-4"><p className="text-xs font-medium text-slate-500 dark:text-slate-400">{p.lastVisit}</p></td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); navigate('/medical-records'); }} title="Records" className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"><FileText size={15} /></button>
                    <button onClick={e => openView(p, e)} title="View" className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"><Eye size={15} /></button>
                    <button onClick={e => openEdit(p, e)} title="Edit" className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"><Pencil size={15} /></button>
                    <button onClick={e => { e.stopPropagation(); setConfirmDelete(p); }} title="Delete" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Page {page} of {totalPages} • {filtered.length} patients</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 transition-all"><ChevronLeft size={16} /></button>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 transition-all shadow-sm"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal open={modal === 'add' || modal === 'edit'} onClose={closeModal}
        title={modal === 'add' ? 'Register New Patient' : 'Edit Patient'}
        subtitle={modal === 'add' ? 'Fill in the patient details below' : `Editing ${selected?.name}`}
        success={success} successTitle={modal === 'add' ? 'Patient Registered!' : 'Patient Updated!'} successMsg="Changes have been saved.">

    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Personal Information</p>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="First Name" required value={form.firstName} onChange={e => set('firstName', e.target.value)} error={errors.firstName} />
          <FormField label="Last Name" required value={form.lastName} onChange={e => set('lastName', e.target.value)} error={errors.lastName} />
          <FormField label="Date of Birth" type="date" required value={form.dob} onChange={e => set('dob', e.target.value)} error={errors.dob} />
          <FormField label="Gender" options={GENDERS} required value={form.gender} onChange={e => set('gender', e.target.value)} error={errors.gender} />
          <FormField label="Blood Group" options={BLOOD} required value={form.blood} onChange={e => set('blood', e.target.value)} error={errors.blood} />
          <FormField label="Phone Number" type="tel" required value={form.phone} onChange={e => set('phone', e.target.value)} error={errors.phone} />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Contact & Address</p>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Email Address" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
          <FormField label="Address" value={form.address} onChange={e => set('address', e.target.value)} />
          <FormField label="Emergency Contact" value={form.emergencyContact} onChange={e => set('emergencyContact', e.target.value)} />
          <FormField label="Emergency Phone" type="tel" value={form.emergencyPhone} onChange={e => set('emergencyPhone', e.target.value)} />
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Medical Information</p>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Primary Condition" required value={form.condition} onChange={e => set('condition', e.target.value)} error={errors.condition} />
          <FormField label="Admission Status" options={STATUSES} required value={form.status} onChange={e => set('status', e.target.value)} error={errors.status} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
        <button onClick={handleSubmit} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2">
          <UserPlus size={16} />{modal === 'add' ? 'Register Patient' : 'Save Changes'}
        </button>
      </div>
    </div>
 
      </Modal>

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-100 dark:border-slate-800">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-extrabold text-lg">{selected.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">{selected.name}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{selected.id} • {selected.age}y • {selected.gender} • {selected.blood}</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full", statusColor(selected.status))}>{selected.status}</span>
              <div className="grid grid-cols-2 gap-4 mt-3">
                {[['Condition', selected.condition],['Last Visit', selected.lastVisit],['Phone', selected.phone],['Email', selected.email],['Address', selected.address],['Emergency Contact', selected.emergencyContact],['Emergency Phone', selected.emergencyPhone]].map(([k, v]) => v ? (
                  <div key={k}><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{k}</p><p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{v}</p></div>
                ) : null)}
              </div>
              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button onClick={e => { closeModal(); setTimeout(() => openEdit(selected, e), 50); }} className="flex-1 py-2.5 rounded-xl bg-primary/5 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"><Pencil size={15} />Edit</button>
                <button onClick={() => { closeModal(); setConfirmDelete(selected); }} className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-2"><Trash2 size={15} />Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deletePatient(confirmDelete.id)}
        title="Delete Patient" message={`Remove ${confirmDelete?.name} from the directory? This cannot be undone.`} danger />
    </div>
  );
}
