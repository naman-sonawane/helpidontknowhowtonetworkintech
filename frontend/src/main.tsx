import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/landing/Landing.tsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='min-w-screen'>
      <App />
    </div>
  </StrictMode>
)