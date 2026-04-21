import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';

export function Layout() {
  return (
    <div className="min-h-screen bg-surface dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      <main className="ml-64 flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
