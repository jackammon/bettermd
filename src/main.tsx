import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'
import { themeScript } from './lib/theme-script'

// Inject theme script into head
const script = document.createElement('script');
script.innerHTML = themeScript;
document.head.appendChild(script);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
