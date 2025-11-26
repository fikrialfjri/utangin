import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import dayjs from 'dayjs';

import App from './App';

import '@/assets/css/index.css';
import 'dayjs/locale/id';

dayjs.locale('id');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
