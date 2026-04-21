import React, { useState } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownRight, Download, Pencil, Trash2, Eye, Search, Filter, Plus, X, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '@/src/context/DataContext.jsx';
import Modal, { ConfirmModal, FormField } from './Modal.jsx';

const billingData = [
  { name: 'Jan', revenue: 45000, expenses: 32000 },
  { name: 'Feb', revenue: 52000, expenses: 34000 },
  { name: 'Mar', revenue: 48000, expenses: 31000 },
  { name: 'Apr', revenue: 61000, expenses: 38000 },
  { name: 'May', revenue: 55000, expenses: 35000 },
  { name: 'Jun', revenue: 67000, expenses: 41000 },
];

const SERVICES = ['Consultation','Lab Tests','X-Ray','MRI Scan','CT Scan','Surgery','Physiotherapy','Specialist Referral','Emergency Care','Vaccination','Blood Test','Prescription'];
const PAYMENT_METHODS = ['Insurance','Visa','Mastercard','American Express','Direct Bank','Cash','Cheque'];
const STATUS_LIST = ['Pending','Paid','Overdue'];

const emptyItem = () => ({ service: '', qty: 1, rate: '' });

function buildForm(inv) {
  if (!inv) return { patientName: '', method: '', status: 'Pending', dueDate: '', notes: '', items: [emptyItem()] };
  return { patientName: inv.patientName||'', method: inv.method||'', status: inv.status||'Pending', dueDate: inv.dueDate||'', notes: inv.notes||'', items: inv.items ? JSON.parse(JSON.stringify(inv.items)) : [emptyItem()] };
}

function calcTotal(items) {
  return items.reduce((sum, it) => sum + (parseFloat(it.rate) || 0) * (parseInt(it.qty) || 0), 0);
}

