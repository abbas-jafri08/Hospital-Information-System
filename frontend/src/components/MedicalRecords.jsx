import React, { useState, useRef } from 'react';
import { Search, FileText, Download, Eye, Filter, Calendar, User, Tag, Pencil, Trash2, Upload, UploadCloud, X, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useData } from '@/src/context/DataContext.jsx';
import Modal, { ConfirmModal, FormField } from './Modal.jsx';

const RECORD_TYPES = ['Lab Result','Prescription','X-Ray Scan','MRI Report','Blood Test','Discharge Summary','CT Scan','Ultrasound','ECG','Pathology Report'];
const STATUSES = ['Final','Active','Draft','Archived'];

function buildForm(r) {
  if (!r) return { patientName:'', type:'', doctorName:'', status:'Final', notes:'', fileName:'', size:'N/A' };
  return { patientName: r.patientName||'', type: r.type||'', doctorName: r.doctorName||'', status: r.status||'Final', notes: r.notes||'', fileName: r.fileName||'', size: r.size||'N/A' };
}

export default function MedicalRecords() {
  const { records, addRecord, updateRecord, deleteRecord, doctors } = useData();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(buildForm(null));
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const fileRef = useRef();

  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    return (r.patientName.toLowerCase().includes(q) || r.type.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.doctorName.toLowerCase().includes(q)) && (!typeFilter || r.type === typeFilter);
  });

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = 'Required';
    if (!form.type) e.type = 'Required';
    if (!form.doctorName) e.doctorName = 'Required';
    return e;
  };

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    const sz = f.size > 1024 * 1024 ? (f.size / (1024 * 1024)).toFixed(1) + ' MB' : Math.round(f.size / 1024) + ' KB';
    setForm(p => ({ ...p, fileName: f.name, size: sz }));
  };

  const openAdd = () => { setForm(buildForm(null)); setFile(null); setErrors({}); setSuccess(false); setUploading(false); setModal('add'); };
  const openEdit = (r, ev) => { ev && ev.stopPropagation(); setSelected(r); setForm(buildForm(r)); setFile(null); setErrors({}); setSuccess(false); setModal('edit'); };
  const openView = (r, ev) => { ev && ev.stopPropagation(); setSelected(r); setModal('view'); };
  const closeModal = () => { setModal(null); setSelected(null); setSuccess(false); setUploading(false); setFile(null); };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (modal === 'add') {
      setUploading(true);
      setTimeout(() => { addRecord(form); setUploading(false); setSuccess(true); setTimeout(closeModal, 1600); }, 1000);
    } else {
      updateRecord(selected.id, form);
      setSuccess(true);
      setTimeout(closeModal, 1600);
    }
  };

  const statusColor = s =>
    s === 'Final' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
    s === 'Active' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
    s === 'Draft' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
    'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400';

  const doctorOptions = doctors.map(d => d.name);



  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold font-headline text-blue-900 dark:text-blue-400">Medical Records</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Access and manage clinical documentation and lab results</p>
        </div>
        <button onClick={openAdd} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"><FileText size={18} /><span className="text-sm">Upload New Record</span></button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input type="text" placeholder="Search by ID, patient, type, or doctor..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none text-slate-900 dark:text-slate-100" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="relative">
          <button onClick={() => setShowFilter(v => !v)} className={cn("flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-colors", typeFilter ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700')}>
            <Filter size={16} />{typeFilter || 'Filter Type'}
          </button>
          {showFilter && (
            <div className="absolute right-0 top-12 z-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden w-48 max-h-60 overflow-y-auto">
              <button onClick={() => { setTypeFilter(''); setShowFilter(false); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">All Types</button>
              {RECORD_TYPES.map(t => <button key={t} onClick={() => { setTypeFilter(t); setShowFilter(false); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">{t}</button>)}
            </div>
          )}
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total: {filtered.length} Records</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filtered.length === 0 && <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-sm">No records found.</div>}
        {filtered.map(r => (
          <div key={r.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all group flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary dark:text-blue-400 flex-shrink-0"><FileText size={22} /></div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{r.type}</h4>
                  <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md", statusColor(r.status))}>{r.status}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><User size={11} /> {r.patientName}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {r.date}</span>
                  <span className="flex items-center gap-1 font-mono hidden sm:flex"><Tag size={11} /> {r.id}</span>
                </div>
                {r.notes && <p className="text-xs text-slate-400 mt-0.5 italic">{r.notes}</p>}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{r.doctorName}</p>
                <p className="text-[10px] text-slate-400 font-medium">{r.size} • {r.fileName}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={e => openView(r, e)} title="View" className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"><Eye size={18} /></button>
                <button onClick={e => openEdit(r, e)} title="Edit" className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-all"><Pencil size={18} /></button>
                <button title="Download" className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"><Download size={18} /></button>
                <button onClick={e => { e.stopPropagation(); setConfirmDelete(r); }} title="Delete" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modal === 'add' || modal === 'edit'} onClose={closeModal} maxWidth="max-w-lg"
        title={modal === 'add' ? 'Upload New Record' : 'Edit Medical Record'}
        subtitle={modal === 'add' ? 'Add a new clinical document or lab result' : `Editing ${selected?.id}`}
        success={success} successTitle={modal === 'add' ? 'Record Uploaded!' : 'Record Updated!'} successMsg="The medical record has been saved.">

    <div className="space-y-4">
      {modal === 'add' && (
        <div className={cn("border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer", dragOver ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50')}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx,.dcm" onChange={e => handleFile(e.target.files[0])} />
          <UploadCloud size={30} className={cn("mx-auto mb-2", dragOver || file ? 'text-primary' : 'text-slate-300 dark:text-slate-600')} />
          {file ? (
            <div><p className="text-sm font-bold text-slate-900 dark:text-slate-100">{file.name}</p><p className="text-xs text-slate-400 mt-0.5">{form.size}</p></div>
          ) : (
            <div><p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Drop file or <span className="text-primary underline">browse</span></p><p className="text-xs text-slate-400 mt-0.5">PDF, JPG, PNG, DOCX, DCM up to 50 MB</p></div>
          )}
        </div>
      )}
      <FormField label="Patient Name" required value={form.patientName} onChange={e => set('patientName', e.target.value)} error={errors.patientName} />
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Record Type" options={RECORD_TYPES} required value={form.type} onChange={e => set('type', e.target.value)} error={errors.type} />
        <FormField label="Assigned Doctor" options={doctorOptions} required value={form.doctorName} onChange={e => set('doctorName', e.target.value)} error={errors.doctorName} />
      </div>
      <FormField label="Record Status" options={STATUSES} value={form.status} onChange={e => set('status', e.target.value)} />
      <FormField label="Notes" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Additional notes about this record…" />
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
        <button onClick={handleSubmit} disabled={uploading} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70">
          {uploading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading…</> : modal === 'add' ? <><Upload size={15} />Upload Record</> : <><Check size={15} />Save Changes</>}
        </button>
      </div>
    </div>
 
      </Modal>

      {/* View Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary"><FileText size={22} /></div>
                <div><h2 className="font-extrabold text-slate-900 dark:text-slate-100">{selected.type}</h2><p className="text-xs text-slate-500">{selected.id}</p></div>
              </div>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-3">
              <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md", statusColor(selected.status))}>{selected.status}</span>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[['Patient', selected.patientName],['Doctor', selected.doctorName],['Date', selected.date],['File Size', selected.size],['File Name', selected.fileName],['Notes', selected.notes]].map(([k, v]) => v ? (
                  <div key={k} className={k === 'Notes' || k === 'File Name' ? 'col-span-2' : ''}><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{k}</p><p className="text-xs font-semibold text-slate-700 dark:text-slate-300 break-all">{v}</p></div>
                ) : null)}
              </div>
              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button onClick={e => { closeModal(); setTimeout(() => openEdit(selected, e), 50); }} className="flex-1 py-2.5 rounded-xl bg-primary/5 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1.5"><Pencil size={14} />Edit</button>
                <button className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"><Download size={14} />Download</button>
                <button onClick={() => { closeModal(); setConfirmDelete(selected); }} className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteRecord(confirmDelete.id)}
        title="Delete Record" message={`Delete record ${confirmDelete?.id} for ${confirmDelete?.patientName}? This cannot be undone.`} danger />
    </div>
  );
}
