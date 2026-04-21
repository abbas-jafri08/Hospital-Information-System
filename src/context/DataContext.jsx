import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext(undefined);

const initialPatients = [
  { id: 'PT-8821', firstName: 'Robert', lastName: 'Fox', name: 'Robert Fox', age: 42, dob: '1982-03-10', gender: 'Male', blood: 'A+', status: 'Inpatient', lastVisit: '2024-03-15', condition: 'Hypertension', phone: '+1 555-0101', email: 'robert.fox@email.com', address: '123 Oak St, NY', emergencyContact: 'Mary Fox', emergencyPhone: '+1 555-0102' },
  { id: 'PT-8822', firstName: 'Esther', lastName: 'Howard', name: 'Esther Howard', age: 35, dob: '1989-07-22', gender: 'Female', blood: 'O-', status: 'Outpatient', lastVisit: '2024-03-18', condition: 'Fractured Tibia', phone: '+1 555-0201', email: 'esther.h@email.com', address: '456 Elm Ave, CA', emergencyContact: 'Tom Howard', emergencyPhone: '+1 555-0202' },
  { id: 'PT-8823', firstName: 'Jenny', lastName: 'Wilson', name: 'Jenny Wilson', age: 28, dob: '1996-01-05', gender: 'Female', blood: 'B+', status: 'Observation', lastVisit: '2024-03-20', condition: 'Pneumonia', phone: '+1 555-0301', email: 'jenny.w@email.com', address: '789 Pine Rd, TX', emergencyContact: 'Jake Wilson', emergencyPhone: '+1 555-0302' },
  { id: 'PT-8824', firstName: 'Cameron', lastName: 'Williamson', name: 'Cameron Williamson', age: 54, dob: '1970-11-18', gender: 'Male', blood: 'AB+', status: 'Inpatient', lastVisit: '2024-03-10', condition: 'Post-Op Recovery', phone: '+1 555-0401', email: 'cam.w@email.com', address: '321 Maple Dr, FL', emergencyContact: 'Sue Williamson', emergencyPhone: '+1 555-0402' },
  { id: 'PT-8825', firstName: 'Jerome', lastName: 'Bell', name: 'Jerome Bell', age: 61, dob: '1963-06-30', gender: 'Male', blood: 'O+', status: 'Discharged', lastVisit: '2024-03-05', condition: 'Diabetes Type 2', phone: '+1 555-0501', email: 'jerome.b@email.com', address: '654 Cedar Ln, WA', emergencyContact: 'Linda Bell', emergencyPhone: '+1 555-0502' },
  { id: 'PT-8826', firstName: 'Kathryn', lastName: 'Murphy', name: 'Kathryn Murphy', age: 47, dob: '1977-09-14', gender: 'Female', blood: 'A-', status: 'Outpatient', lastVisit: '2024-03-22', condition: 'Migraine', phone: '+1 555-0601', email: 'kath.m@email.com', address: '987 Birch Blvd, IL', emergencyContact: 'Pat Murphy', emergencyPhone: '+1 555-0602' },
];

