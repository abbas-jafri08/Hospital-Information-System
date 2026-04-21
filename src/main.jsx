import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import { RoleProvider } from './context/RoleContext.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <RoleProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </RoleProvider>
    </ThemeProvider>
  </React.StrictMode>
);