export default function Billing() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(buildForm(null));
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = invoices.filter(inv => {
    const q = search.toLowerCase();
    return (inv.patientName.toLowerCase().includes(q) || inv.id.toLowerCase().includes(q)) && (!statusFilter || inv.status === statusFilter);
  });

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + calcTotal(i.items), 0);
  const totalPending = invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + calcTotal(i.items), 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + calcTotal(i.items), 0);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };
  const setItem = (idx, k, v) => setForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, [k]: v } : it) }));
  const addItem = () => setForm(f => ({ ...f, items: [...f.items, emptyItem()] }));
  const removeItem = idx => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = 'Required';
    if (!form.method) e.method = 'Required';
    if (form.items.every(it => !it.service || !it.rate)) e.items = 'Add at least one service with rate';
    return e;
  };

  const openAdd = () => { setForm(buildForm(null)); setErrors({}); setSuccess(false); setModal('add'); };
  const openEdit = (inv, ev) => { ev && ev.stopPropagation(); setSelected(inv); setForm(buildForm(inv)); setErrors({}); setSuccess(false); setModal('edit'); };
  const openView = (inv, ev) => { ev && ev.stopPropagation(); setSelected(inv); setModal('view'); };
  const closeModal = () => { setModal(null); setSelected(null); setSuccess(false); };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const data = { ...form };
    if (modal === 'add') addInvoice(data);
    else updateInvoice(selected.id, data);
    setSuccess(true);
    setTimeout(closeModal, 1600);
  };

  const quickStatus = (id, status) => updateInvoice(id, { status });

  const statusColor = s =>
    s === 'Paid' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
    s === 'Pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
    'bg-red-50 dark:bg-red-900/20 text-red-600';

  const total = calcTotal(form.items);



  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold font-headline text-blue-900 dark:text-blue-400">Financial Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor revenue, expenses, and patient billing</p>
        </div>
        <button onClick={openAdd} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95"><Plus size={18} /><span className="text-sm">Create Invoice</span></button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary p-6 rounded-2xl shadow-lg shadow-primary/20 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Total Collected</p>
            <h3 className="text-3xl font-extrabold font-headline mb-3">${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <div className="flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-2 py-1 rounded-lg"><ArrowUpRight size={13} /> {invoices.filter(i => i.status === 'Paid').length} paid invoices</div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Pending Payments</p>
          <h3 className="text-3xl font-extrabold font-headline text-slate-900 dark:text-slate-100 mb-3">${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          <div className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 w-fit px-2 py-1 rounded-lg">{invoices.filter(i => i.status === 'Pending').length} invoices outstanding</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Overdue</p>
          <h3 className="text-3xl font-extrabold font-headline text-slate-900 dark:text-slate-100 mb-3">${totalOverdue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 w-fit px-2 py-1 rounded-lg"><ArrowDownRight size={13} /> {invoices.filter(i => i.status === 'Overdue').length} overdue invoices</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart + search */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white dark:bg-slate-900 p-7 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold font-headline text-slate-900 dark:text-slate-100">Revenue vs Expenses</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded-full bg-primary" /> Revenue</div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" /> Expenses</div>
              </div>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={billingData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#003d9b" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#003d9b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} formatter={v => ['$' + v.toLocaleString()]} />
                  <Area type="monotone" dataKey="revenue" stroke="#003d9b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="expenses" stroke="#e2e8f0" strokeWidth={2} fill="transparent" className="dark:stroke-slate-700" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Search + filter */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input type="text" placeholder="Search invoices..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none text-slate-900 dark:text-slate-100" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="relative">
              <button onClick={() => setShowFilter(v => !v)} className={cn("flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-colors", statusFilter ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700')}>
                <Filter size={15} />{statusFilter || 'Filter'}
              </button>
              {showFilter && (
                <div className="absolute right-0 top-12 z-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden w-36">
                  <button onClick={() => { setStatusFilter(''); setShowFilter(false); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">All Status</button>
                  {STATUS_LIST.map(s => <button key={s} onClick={() => { setStatusFilter(s); setShowFilter(false); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">{s}</button>)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invoice list */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden h-fit">
          <div className="p-5 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-sm font-bold font-headline text-slate-900 dark:text-slate-100">Invoices <span className="text-slate-400 font-normal text-xs ml-1">({filtered.length})</span></h2>
            <button onClick={openAdd} className="text-primary text-xs font-bold hover:underline flex items-center gap-1"><Plus size={12} />New</button>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-[480px] overflow-y-auto">
            {filtered.length === 0 && <div className="p-8 text-center text-slate-400 text-xs font-medium">No invoices found</div>}
            {filtered.map(inv => (
              <div key={inv.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="flex justify-between items-start mb-1.5">
                  <div><p className="text-sm font-bold text-slate-900 dark:text-slate-100">{inv.patientName}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{inv.id} • {inv.date}</p></div>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">${calcTotal(inv.items).toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md", statusColor(inv.status))}>{inv.status}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => openView(inv, e)} className="p-1 text-slate-400 hover:text-primary transition-colors"><Eye size={13} /></button>
                    <button onClick={e => openEdit(inv, e)} className="p-1 text-slate-400 hover:text-amber-500 transition-colors"><Pencil size={13} /></button>
                    <button className="p-1 text-slate-400 hover:text-primary transition-colors"><Download size={13} /></button>
                    <button onClick={e => { e.stopPropagation(); setConfirmDelete(inv); }} className="p-1 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
                {/* Quick status change */}
                {inv.status !== 'Paid' && (
                  <div className="flex gap-2 mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                    {inv.status !== 'Paid' && <button onClick={() => quickStatus(inv.id, 'Paid')} className="text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-2 py-1 rounded-md transition-all">Mark Paid</button>}
                    {inv.status === 'Pending' && <button onClick={() => quickStatus(inv.id, 'Overdue')} className="text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-md transition-all">Mark Overdue</button>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal open={modal === 'add' || modal === 'edit'} onClose={closeModal} maxWidth="max-w-xl"
        title={modal === 'add' ? 'Create Invoice' : 'Edit Invoice'}
        subtitle={modal === 'add' ? 'Generate a billing invoice for a patient' : `Editing ${selected?.id}`}
        success={success} successTitle={modal === 'add' ? 'Invoice Created!' : 'Invoice Updated!'} successMsg="The invoice has been saved.">

    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Patient Name <span className="text-red-500">*</span></label>
          <input value={form.patientName} onChange={e => set('patientName', e.target.value)} className={cn("w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 outline-none", errors.patientName ? 'border-red-400' : 'border-slate-200 dark:border-slate-700')} />
          {errors.patientName && <p className="text-[10px] text-red-500 mt-1">{errors.patientName}</p>}
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Payment Method <span className="text-red-500">*</span></label>
          <select value={form.method} onChange={e => set('method', e.target.value)} className={cn("w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 outline-none", errors.method ? 'border-red-400' : 'border-slate-200 dark:border-slate-700')}>
            <option value="">Select…</option>
            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.method && <p className="text-[10px] text-red-500 mt-1">{errors.method}</p>}
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Status</label>
          <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 outline-none">
            {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">Due Date</label>
          <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 outline-none" />
        </div>
      </div>

      {/* Line items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Services & Charges</p>
          {errors.items && <p className="text-[10px] text-red-500">{errors.items}</p>}
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 px-1">
            <span className="col-span-6 text-[9px] font-bold uppercase tracking-widest text-slate-400">Service</span>
            <span className="col-span-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Qty</span>
            <span className="col-span-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">Rate ($)</span>
            <span className="col-span-1" />
          </div>
          {form.items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <select value={it.service} onChange={e => setItem(idx, 'service', e.target.value)} className="col-span-6 px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">Select…</option>
                {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="number" min="1" value={it.qty} onChange={e => setItem(idx, 'qty', e.target.value)} className="col-span-2 px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20" />
              <input type="number" placeholder="0.00" value={it.rate} onChange={e => setItem(idx, 'rate', e.target.value)} className="col-span-3 px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-primary/20" />
              <button onClick={() => removeItem(idx)} disabled={form.items.length === 1} className="col-span-1 p-1.5 text-slate-300 hover:text-red-400 disabled:opacity-30 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-900/20"><X size={13} /></button>
            </div>
          ))}
          <button onClick={addItem} className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors mt-1.5"><Plus size={13} />Add Line Item</button>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 flex justify-between items-center">
        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Total Amount</span>
        <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">${total.toFixed(2)}</span>
      </div>

      <FormField label="Notes" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any billing notes…" />

      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
        <button onClick={handleSubmit} className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95 flex items-center gap-2">
          <CreditCard size={15} />{modal === 'add' ? 'Create Invoice' : 'Save Changes'}
        </button>
      </div>
    </div>
 
      </Modal>

      {/* View Invoice Modal */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800">
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
              <div><h2 className="font-extrabold text-slate-900 dark:text-slate-100">{selected.patientName}</h2><p className="text-xs text-slate-500">{selected.id} • {selected.date}</p></div>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full", statusColor(selected.status))}>{selected.status}</span>
                <span className="text-xs text-slate-500">{selected.method}</span>
                {selected.dueDate && <span className="text-xs text-slate-500">Due: {selected.dueDate}</span>}
              </div>
              {/* Items table */}
              <div className="space-y-2">
                <div className="grid grid-cols-12 px-1">
                  <span className="col-span-6 text-[9px] font-bold uppercase tracking-widest text-slate-400">Service</span>
                  <span className="col-span-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">Qty</span>
                  <span className="col-span-4 text-[9px] font-bold uppercase tracking-widest text-slate-400 text-right">Amount</span>
                </div>
                {selected.items.map((it, i) => (
                  <div key={i} className="grid grid-cols-12 px-1 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <span className="col-span-6 text-xs font-semibold text-slate-700 dark:text-slate-300">{it.service}</span>
                    <span className="col-span-2 text-xs text-slate-500">{it.qty}</span>
                    <span className="col-span-4 text-xs font-bold text-slate-900 dark:text-slate-100 text-right">${(parseFloat(it.rate) * parseInt(it.qty)).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Total</span>
                  <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">${calcTotal(selected.items).toFixed(2)}</span>
                </div>
              </div>
              {selected.notes && <p className="text-xs text-slate-500 italic">{selected.notes}</p>}
              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button onClick={e => { closeModal(); setTimeout(() => openEdit(selected, e), 50); }} className="flex-1 py-2.5 rounded-xl bg-primary/5 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-1.5"><Pencil size={14} />Edit</button>
                <button className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"><Download size={14} />Download</button>
                <button onClick={() => { closeModal(); setConfirmDelete(selected); }} className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => deleteInvoice(confirmDelete.id)}
        title="Delete Invoice" message={`Delete invoice ${confirmDelete?.id} for ${confirmDelete?.patientName}? This cannot be undone.`} danger />
    </div>
  );
}