const initialDoctors = [
  { id: 'DOC-001', firstName: 'Sarah', lastName: 'Jenkins', name: 'Dr. Sarah Jenkins', specialty: 'Cardiology', rating: 4.9, reviews: 124, status: 'On Duty', experience: '12', department: 'Cardiology', email: 's.jenkins@sanctuary.health', phone: '+1 555-1001', image: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=200&h=200', schedule: [{ day: 'Monday', start: '09:00', end: '17:00', available: true }, { day: 'Tuesday', start: '09:00', end: '17:00', available: true }, { day: 'Wednesday', start: '09:00', end: '13:00', available: true }, { day: 'Thursday', start: '09:00', end: '17:00', available: true }, { day: 'Friday', start: '09:00', end: '17:00', available: true }, { day: 'Saturday', start: '', end: '', available: false }, { day: 'Sunday', start: '', end: '', available: false }] },
  { id: 'DOC-002', firstName: 'Michael', lastName: 'Chen', name: 'Dr. Michael Chen', specialty: 'Neurology', rating: 4.8, reviews: 98, status: 'In Surgery', experience: '8', department: 'Neurology', email: 'm.chen@sanctuary.health', phone: '+1 555-1002', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200', schedule: [{ day: 'Monday', start: '08:00', end: '16:00', available: true }, { day: 'Tuesday', start: '08:00', end: '16:00', available: true }, { day: 'Wednesday', start: '08:00', end: '16:00', available: true }, { day: 'Thursday', start: '08:00', end: '16:00', available: true }, { day: 'Friday', start: '08:00', end: '12:00', available: true }, { day: 'Saturday', start: '', end: '', available: false }, { day: 'Sunday', start: '', end: '', available: false }] },
  { id: 'DOC-003', firstName: 'Emily', lastName: 'Rodriguez', name: 'Dr. Emily Rodriguez', specialty: 'Pediatrics', rating: 5.0, reviews: 215, status: 'On Duty', experience: '15', department: 'Pediatrics', email: 'e.rodriguez@sanctuary.health', phone: '+1 555-1003', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200', schedule: [{ day: 'Monday', start: '09:00', end: '17:00', available: true }, { day: 'Tuesday', start: '09:00', end: '17:00', available: true }, { day: 'Wednesday', start: '09:00', end: '17:00', available: true }, { day: 'Thursday', start: '09:00', end: '17:00', available: true }, { day: 'Friday', start: '09:00', end: '15:00', available: true }, { day: 'Saturday', start: '10:00', end: '13:00', available: true }, { day: 'Sunday', start: '', end: '', available: false }] },
  { id: 'DOC-004', firstName: 'James', lastName: 'Wilson', name: 'Dr. James Wilson', specialty: 'Orthopedics', rating: 4.7, reviews: 86, status: 'Off Duty', experience: '10', department: 'Orthopedics', email: 'j.wilson@sanctuary.health', phone: '+1 555-1004', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200', schedule: [{ day: 'Monday', start: '10:00', end: '18:00', available: true }, { day: 'Tuesday', start: '10:00', end: '18:00', available: true }, { day: 'Wednesday', start: '', end: '', available: false }, { day: 'Thursday', start: '10:00', end: '18:00', available: true }, { day: 'Friday', start: '10:00', end: '18:00', available: true }, { day: 'Saturday', start: '', end: '', available: false }, { day: 'Sunday', start: '', end: '', available: false }] },
  { id: 'DOC-005', firstName: 'Lisa', lastName: 'Wang', name: 'Dr. Lisa Wang', specialty: 'Dermatology', rating: 4.9, reviews: 156, status: 'On Duty', experience: '7', department: 'Dermatology', email: 'l.wang@sanctuary.health', phone: '+1 555-1005', image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=200&h=200', schedule: [{ day: 'Monday', start: '09:00', end: '17:00', available: true }, { day: 'Tuesday', start: '09:00', end: '17:00', available: true }, { day: 'Wednesday', start: '09:00', end: '17:00', available: true }, { day: 'Thursday', start: '09:00', end: '17:00', available: true }, { day: 'Friday', start: '09:00', end: '17:00', available: true }, { day: 'Saturday', start: '', end: '', available: false }, { day: 'Sunday', start: '', end: '', available: false }] },
  { id: 'DOC-006', firstName: 'David', lastName: 'Miller', name: 'Dr. David Miller', specialty: 'General Surgery', rating: 4.8, reviews: 112, status: 'In Surgery', experience: '20', department: 'Surgery', email: 'd.miller@sanctuary.health', phone: '+1 555-1006', image: 'https://images.unsplash.com/photo-1612531388260-6303b896c2c1?auto=format&fit=crop&q=80&w=200&h=200', schedule: [{ day: 'Monday', start: '07:00', end: '15:00', available: true }, { day: 'Tuesday', start: '07:00', end: '15:00', available: true }, { day: 'Wednesday', start: '07:00', end: '15:00', available: true }, { day: 'Thursday', start: '07:00', end: '15:00', available: true }, { day: 'Friday', start: '07:00', end: '13:00', available: true }, { day: 'Saturday', start: '', end: '', available: false }, { day: 'Sunday', start: '', end: '', available: false }] },
];

const initialAppointments = [
  { id: 'APT-101', patientName: 'Robert Fox', doctorId: 'DOC-001', doctorName: 'Dr. Sarah Jenkins', time: '09:00', date: '2024-04-10', type: 'In-Person', status: 'Confirmed', specialty: 'Cardiology', notes: 'Follow-up on blood pressure medication' },
  { id: 'APT-102', patientName: 'Esther Howard', doctorId: 'DOC-003', doctorName: 'Dr. Emily Rodriguez', time: '10:30', date: '2024-04-10', type: 'Telehealth', status: 'Pending', specialty: 'Pediatrics', notes: '' },
  { id: 'APT-103', patientName: 'Jenny Wilson', doctorId: 'DOC-002', doctorName: 'Dr. Michael Chen', time: '13:15', date: '2024-04-10', type: 'In-Person', status: 'Confirmed', specialty: 'Neurology', notes: 'MRI results review' },
  { id: 'APT-104', patientName: 'Cameron Williamson', doctorId: 'DOC-006', doctorName: 'Dr. David Miller', time: '15:45', date: '2024-04-09', type: 'In-Person', status: 'Cancelled', specialty: 'General Surgery', notes: '' },
  { id: 'APT-105', patientName: 'Jerome Bell', doctorId: 'DOC-005', doctorName: 'Dr. Lisa Wang', time: '09:30', date: '2024-03-20', type: 'Telehealth', status: 'Completed', specialty: 'Dermatology', notes: 'Skin check annual' },
  { id: 'APT-106', patientName: 'Kathryn Murphy', doctorId: 'DOC-002', doctorName: 'Dr. Michael Chen', time: '11:00', date: '2024-03-18', type: 'In-Person', status: 'Completed', specialty: 'Neurology', notes: 'Migraine management' },
];

const initialRecords = [
  { id: 'REC-2024-001', patientName: 'Robert Fox', type: 'Lab Result', date: '2024-03-25', doctorName: 'Dr. Sarah Jenkins', status: 'Final', size: '1.2 MB', notes: 'CBC and metabolic panel', fileName: 'lab_result_fox.pdf' },
  { id: 'REC-2024-002', patientName: 'Esther Howard', type: 'Prescription', date: '2024-03-24', doctorName: 'Dr. Emily Rodriguez', status: 'Active', size: '450 KB', notes: 'Amoxicillin 500mg', fileName: 'prescription_howard.pdf' },
  { id: 'REC-2024-003', patientName: 'Jenny Wilson', type: 'X-Ray Scan', date: '2024-03-22', doctorName: 'Dr. Michael Chen', status: 'Final', size: '15.4 MB', notes: 'Chest X-ray', fileName: 'xray_wilson.jpg' },
  { id: 'REC-2024-004', patientName: 'Cameron Williamson', type: 'Discharge Summary', date: '2024-03-20', doctorName: 'Dr. David Miller', status: 'Draft', size: '890 KB', notes: 'Post-op summary pending sign-off', fileName: 'discharge_williamson.pdf' },
  { id: 'REC-2024-005', patientName: 'Jerome Bell', type: 'Blood Test', date: '2024-03-18', doctorName: 'Dr. Sarah Jenkins', status: 'Final', size: '1.1 MB', notes: 'HbA1c levels', fileName: 'blood_test_bell.pdf' },
  { id: 'REC-2024-006', patientName: 'Kathryn Murphy', type: 'MRI Report', date: '2024-03-15', doctorName: 'Dr. Michael Chen', status: 'Final', size: '22.8 MB', notes: 'Brain MRI - no abnormalities', fileName: 'mri_murphy.dcm' },
];

const initialInvoices = [
  { id: 'INV-001', patientName: 'Robert Fox', date: '2024-03-25', dueDate: '2024-04-25', items: [{ service: 'Consultation', qty: 1, rate: 300 }, { service: 'Lab Tests', qty: 2, rate: 475 }], status: 'Paid', method: 'Visa •••• 4242', notes: '' },
  { id: 'INV-002', patientName: 'Esther Howard', date: '2024-03-24', dueDate: '2024-04-24', items: [{ service: 'Consultation', qty: 1, rate: 250 }, { service: 'Prescription', qty: 1, rate: 600.5 }], status: 'Pending', method: 'Insurance', notes: '' },
  { id: 'INV-003', patientName: 'Jenny Wilson', date: '2024-03-22', dueDate: '2024-04-22', items: [{ service: 'X-Ray', qty: 1, rate: 800 }, { service: 'Specialist Referral', qty: 1, rate: 1300 }], status: 'Paid', method: 'Mastercard •••• 8812', notes: '' },
  { id: 'INV-004', patientName: 'Cameron Williamson', date: '2024-03-20', dueDate: '2024-03-30', items: [{ service: 'Consultation', qty: 1, rate: 450 }], status: 'Overdue', method: 'Direct Bank', notes: 'Follow up needed' },
  { id: 'INV-005', patientName: 'Jerome Bell', date: '2024-03-18', dueDate: '2024-04-18', items: [{ service: 'Blood Test', qty: 2, rate: 900 }, { service: 'Consultation', qty: 1, rate: 1400 }], status: 'Paid', method: 'Visa •••• 1102', notes: '' },
];

function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  const setAndPersist = (updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  return [state, setAndPersist];
}

export function DataProvider({ children }) {
  const [patients, setPatients] = useLocalState('sh_patients', initialPatients);
  const [doctors, setDoctors] = useLocalState('sh_doctors', initialDoctors);
  const [appointments, setAppointments] = useLocalState('sh_appointments', initialAppointments);
  const [records, setRecords] = useLocalState('sh_records', initialRecords);
  const [invoices, setInvoices] = useLocalState('sh_invoices', initialInvoices);

  // Patients CRUD
  const addPatient = (data) => {
    const age = data.dob ? new Date().getFullYear() - new Date(data.dob).getFullYear() : 0;
    const id = 'PT-' + (8820 + patients.length + 1);
    const p = { ...data, id, name: data.firstName + ' ' + data.lastName, age, lastVisit: new Date().toISOString().split('T')[0] };
    setPatients(prev => [p, ...prev]);
    return p;
  };
  const updatePatient = (id, data) => {
    const age = data.dob ? new Date().getFullYear() - new Date(data.dob).getFullYear() : 0;
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...data, name: data.firstName + ' ' + data.lastName, age } : p));
  };
  const deletePatient = (id) => setPatients(prev => prev.filter(p => p.id !== id));

  // Doctors CRUD
  const addDoctor = (data) => {
    const id = 'DOC-' + String(doctors.length + 1).padStart(3, '0');
    const d = { ...data, id, name: 'Dr. ' + data.firstName + ' ' + data.lastName, rating: 0, reviews: 0, image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=200&h=200', schedule: [{ day: 'Monday', start: '09:00', end: '17:00', available: true }, { day: 'Tuesday', start: '09:00', end: '17:00', available: true }, { day: 'Wednesday', start: '09:00', end: '17:00', available: true }, { day: 'Thursday', start: '09:00', end: '17:00', available: true }, { day: 'Friday', start: '09:00', end: '17:00', available: true }, { day: 'Saturday', start: '', end: '', available: false }, { day: 'Sunday', start: '', end: '', available: false }] };
    setDoctors(prev => [d, ...prev]);
    return d;
  };
  const updateDoctor = (id, data) => setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...data, name: 'Dr. ' + data.firstName + ' ' + data.lastName } : d));
  const updateDoctorSchedule = (id, schedule) => setDoctors(prev => prev.map(d => d.id === id ? { ...d, schedule } : d));
  const deleteDoctor = (id) => setDoctors(prev => prev.filter(d => d.id !== id));

  // Appointments CRUD
  const addAppointment = (data) => {
    const id = 'APT-' + (100 + appointments.length + 1);
    const a = { ...data, id };
    setAppointments(prev => [a, ...prev]);
    return a;
  };
  const updateAppointment = (id, data) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  const deleteAppointment = (id) => setAppointments(prev => prev.filter(a => a.id !== id));

  // Records CRUD
  const addRecord = (data) => {
    const id = 'REC-2024-' + String(records.length + 1).padStart(3, '0');
    const r = { ...data, id, date: new Date().toISOString().split('T')[0] };
    setRecords(prev => [r, ...prev]);
    return r;
  };
  const updateRecord = (id, data) => setRecords(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  const deleteRecord = (id) => setRecords(prev => prev.filter(r => r.id !== id));

  // Invoices CRUD
  const addInvoice = (data) => {
    const id = 'INV-' + String(invoices.length + 1).padStart(3, '0');
    const inv = { ...data, id, date: new Date().toISOString().split('T')[0] };
    setInvoices(prev => [inv, ...prev]);
    return inv;
  };
  const updateInvoice = (id, data) => setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...data } : inv));
  const deleteInvoice = (id) => setInvoices(prev => prev.filter(inv => inv.id !== id));

  return (
    <DataContext.Provider value={{
      patients, addPatient, updatePatient, deletePatient,
      doctors, addDoctor, updateDoctor, updateDoctorSchedule, deleteDoctor,
      appointments, addAppointment, updateAppointment, deleteAppointment,
      records, addRecord, updateRecord, deleteRecord,
      invoices, addInvoice, updateInvoice, deleteInvoice,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
