import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Analytics } from '@vercel/analytics/react'

// Use createRoot API for React 18
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics />
    <App />
  </StrictMode>
)