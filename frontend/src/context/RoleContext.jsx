import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext(undefined);

export const ROLES = {
  admin:       { label: 'Administrator',  color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', permissions: ['dashboard','patients','doctors','appointments','medical-records','billing','settings','ai-symptom','qr-checkin'] },
  doctor:      { label: 'Doctor',         color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',         permissions: ['dashboard','patients','doctors','appointments','medical-records','ai-symptom','qr-checkin'] },
  nurse:       { label: 'Nurse',          color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', permissions: ['dashboard','patients','appointments','medical-records','qr-checkin'] },
  receptionist:{ label: 'Receptionist',   color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',     permissions: ['dashboard','patients','appointments','qr-checkin'] },
};

export function RoleProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('sh_role') || 'admin');

  const changeRole = (r) => {
    setRole(r);
    localStorage.setItem('sh_role', r);
  };

  const can = (page) => ROLES[role]?.permissions.includes(page) ?? false;

  return (
    <RoleContext.Provider value={{ role, changeRole, can, roleInfo: ROLES[role] }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
