import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import Dashboard from './components/Dashboard.jsx';
import Patients from './components/Patients.jsx';
import PatientDetail from './components/PatientDetail.jsx';
import Doctors from './components/Doctors.jsx';
import DoctorDetail from './components/DoctorDetail.jsx';
import Appointments from './components/Appointments.jsx';
import MedicalRecords from './components/MedicalRecords.jsx';
import Billing from './components/Billing.jsx';
import Settings from './components/Settings.jsx';
import AISymptomChecker from './components/AISymptomChecker.jsx';
import QRCheckIn from './components/QRCheckIn.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="patients/:id" element={<PatientDetail />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/:id" element={<DoctorDetail />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
          <Route path="ai-symptom" element={<AISymptomChecker />} />
          <Route path="qr-checkin" element={<QRCheckIn />} />
        </Route>
      </Routes>
    </Router>
  );
}
