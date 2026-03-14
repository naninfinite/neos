import React from 'react';
import ReactDOM from 'react-dom/client';
import { SiteShell } from './site/SiteShell';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SiteShell />
  </React.StrictMode>
);
