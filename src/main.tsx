import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// Use createRoot API for React 18
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)