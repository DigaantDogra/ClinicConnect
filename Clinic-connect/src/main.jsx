import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Set mock doctor ID for testing
localStorage.setItem('doctorId', '1');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App user='Doctor'/>
  </StrictMode>,
)
