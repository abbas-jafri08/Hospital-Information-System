import React, { useState, useRef } from 'react';
import { QrCode, Search, CheckCircle2, Clock, Download, Printer, UserCheck, RefreshCw, X, Scan } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useData } from '@/src/context/DataContext.jsx';

// Simple SVG QR code using a deterministic grid pattern based on patient ID
function QRCodeSVG({ value, size = 160 }) {
  const modules = 21;
  const cellSize = size / modules;

  // Generate a deterministic bit pattern from the string
  const bits = [];
  let seed = 0;
  for (let i = 0; i < value.length; i++) seed = ((seed << 5) - seed + value.charCodeAt(i)) | 0;

  const rand = (() => {
    let s = Math.abs(seed) || 12345;
    return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 4294967296; };
  })();

  for (let r = 0; r < modules; r++) {
    bits[r] = [];
    for (let c = 0; c < modules; c++) {
      // Finder patterns (top-left, top-right, bottom-left)
      const inFinder = (
        (r < 8 && c < 8) ||
        (r < 8 && c >= modules - 8) ||
        (r >= modules - 8 && c < 8)
      );
      if (inFinder) {
        const lr = r < 8 ? r : r - (modules - 8);
        const lc = c < 8 ? c : c - (modules - 8);
        const isOuter = lr === 0 || lr === 6 || lc === 0 || lc === 6;
        const isInner = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
        bits[r][c] = isOuter || isInner;
      } else {
        bits[r][c] = rand() > 0.45;
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" />
      {bits.map((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill="#1e293b" /> : null
        )
      )}
    </svg>
  );
}

const CHECK_IN_HISTORY = [
  { id: 'CI-001', patient: 'Robert Fox', patientId: 'PT-8821', time: '09:05 AM', status: 'Checked In', doctor: 'Dr. Sarah Jenkins' },
  { id: 'CI-002', patient: 'Esther Howard', patientId: 'PT-8822', time: '09:42 AM', status: 'Checked In', doctor: 'Dr. Emily Rodriguez' },
  { id: 'CI-003', patient: 'Jenny Wilson', patientId: 'PT-8823', time: '10:18 AM', status: 'Waiting', doctor: 'Dr. Michael Chen' },
];

export default function QRCheckIn() {
  const { patients } = useData();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [checkedIn, setCheckedIn] = useState([]);
  const [history, setHistory] = useState(CHECK_IN_HISTORY);
  const [scanMode, setScanMode] = useState(false);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const printRef = useRef(null);

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  }).slice(0, 8);

  const handleCheckIn = (patient) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const entry = {
      id: 'CI-' + String(history.length + 1).padStart(3, '0'),
      patient: patient.name,
      patientId: patient.id,
      time: timeStr,
      status: 'Checked In',
      doctor: patient.condition || 'General',
    };
    setCheckedIn(prev => [...prev, patient.id]);
    setHistory(prev => [entry, ...prev]);
  };

  const handleScan = () => {
    const found = patients.find(p => p.id === scanInput.trim().toUpperCase() || p.name.toLowerCase() === scanInput.trim().toLowerCase());
    if (found) {
      setScanResult({ type: 'success', patient: found });
      handleCheckIn(found);
    } else {
      setScanResult({ type: 'error', msg: `No patient found for "${scanInput}"` });
    }
  };

  const downloadQR = (patient) => {
    const svg = document.getElementById(`qr-${patient.id}`);
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `QR-${patient.id}.svg`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold font-headline text-blue-900 dark:text-blue-400 flex items-center gap-2">
            <QrCode size={26} className="text-primary" /> QR Patient Check-in
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Generate QR codes and streamline patient arrivals</p>
        </div>
        <button
          onClick={() => { setScanMode(v => !v); setScanResult(null); setScanInput(''); }}
          className={cn('flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95',
            scanMode ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : 'bg-primary text-white shadow-primary/20')}
        >
          <Scan size={18} /> {scanMode ? 'Close Scanner' : 'Scan QR Code'}
        </button>
      </div>

      {/* Scan Mode Panel */}
      {scanMode && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-primary/20 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"><Scan size={16} className="text-primary" /> QR Scanner</h3>
          <p className="text-xs text-slate-500">Enter the patient ID or scan the QR code below:</p>
          <div className="flex gap-3">
            <input
              autoFocus
              value={scanInput}
              onChange={e => { setScanInput(e.target.value); setScanResult(null); }}
              onKeyDown={e => e.key === 'Enter' && handleScan()}
              placeholder="PT-8821 or patient name…"
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
            />
            <button onClick={handleScan} className="px-5 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-container transition-all">Check In</button>
          </div>
          {scanResult && (
            <div className={cn('p-4 rounded-xl border flex items-start gap-3',
              scanResult.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800')}>
              {scanResult.type === 'success' ? (
                <>
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">✓ Checked In Successfully</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500">{scanResult.patient.name} • {scanResult.patient.id} • {scanResult.patient.condition}</p>
                  </div>
                </>
              ) : (
                <>
                  <X size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{scanResult.msg}</p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Patient Search + QR Generator */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Search Patient</p>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                placeholder="Name or Patient ID…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="space-y-2">
              {filtered.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={cn('flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all',
                    selected?.id === p.id
                      ? 'bg-primary/5 border-primary/20 dark:bg-primary/10'
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{p.id} • {p.condition}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {checkedIn.includes(p.id) && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">Checked In</span>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); handleCheckIn(p); }}
                      disabled={checkedIn.includes(p.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-primary text-white hover:bg-primary-container transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    >
                      <UserCheck size={11} /> Check In
                    </button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <p className="text-center text-xs text-slate-400 py-6">No patients found.</p>}
            </div>
          </div>
        </div>

        {/* QR Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm flex flex-col items-center gap-4">
            {selected ? (
              <>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 self-start">QR Code</p>
                <div id={`qr-${selected.id}`} className="p-3 bg-white rounded-xl border border-slate-200 shadow-inner">
                  <QRCodeSVG value={`SANCTUARY:${selected.id}:${selected.name}`} size={160} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-900 dark:text-slate-100">{selected.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{selected.id}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selected.condition}</p>
                </div>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => downloadQR(selected)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <Download size={13} /> Download
                  </button>
                  <button
                    onClick={() => handleCheckIn(selected)}
                    disabled={checkedIn.includes(selected.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  >
                    <UserCheck size={13} /> {checkedIn.includes(selected.id) ? 'Checked In' : 'Check In'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  <QrCode size={28} className="text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-sm text-slate-400">Select a patient to generate their QR code</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 p-4">
              <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">{history.filter(h => h.status === 'Checked In').length}</p>
              <p className="text-[10px] font-bold uppercase text-emerald-600/70 tracking-widest">Checked In</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800 p-4">
              <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-400">{history.filter(h => h.status === 'Waiting').length}</p>
              <p className="text-[10px] font-bold uppercase text-amber-600/70 tracking-widest">Waiting</p>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in History */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"><Clock size={15} className="text-primary" /> Today's Check-in Log</h3>
          <button onClick={() => setHistory(CHECK_IN_HISTORY)} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"><RefreshCw size={11} /> Reset</button>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {history.map(entry => (
            <div key={entry.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {entry.patient.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{entry.patient}</p>
                  <p className="text-[10px] text-slate-400">{entry.patientId} • {entry.doctor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">{entry.time}</span>
                <span className={cn('text-[10px] font-bold uppercase px-2.5 py-1 rounded-full',
                  entry.status === 'Checked In'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400')}>
                  {entry.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
