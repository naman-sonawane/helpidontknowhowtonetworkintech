import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import AppRoutes from './routes'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <div className='min-w-screen'>
      <AppRoutes />
    </div>
  </BrowserRouter>
)