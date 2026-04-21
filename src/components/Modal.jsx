import React from 'react';
import { X, Check } from 'lucide-react';

export default function Modal({ open, onClose, title, subtitle, success, successTitle, successMsg, children, maxWidth = 'max-w-2xl' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-800`}>
        <div className="sticky top-0 bg-white dark:bg-slate-900 px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start z-10">
          <div>
            <h2 className="text-lg font-extrabold font-headline text-blue-900 dark:text-blue-400">{title}</h2>
            {subtitle && <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><X size={18} /></button>
        </div>
        {success ? (
          <div className="px-6 py-16 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center"><Check size={32} className="text-emerald-600" /></div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{successTitle}</p>
            {successMsg && <p className="text-xs text-slate-500">{successMsg}</p>}
          </div>
        ) : (
          <div className="p-6">{children}</div>
        )}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, danger }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 dark:border-slate-800 p-6">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className={`px-4 py-2 rounded-xl text-sm font-bold text-white transition-all ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-container'}`}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export function FormField({ label, name, type = 'text', options, required, value, onChange, error, placeholder, rows }) {
  const base = `w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 outline-none transition-all ${error ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`;
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {options ? (
        <select value={value} onChange={onChange} className={base}>
          <option value="">Select…</option>
          {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : rows ? (
        <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder} className={base + ' resize-none'} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={base} />
      )}
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}
