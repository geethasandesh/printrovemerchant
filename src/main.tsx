import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tailwind.css'
import App from './App.tsx'
import '@shopify/polaris/build/esm/styles.css';
import './pages/dashboard/data-table-style.css';
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CookiesProvider>
    <App />
    </CookiesProvider>
  </StrictMode>,
)
